import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Share2, Star, Edit } from 'lucide-react';
import BusinessCard3D from '../components/BusinessCard3D';
import { useContacts } from '../hooks/useContacts';

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, loading, toggleFavorite } = useContacts();
  
  const contact = contacts.find(c => String(c.id) === String(id));

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>;
  }

  if (!contact) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>명함을 찾을 수 없습니다.</div>;
  }

  const actionButtonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontSize: '12px'
  };

  const circleStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <ArrowLeft size={24} color="var(--text-primary)" />
        </button>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => toggleFavorite(contact.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Star size={24} fill={contact.isFavorite ? "var(--warning-color)" : "none"} color={contact.isFavorite ? "var(--warning-color)" : "var(--text-secondary)"} />
          </button>
          <button 
            onClick={() => navigate(`/contacts/edit/${contact.id}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Edit size={24} color="var(--text-primary)" />
          </button>
        </div>
      </div>

      {/* 3D Card */}
      <div style={{ margin: '20px 0 40px 0' }}>
        <BusinessCard3D contact={contact} />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '32px', padding: '0 16px' }}>
        <button 
          className="btn-interactive" 
          style={actionButtonStyle}
          onClick={() => window.location.href = `tel:${contact.phone}`}
        >
          <div style={circleStyle}>
            <Phone size={24} color="var(--primary-color)" />
          </div>
          <span>전화</span>
        </button>
        <button 
          className="btn-interactive" 
          style={actionButtonStyle}
          onClick={() => window.location.href = `sms:${contact.phone}`}
        >
          <div style={circleStyle}>
            <MessageCircle size={24} color="var(--success-color)" />
          </div>
          <span>메시지</span>
        </button>
        <button 
          className="btn-interactive" 
          style={actionButtonStyle}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${contact.name}님의 명함`,
                text: `${contact.name} (${contact.company}) - ${contact.phone}`,
                url: window.location.href
              }).catch(console.error);
            } else {
              // Fallback to clipboard copy
              navigator.clipboard.writeText(`${contact.name} ${contact.phone} ${window.location.href}`)
                .then(() => alert('명함 정보가 클립보드에 복사되었습니다.'));
            }
          }}
        >
          <div style={circleStyle}>
            <Share2 size={24} color="var(--text-secondary)" />
          </div>
          <span>공유</span>
        </button>
      </div>

      {/* Info Table */}
      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: 'var(--border-radius-lg)', 
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>상세 정보</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)', width: '80px' }}>휴대전화</td>
              <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>{contact.phone}</td>
            </tr>
            {contact.fax && (
              <tr>
                <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>팩스</td>
                <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>{contact.fax}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>이메일</td>
              <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>{contact.email}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>주소</td>
              <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>{contact.address}</td>
            </tr>
            {contact.website && (
              <tr>
                <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>웹사이트</td>
                <td style={{ padding: '8px 0', color: 'var(--text-primary)' }}>
                  <a href={contact.website.startsWith('http') ? contact.website : `http://${contact.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {contact.website}
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Images */}
      {(contact.cardFront || contact.cardBack) && (
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: 'var(--border-radius-lg)', 
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>명함 이미지</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: contact.orientation === 'portrait' ? 'row' : 'column', 
            gap: '16px',
            overflowX: contact.orientation === 'portrait' ? 'auto' : 'visible'
          }}>
            {contact.cardFront && (
              <div style={{ flex: contact.orientation === 'portrait' ? '0 0 48%' : '1' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>앞면</span>
                <img src={contact.cardFront} alt="명함 앞면" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
            )}
            {contact.cardBack && (
              <div style={{ flex: contact.orientation === 'portrait' ? '0 0 48%' : '1' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>뒷면</span>
                <img src={contact.cardBack} alt="명함 뒷면" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Memo Section */}
      <div style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: 'var(--border-radius-lg)', 
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>메모</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
          {contact.memo || "저장된 메모가 없습니다."}
        </p>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {contact.tags.map((tag, index) => (
            <span key={index} style={{
              fontSize: '12px',
              padding: '4px 10px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              borderRadius: '12px',
            }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CardDetail;
