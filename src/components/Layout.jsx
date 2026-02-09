import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Users, Scan, CreditCard } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/contacts', icon: Users, label: '명함첩' },
    { path: '/scanner', icon: Scan, label: '스캔' },
    { path: '/my-card', icon: CreditCard, label: '내 명함' },
  ];

  return (
    <div style={{ paddingBottom: '70px', minHeight: '100vh', position: 'relative' }}>
      <header style={{ 
        padding: 'var(--spacing-md)', 
        backgroundColor: 'var(--card-bg)', 
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-color)' }}>
          BizCard
        </h1>
      </header>

      <main style={{ padding: 'var(--spacing-md)', maxWidth: '600px', margin: '0 auto' }}>
        <Outlet />
      </main>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--card-bg)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 'var(--spacing-sm) 0',
        zIndex: 20
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontSize: 'var(--font-size-sm)',
                gap: '4px'
              })}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
