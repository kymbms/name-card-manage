import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import './BusinessCard.css';

const BusinessCard = ({ data, isEditable = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`card-container ${isFlipped ? 'card-flipped' : ''}`} onClick={handleFlip}>
      <div className="card-inner">
        {/* Front of Card */}
        <div className="card-front">
          <div className="card-content">
            <div className="card-header">
              <div className="logo-box">
                <img 
                  src={data.photo || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`} 
                  alt="Profile" 
                  className="company-logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                />
              </div>
              <div className="personal-id">
                <span>PERSONAL ID</span>
                <strong>#{data.id || '882-004'}</strong>
              </div>
            </div>
            
            <div className="card-body">
              <h2 className="name">{data.name || '이름 없음'}</h2>
              <p className="title">{data.role || data.title || ''} {data.company && `• ${data.company}`}</p>
            </div>


            <div className="card-footer">
              <div className="card-circles">
                <span className="circle"></span>
                <span className="circle"></span>
              </div>
              <button className="flip-btn" onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                <RefreshCw size={16} /> TAP TO FLIP
              </button>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="card-back">
          <div className="card-content back-content">
            <div className="qr-frame">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.email || 'contact')}`} alt="QR Code" className="qr-code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
