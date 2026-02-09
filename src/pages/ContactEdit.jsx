import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import ContactForm from '../components/ContactForm';
import Header from '../components/Header';

const ContactEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { contacts, updateContact, loading } = useContacts();
  
  // Debugging logs to trace the redirection issue
  useEffect(() => {
    if (contacts.length > 0) {
      const found = contacts.find(c => String(c.id) === String(id));
      console.log(`ContactEdit [ID:${id}]: Found? ${!!found}, Total Contacts: ${contacts.length}, Loading: ${loading}`);
    }
  }, [contacts, id, loading]);

  const contact = React.useMemo(() => {
    if (!contacts || contacts.length === 0) return null;
    
    // Support both string and number IDs more explicitly
    const foundContact = contacts.find(c => String(c.id) === String(id));
    if (!foundContact) return null;

    if (location.state && location.state.cardFront !== undefined) {
        return { ...foundContact, ...location.state };
    }
    return foundContact;
  }, [contacts, id, location.state]);

  // NO aggressive redirection to /contacts
  // Removing the useEffect that calls navigate('/contacts')


  const handleSubmit = async (updatedData) => {
    try {
      await updateContact(id, updatedData);
      navigate(`/contacts/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("명함 수정 중 오류가 발생했습니다.");
    }
  };


  if (loading || (!contact && contacts.length === 0)) {
    return (
      <div className="page-container">
        <Header title="명함 수정" showProfile={false} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>
          정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (!contact && !loading && contacts.length > 0) {
    return (
      <div className="page-container">
        <Header title="명함 수정" />
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>수정할 명함 정보를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/contacts')} className="btn-interactive" style={{ 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '8px',
            border: 'none'
          }}>
            명함첩으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="page-container">
        <Header title="명함 수정" />
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          데이터를 구성 중입니다...
        </div>
      </div>
    );
  }


  return <ContactForm 
    title="명함 수정" 
    onSubmit={handleSubmit} 
    initialData={contact}
  />;
};

export default ContactEdit;
