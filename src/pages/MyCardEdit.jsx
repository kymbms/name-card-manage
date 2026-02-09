import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import ContactForm from '../components/ContactForm';
import Header from '../components/Header';

const MyCardEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { myCard, updateMyCard, loading } = useContacts();

  // Merge myCard with any data returned from Scanner (location.state)
  const mergedData = React.useMemo(() => {
    // Default empty data if profile doesn't exist yet
    const baseData = myCard || {
      name: '',
      company: '',
      role: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      memo: '',
      tags: [],
      photo: ''
    };
    
    // Check if we returned from scanner with new data
    if (location.state) {
        return { ...baseData, ...location.state };
    }
    
    return baseData;
  }, [myCard, location.state]);

  const handleSubmit = async (updatedData) => {
    console.log("MyCardEdit: Submitting form...");
    try {
      await updateMyCard(updatedData);
      console.log("MyCardEdit: Update complete, navigating...");
      navigate('/mycard');
    } catch (err) {
      console.error("MyCardEdit: Save failed:", err);
      alert("내 명함 저장 중 오류가 발생했습니다.");
    }
  };



  if (loading) {
    return (
      <div className="page-container">
        <Header title="내 명함 수정" showProfile={false} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>
          정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <ContactForm 
      title="내 명함 수정" 
      onSubmit={handleSubmit} 
      initialData={mergedData}
    />
  );
};

export default MyCardEdit;
