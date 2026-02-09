import React from 'react';
import QuickActions from '../components/QuickActions';
import RecentCards from '../components/RecentCards';
import { useContacts } from '../hooks/useContacts';

const Dashboard = () => {
  const { myCard } = useContacts();

  const handleShare = async () => {
    if (!myCard) return;

    const shareData = {
      title: `${myCard.name}의 명함`,
      text: `${myCard.name} | ${myCard.company} ${myCard.role}\n📞 ${myCard.phone}\n📧 ${myCard.email}`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          copyToClipboard(shareData.text);
        }
      }
    } else {
      copyToClipboard(shareData.text);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('명함 정보가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('공유 및 복사에 실패했습니다.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>
          안녕하세요, <br />
          <span style={{ color: 'var(--primary-color)' }}>{myCard ? myCard.name : '사용자'}님</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>오늘도 성공적인 비즈니스 되세요!</p>
      </div>

      <QuickActions />
      <RecentCards />
      
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        backgroundColor: 'var(--primary-color)', 
        borderRadius: 'var(--radius-lg)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--spacing-lg)'
      }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>내 명함 공유하기</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>QR 코드로 간편하게 전달하세요.</p>
        </div>
        <button 
          onClick={handleShare}
          className="btn-interactive" 
          style={{ 
            backgroundColor: '#fff', 
            color: 'var(--primary-color)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
            border: 'none'
          }}>
          공유
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
