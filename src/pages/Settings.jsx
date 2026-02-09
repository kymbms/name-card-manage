import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Database, RefreshCcw } from 'lucide-react';
import { migrateLocalDataToFirestore } from '../utils/migration';
import { storage } from '../utils/storage';
import packageJson from '../../package.json';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃 되었습니다.");
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="page-container">
      <Header title="설정" showProfile={false} />
      <div className="content-scroll" style={{ padding: '20px' }}>
        
        {/* Account Section */}
        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>계정</h3>
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '500', margin: 0 }}>
                  {currentUser.displayName || '사용자'}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0 0' }}>
                  {currentUser.email}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--error-color)', // Red for logout
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                로그인하여 데이터를 동기화하세요.
              </p>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  background: 'var(--primary-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Google 계정으로 로그인
              </button>
            </div>
          )}
        </div>

        {/* Data Recovery Section */}
        {currentUser && (
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '16px', 
            borderRadius: '12px',
            marginBottom: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>데이터 관리</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
              새로 등록한 명함이 다른 기기에서 보이지 않거나 목록이 비어있다면, 현재 기기의 데이터를 서버로 다시 보낼 수 있습니다. (중복 걱정은 하지 마세요!)
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px' }}>폰에 있는 명함:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{storage.getContacts(currentUser?.uid).length}개</span>
            </div>
            <button 
              onClick={async () => {
                if (window.confirm('휴대폰의 데이터를 서버로 다시 보낼까요? (이미 있는 데이터는 유지됩니다)')) {
                  localStorage.removeItem(`migrated_contacts_${currentUser.uid}`);
                  await migrateLocalDataToFirestore(currentUser.uid, true);
                  window.location.reload();
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: 'var(--primary-color)',
                border: '1px solid var(--primary-color)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              데이터 강제 동기화 (복구)
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => storage.exportData()}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                📥 데이터 백업 (저장)
              </button>
              <button 
                onClick={() => document.getElementById('restore-input').click()}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                📤 데이터 복원 (열기)
              </button>
              <input 
                id="restore-input"
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (storage.importData(event.target.result)) {
                        alert("데이터가 성공적으로 복원되었습니다!");
                        window.location.reload();
                      } else {
                        alert("복원에 실패했습니다. 올바른 백업 파일인지 확인해 주세요.");
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Preferences Section */}
        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>앱 설정</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>다크 모드</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                    onClick={() => setThemeMode('light')} 
                    style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        background: theme === 'light' ? 'var(--primary-color)' : 'var(--bg-secondary)',
                        color: theme === 'light' ? '#fff' : 'var(--text-primary)',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    라이트
                </button>
                <button 
                    onClick={() => setThemeMode('dark')} 
                    style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        background: theme === 'dark' ? 'var(--primary-color)' : 'var(--bg-secondary)',
                        color: theme === 'dark' ? '#fff' : 'var(--text-primary)',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    다크
                </button>
                <button 
                    onClick={() => setThemeMode('system')} 
                    style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border-color)',
                        background: theme === 'system' ? 'var(--primary-color)' : 'var(--bg-secondary)',
                        color: theme === 'system' ? '#fff' : 'var(--text-primary)',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}
                >
                    시스템
                </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>앱 버전</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{packageJson.version}</span>
          </div>
        </div>
        
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default Settings;
