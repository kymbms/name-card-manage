import React from 'react';
import Header from '../components/Header';
import { Search, Plus, ScanLine, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { myCard, contacts } = useContacts();

  // Get top 3 recent contacts (assuming higher ID = newer)
  const recentContacts = [...contacts]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  const handleShare = async () => {
    // Fallback to placeholder if myCard is not set
    const cardToShare = myCard || {
      name: '내 정보 입력 필요',
      company: '',
      phone: '',
      email: ''
    };

    const shareData = {
      title: '내 명함',
      text: `${cardToShare.name} | ${cardToShare.company}\n${cardToShare.phone}\n${cardToShare.email}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('명함 정보가 클립보드에 복사되었습니다.');
      } catch (err) {
        alert('공유하기 기능을 사용할 수 없습니다.');
      }
    }
  };

  return (
    <div className="page-container home-page">
      {/* Top Bar with Logo */}
      <div className="top-brand-bar">
        <span className="brand-logo">BizCard</span>
      </div>

      <div className="content-scroll">
        {/* Greeting Section */}
        <div className="greeting-section animate-fade-in">
          <h2>안녕하세요,<br /><span className="highlight-name">{myCard ? myCard.name : '김영민'}님</span></h2>
          <p className="greeting-sub">오늘도 성공적인 비즈니스 되세요!</p>
        </div>

        {/* Action Buttons (White Cards) */}
        <div className="action-grid animate-slide-up" style={{animationDelay: '0.1s'}}>
           <button className="action-card" onClick={() => navigate('/scan')}>
             <div className="icon-circle scan-icon">
               <ScanLine size={24} />
             </div>
             <span>명함 스캔</span>
           </button>
           <button className="action-card" onClick={() => navigate('/contacts/add')}>
             <div className="icon-circle add-icon">
               <Plus size={24} />
             </div>
             <span>추가</span>
           </button>
           <button className="action-card" onClick={() => navigate('/contacts')}>
             <div className="icon-circle search-icon">
               <Search size={24} />
             </div>
             <span>검색</span>
           </button>
        </div>

        {/* Recently Added Section */}
        <div className="section-header animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h2>최근 추가된 명함</h2>
          <button className="see-all" onClick={() => navigate('/contacts')}>더보기</button>
        </div>

        <div className="recent-grid animate-slide-up" style={{animationDelay: '0.25s'}}>
          {recentContacts.length > 0 ? (
            recentContacts.map(contact => (
              <div key={contact.id} className="recent-card-item" onClick={() => navigate(`/contacts/${contact.id}`)}>
                <div className="contact-avatar-lg" style={{ backgroundColor: contact.color || 'var(--bg-secondary)' }}>
                  {contact.photo ? (
                    <img src={contact.photo} alt={contact.name || 'Contact'} />
                  ) : (
                    <span>{(contact.name || '?').charAt(0)}</span>
                  )}
                </div>
                <div className="contact-info-lg">
                  <h3>{contact.name || '이름 없음'}</h3>
                  <p className="contact-role">{contact.role || contact.title || ''}</p>
                  <p className="contact-company">{contact.company || ''}</p>
                </div>

              </div>
            ))
          ) : (
             <div className="empty-recent" style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '30px 20px', 
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                color: 'var(--text-secondary)',
                fontSize: '14px'
             }}>
                <p>최근 추가된 명함이 없습니다.</p>
                <button 
                  onClick={() => navigate('/scan')}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: 'none',
                    borderRadius: '20px',
                    color: 'var(--primary-color)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  명함 스캔하기
                </button>
             </div>
          )}
        </div>

        {/* Share Banner */}
        <div className="share-banner animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="share-text">
            <h3>내 명함 공유하기</h3>
            <p>QR 코드로 간편하게 전달하세요.</p>
          </div>
          <button className="share-btn-small" onClick={handleShare}>공유</button>
        </div>
      </div>
      
      {/* Spacer for bottom nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default Home;
