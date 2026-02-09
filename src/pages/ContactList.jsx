import React, { useState, useMemo } from 'react';
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ContactItem from '../components/ContactItem';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';

const ContactList = () => {
  const navigate = useNavigate();
  const { contacts, loading } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const filters = [
    { id: 'all', label: '전체' },
    { id: 'favorites', label: '즐겨찾기' },
    { id: 'recent', label: '최근 추가' },
    { id: 'marketing', label: '마케팅' },
    { id: 'dev', label: '개발' },
  ];

  const filteredContacts = useMemo(() => {
    // We remove the loading check to allow "Local-First" visibility.
    // The data will be updated silently when Firestore arrives.
    let result = contacts;

    // Filter by Category/Tag
    if (currentFilter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    } else if (currentFilter === 'recent') {
      // Assuming higher ID is more recent
      result = [...result].sort((a, b) => b.id - a.id).slice(0, 20);
    } else if (currentFilter !== 'all') {
      // Filter by tag if it matches one of the known tags
      // Or we can add logic to map filter IDs to tags
      if (['marketing', 'dev'].includes(currentFilter)) {
         const tagMap = { 'marketing': '마케팅', 'dev': '개발' };
         result = result.filter(c => c.tags.includes(tagMap[currentFilter]));
      }
    }

    // Filter by Search Term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(c => 
        (c.name || '').toLowerCase().includes(lowerTerm) ||
        (c.company || '').toLowerCase().includes(lowerTerm) ||
        (c.title || '').toLowerCase().includes(lowerTerm) ||
        (Array.isArray(c.tags) && c.tags.some(tag => (tag || '').toLowerCase().includes(lowerTerm)))
      );
    }

    return result;
  }, [searchTerm, currentFilter, contacts, loading]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>명함첩</h2>
        <button 
          className="btn-interactive"
          onClick={() => navigate('/contacts/add')}
          style={{
          backgroundColor: 'var(--primary-color)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Plus size={20} />
        </button>
      </div>

      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
        <FilterBar 
          filters={filters} 
          currentFilter={currentFilter} 
          onFilterChange={setCurrentFilter} 
        />
        
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? '#fff' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
              display: 'flex'
            }}
          >
            <ListIcon size={18} color={viewMode === 'list' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            style={{
              background: viewMode === 'grid' ? '#fff' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              display: 'flex'
            }}
          >
            <LayoutGrid size={18} color={viewMode === 'grid' ? 'var(--primary-color)' : 'var(--text-secondary)'} />
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(150px, 1fr))' : '1fr', 
        gap: 'var(--spacing-md)' 
      }}>
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactItem key={contact.id} contact={contact} viewMode={viewMode} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
