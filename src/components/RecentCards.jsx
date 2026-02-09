import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';

const RecentCards = () => {
  const navigate = useNavigate();
  const { contacts } = useContacts();
  
  // Get last 5 contacts, assuming higher ID is newer
  const recentContacts = [...contacts].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)' }}>최근 추가된 명함</h3>
        <button 
          onClick={() => navigate('/contacts')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', fontSize: 'var(--font-size-sm)' }}
        >
          더보기
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-md)', 
        overflowX: 'auto', 
        paddingBottom: 'var(--spacing-sm)',
        scrollSnapType: 'x mandatory'
      }}>
        {recentContacts.map((card) => (
          <div key={card.id} style={{
            minWidth: '200px',
            backgroundColor: 'var(--card-bg)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-full)', 
              // backgroundColor: 'var(--bg-color)', removed to avoid duplicate key
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 'var(--spacing-sm)',
              overflow: 'hidden',
              fontSize: '22px', // Increased size for better visibility
              fontWeight: 700,
              color: '#fff', // Ensure text is always white
              backgroundColor: card.color || 'var(--bg-secondary)', // Revert to secondary bg if requested
              lineHeight: 1, // Ensure vertical centering
              textAlign: 'center', // Ensure horizontal centering
              margin: '0 auto',
              flexShrink: 0
            }}>
              {card.photo ? (
                <img 
                  src={card.photo} 
                  alt={card.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                card.name[0]
              )}
            </div>
            <h4 style={{ 
              fontSize: 'var(--font-size-md)', 
              fontWeight: 'bold', 
              textAlign: 'center',
              margin: '0 0 4px 0',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {card.name}
            </h4>
            <p style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--primary-color)', 
              textAlign: 'center',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {card.role} {card.company && `@ ${card.company}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCards;
