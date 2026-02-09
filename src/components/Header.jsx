import { Bell, Cloud, CloudOff } from 'lucide-react';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, subtitle, showProfile = true, profileImage }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="app-header">
      <div className="header-left">
        {showProfile && (
          <div className="profile-image">
            <img src={profileImage || "https://via.placeholder.com/40"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div className="header-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {subtitle && <span className="subtitle">{subtitle}</span>}
            {currentUser ? (
              <Cloud size={14} color="var(--primary-color)" title="클라우드 동기화 중" />
            ) : (
              <CloudOff size={14} color="var(--text-secondary)" title="로컬 모드 (로그인 필요)" />
            )}
          </div>
          <h1 className="title">{title}</h1>
        </div>
      </div>
      <button className="notification-btn">
        <Bell size={24} />
      </button>
    </div>
  );
};


export default Header;
