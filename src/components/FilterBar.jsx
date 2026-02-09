import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange, filters }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginBottom: 'var(--spacing-md)',
      overflowX: 'auto',
      paddingBottom: '4px',
      '--scrollbar-color': 'var(--border-color)', // For custom scrollbar if needed
    }} className="no-scrollbar">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: currentFilter === filter.id 
              ? 'var(--primary-color)' 
              : 'var(--bg-secondary)',
            color: currentFilter === filter.id 
              ? '#fff' 
              : 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
            boxShadow: currentFilter === filter.id 
              ? 'var(--shadow-sm)' 
              : 'none'
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
