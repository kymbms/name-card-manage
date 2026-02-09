import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div style={{ 
      position: 'relative', 
      marginBottom: 'var(--spacing-md)' 
    }}>
      <Search 
        size={20} 
        style={{ 
          position: 'absolute', 
          left: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }} 
      />
      <input
        type="text"
        placeholder="이름, 회사, 태그로 검색..."
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 12px 12px 40px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-md)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary-color)';
          e.target.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default SearchBar;
