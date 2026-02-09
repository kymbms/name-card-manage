import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Login = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error("Login: handleLogin exception", error);
      setIsLoggingIn(false);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)' }}>
          환영합니다 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>명함을 스마트하게 관리하세요</p>
      </div>

      <button 
        onClick={handleLogin}
        disabled={isLoggingIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          backgroundColor: isLoggingIn ? '#f5f5f5' : '#ffffff',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: isLoggingIn ? 'default' : 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '300px',
          opacity: isLoggingIn ? 0.8 : 1
        }}
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
        {isLoggingIn ? '로그인 정보 확인 중...' : 'Google 계정으로 계속하기'}
      </button>

      {isLoggingIn && (
        <p style={{ marginTop: '15px', color: 'var(--primary-color)', fontSize: '14px', fontWeight: '500' }}>
            계정 선택 후 잠시만 기다려 주세요...
        </p>
      )}

      <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        로그인하면 모든 기기에서 명함을 동기화할 수 있습니다.<br/>
        (스마트폰에서 로그인이 반복되면 '개인정보 보호' 설정을 확인해주세요)
      </p>
    </div>
  );
};

export default Login;
