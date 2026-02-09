import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const BusinessCard3D = ({ contact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container" style={{ width: '100%', aspectRatio: '1.58/1', cursor: 'pointer' }} onClick={handleFlip}>
      <div className={`card-inner ${isFlipped ? 'card-flipped' : ''}`} style={{ transition: 'transform 0.6s', transformStyle: 'preserve-3d' }}>
        
        {/* Front Side */}
        <div className="card-front" style={{ 
          backgroundColor: '#fff', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '8px',
            backgroundColor: contact.color
          }} />
          
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: contact.color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden', // Ensure image stays within circle
            backgroundColor: contact.color || 'var(--bg-secondary)',
            color: contact.photo ? 'inherit' : '#fff'
          }}>
            {contact.photo ? (
              <img 
                src={contact.photo} 
                alt={contact.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              contact.name[0]
            )}
          </div>
          
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold' }}>{contact.name}</h2>
          <p style={{ margin: '0 0 8px 0', color: 'var(--primary-color)', fontWeight: '500' }}>{contact.title}</p>
          <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '14px' }}>{contact.company}</p>

          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            fontSize: '12px', 
            color: 'var(--text-tertiary)' 
          }}>
            클릭하여 뒷면 보기
          </div>
        </div>

        {/* Back Side */}
        <div className="card-back" style={{ 
          backgroundColor: '#222', // Darker background for back
          color: '#fff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          border: '1px solid #333'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Phone size={16} color={contact.color} />
              <span style={{ fontSize: '14px' }}>{contact.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Mail size={16} color={contact.color} />
              <span style={{ fontSize: '14px' }}>{contact.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Globe size={16} color={contact.color} />
              <span style={{ fontSize: '14px' }}>{contact.website}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} color={contact.color} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', lineHeight: '1.4' }}>{contact.address}</span>
            </div>
          </div>

          <div style={{ 
            marginLeft: '16px', 
            padding: '8px', 
            backgroundColor: '#fff', 
            borderRadius: '8px' 
          }}>
            <img 
              id="qr-code-img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vcard:${contact.name}%0ATEL:${contact.phone}%0AEMAIL:${contact.email}`}
              alt="QR Code"
              style={{ width: '64px', height: '64px', display: 'block' }}
              crossOrigin="anonymous"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessCard3D;
