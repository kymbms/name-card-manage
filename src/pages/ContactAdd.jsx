import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import ContactForm from '../components/ContactForm';

const ContactAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addContact } = useContacts();

  // Retrieve data passed from Scanner
  const initialData = location.state || {};

  const AVATAR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', 
    '#1ABC9C', '#F1C40F', '#E74C3C', '#8E44AD'
  ];

  const handleSubmit = async (data) => {
    // Add random color
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    
    const newContact = { 
      ...data, 
      color: randomColor, 
      isFavorite: false 
    };
    
    try {
      await addContact(newContact);
      navigate('/contacts');
    } catch (err) {
      console.error("Add failed:", err);
      alert("명함 추가 중 오류가 발생했습니다.");
    }
  };


  return <ContactForm 
    title="명함 추가" 
    onSubmit={handleSubmit} 
    initialData={initialData}
  />;
};

export default ContactAdd;
