import React from 'react';
import { Phone, Mail, MapPin, Star, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';

const ContactItem = ({ contact, viewMode }) => {
  const navigate = useNavigate();
  const { toggleFavorite } = useContacts();

  const handleCardClick = () => {
    navigate(`/contacts/${contact.id}`);
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--spacing-md)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: viewMode === 'grid' ? 'column' : 'row',
    alignItems: viewMode === 'grid' ? 'stretch' : 'center',
    gap: viewMode === 'grid' ? 'var(--spacing-md)' : 'var(--spacing-md)',
  };

  const avatarStyle = {
    width: viewMode === 'grid' ? '60px' : '50px',
    height: viewMode === 'grid' ? '60px' : '50px',
    borderRadius: '50%',
    backgroundColor: contact.color || 'var(--primary-color)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: viewMode === 'grid' ? '24px' : '20px',
    fontWeight: 'bold',
    flexShrink: 0,
    margin: viewMode === 'grid' ? '0 auto' : '0', // Center avatar in grid view
  };

  const renderInfoItem = (Icon, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '100%' }}>
      <Icon size={14} style={{ flexShrink: 0 }} />
      <span style={{ 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        flex: 1,
        minWidth: 0
      }}>
        {text}
      </span>
    </div>
  );

  return (
    <div 
      style={cardStyle} 
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ 
        ...avatarStyle, 
        overflow: 'hidden',
        backgroundColor: contact.color || 'var(--bg-secondary)',
        color: contact.photo ? 'var(--text-primary)' : '#fff'
      }}>
        {contact.photo ? (
          <img 
            src={contact.photo} 
            alt={contact.name || 'Contact'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          (contact.name || '?')[0]
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: '4px' }}>
            <h3 style={{ 
              fontSize: 'var(--font-size-md)', 
              fontWeight: 'bold', 
              margin: 0, 
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}>
              {contact.name || '이름 없음'}
            </h3>
            <p style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--primary-color)', 
              margin: '2px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}>
              {contact.title || contact.role || ''} {contact.company && `@ ${contact.company}`}
            </p>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(contact.id);
            }}
            style={{ 
              cursor: 'pointer', 
              padding: '4px',
              margin: '-4px -4px 0 0' // Increase hit area
            }}
          >
            <Star 
              size={18} 
              fill={contact.isFavorite ? "var(--warning-color)" : "transparent"} 
              color={contact.isFavorite ? "var(--warning-color)" : "var(--text-secondary)"} 
              style={{ flexShrink: 0 }} 
            />
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          {renderInfoItem(Phone, contact.phone || '')}
          {renderInfoItem(Mail, contact.email || '')}
          {viewMode === 'grid' && renderInfoItem(MapPin, contact.address || '')}
        </div>

        {viewMode === 'grid' && Array.isArray(contact.tags) && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '12px', flexWrap: 'wrap' }}>
            {contact.tags.map((tag, index) => (
              <span key={index} style={{
                fontSize: '11px',
                padding: '2px 8px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                borderRadius: '10px',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ContactItem;
