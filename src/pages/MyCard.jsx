import React from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import Header from '../components/Header';
import { useContacts } from '../hooks/useContacts';
import { Share2, Edit2, Settings } from 'lucide-react';
import './MyCard.css';

const MyCard = () => {
  const navigate = useNavigate();
  const { myCard } = useContacts();

  // Helper to format phone number
  const formatPhoneNumber = (str) => {
    if (!str) return '';
    const cleaned = ('' + str).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return str;
  };

  const handleShare = async () => {
    if (!myCard) return;

    const shareData = {
      title: '내 명함',
      text: `${myCard.name} | ${myCard.company}\n${myCard.phone}\n${myCard.email}`,
      url: window.location.href // Or a specific profile URL if available
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('명함 정보가 클립보드에 복사되었습니다.');
      } catch (err) {
        alert('공유하기 기능을 사용할 수 없습니다.');
      }
    }
  };

  const myCardData = myCard || {
    id: 'my-card',
    name: '내 정보 입력 필요',
    title: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    tags: []
  };

  return (
    <div className="page-container my-card-page">
      <Header 
        title="내 명함" 
        showProfile={false} 
      />
      
      <div className="content-scroll">
        <div className="card-display-section animate-fade-in">
          <BusinessCard data={myCardData} />
        </div>

        <div className="my-card-actions animate-slide-up" style={{animationDelay: '0.1s'}}>
          <button className="action-btn-primary" onClick={handleShare}>
            <Share2 size={20} />
            <span>명함 공유하기</span>
          </button>
          
          <div className="secondary-actions">
            <button className="action-btn-secondary" onClick={() => navigate('/mycard/edit')}>
              <Edit2 size={20} />
              <span>정보 수정</span>
            </button>
            <button className="action-btn-secondary" onClick={() => navigate('/settings')}>
              <Settings size={20} />
              <span>설정</span>
            </button>
          </div>
        </div>

        <div className="qr-code-section animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3>나의 QR 코드</h3>
            <div className="qr-box">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BEGIN%3AVCARD%0AVERSION%3A3.0%0AFN%3A${encodeURIComponent(myCardData.name)}%0AORG%3A${encodeURIComponent(myCardData.company)}%0ATEL%3A${myCardData.phone}%0AEMAIL%3A${myCardData.email}%0AEND%3AVCARD`} alt="QR Code" />
            </div>
            <p>상대방이 QR 코드를 스캔하여<br/>내 명함을 저장할 수 있습니다.</p>
        </div>
      </div>
      
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default MyCard;
