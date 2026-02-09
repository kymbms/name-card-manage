import React from 'react';
import { Scan, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: '명함 스캔', icon: Scan, path: '/scanner', color: 'var(--primary-color)' },
    { label: '추가', icon: Plus, path: '/contacts/add', color: 'var(--success-color)' },
    { label: '검색', icon: Search, path: '/contacts', color: 'var(--accent-color)' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: 'var(--spacing-md)', 
      marginBottom: 'var(--spacing-lg)',
      justifyContent: 'space-around'
    }}>
      {actions.map((action) => (
        <button
          key={action.label}
          className="btn-interactive"
          onClick={() => navigate(action.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--card-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            flex: 1,
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ 
            color: action.color, 
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-full)',
            backgroundColor: `color-mix(in srgb, ${action.color} 10%, transparent)`
          }}>
            <action.icon size={24} />
          </div>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
