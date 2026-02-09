import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import Header from '../components/Header';
import BusinessCard from '../components/BusinessCard';
import { Phone, Mail, MessageCircle, Share2, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact, toggleFavorite, loading } = useContacts();

  
  // Use useMemo to derive contact from contacts array instead of useEffect+useState
  const contact = React.useMemo(() => {
    return contacts.find(c => String(c.id) === String(id));
  }, [contacts, id]);
  
  const isDataLoading = loading || (contacts.length === 0 && !contact);


  const handleDelete = () => {
    if (window.confirm('정말 이 명함을 삭제하시겠습니까?')) {
      deleteContact(id);
      navigate('/contacts');
    }
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  if (!contact) {
    return (
      <div className="page-container">
        <Header title="상세 정보" />
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
           {isDataLoading ? '로딩 중...' : '연락처를 찾을 수 없습니다.'}
        </div>

        <button onClick={() => navigate('/contacts')} className="btn-secondary" style={{ margin: '0 20px' }}>
           목록으로 돌아가기
        </button>
      </div>
    );
  }

  const actionButtonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: 'var(--card-bg)',
    border: 'none',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    gap: '8px',
    flex: 1
  };
  
  // Orientation logic: default to landscape (column layout) unless explicitly portrait
  const isPortrait = contact.orientation === 'portrait';
  const imagesContainerStyle = isPortrait 
    ? { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }
    : { display: 'flex', flexDirection: 'column', gap: '16px' };
    
  const imageWrapperStyle = isPortrait
    ? { flex: '0 0 auto', width: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }
    : { width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' };

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/contacts')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          <h2 style={{ margin: 0, fontSize: '18px' }}>상세 정보</h2>
        </div>
        <button 
          onClick={handleToggleFavorite} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             width: '32px',
             height: '32px',
             borderRadius: '50%',
             backgroundColor: contact.isFavorite ? 'rgba(255, 193, 7, 0.1)' : 'transparent'
           }}>
             <Share2 size={24} style={{ display: 'none' }} />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={contact.isFavorite ? "var(--warning-color)" : "none"} 
                stroke={contact.isFavorite ? "var(--warning-color)" : "var(--text-secondary)"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
           </div>
        </button>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <BusinessCard data={contact} isEditable={false} />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button style={actionButtonStyle} onClick={() => window.open(`tel:${contact.phone}`)}>
            <Phone size={24} color="var(--primary-color)" />
            <span style={{ fontSize: '12px' }}>전화</span>
        </button>
        <button style={actionButtonStyle} onClick={() => window.open(`sms:${contact.phone}`)}>
            <MessageCircle size={24} color="var(--primary-color)" />
            <span style={{ fontSize: '12px' }}>문자</span>
        </button>
        <button style={actionButtonStyle} onClick={() => window.open(`mailto:${contact.email}`)}>
            <Mail size={24} color="var(--primary-color)" />
            <span style={{ fontSize: '12px' }}>이메일</span>
        </button>
      </div>

      {/* 명함 이미지 표시 섹션 */}
      {(contact.cardFront || contact.cardBack) && (
        <div style={{ padding: '0 16px 24px' }}>
           <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>명함 이미지</h3>
           <div style={imagesContainerStyle}>
             {contact.cardFront && (
               <div style={imageWrapperStyle}>
                 <img 
                   src={contact.cardFront} 
                   alt="명함 앞면" 
                   style={{ width: '100%', display: 'block' }} 

                 />
               </div>
             )}
             {contact.cardBack && (
               <div style={imageWrapperStyle}>
                 <img 
                   src={contact.cardBack} 
                   alt="명함 뒷면" 
                   style={{ width: '100%', display: 'block' }} 

                 />
               </div>
             )}
           </div>
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
         <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>메모</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                {contact.memo || '메모가 없습니다.'}
            </p>
         </div>
      </div>

      <div style={{ marginTop: '24px', padding: '0 16px', display: 'flex', gap: '12px' }}>
        <button 
            onClick={() => navigate(`/contacts/edit/${id}`)}
            style={{ 
                flex: 1, 
                padding: '16px', 
                borderRadius: '12px', 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            <Edit size={18} /> 수정
        </button>
        <button 
            onClick={handleDelete}
            style={{ 
                flex: 1, 
                padding: '16px', 
                borderRadius: '12px', 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                border: 'none', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            <Trash2 size={18} /> 삭제
        </button>
      </div>
    </div>
  );
};

export default ContactDetail;
