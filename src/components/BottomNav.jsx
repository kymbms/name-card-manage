import React from 'react';
import { Home, Users, ScanLine, CreditCard } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => onTabChange('home')}
        >
          <Home size={24} />
          <span>홈</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`} 
          onClick={() => onTabChange('contacts')}
        >
          <Users size={24} />
          <span>명함첩</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'scan' ? 'active' : ''}`} 
          onClick={() => onTabChange('scan')}
        >
          <ScanLine size={24} />
          <span>스캔</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'mycard' ? 'active' : ''}`} 
          onClick={() => onTabChange('mycard')} 
        >
          <CreditCard size={24} />
          <span>내 명함</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
