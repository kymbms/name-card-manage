import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { storage } from '../utils/storage';
import { db } from '../firebase';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, setDoc, query } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { migrateLocalDataToFirestore } from '../utils/migration';

const ContactsContext = createContext();

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) throw new Error('useContacts must be used within a ContactsProvider');
  return context;
};

export const ContactsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [myCard, setMyCard] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Strict Switch Effect
  useEffect(() => {
    const uid = currentUser?.uid || null;
    
    // reset current data immediately when user changes to prevent visible leak
    if (!uid) {
        setContacts([]);
        setMyCard(null);
    }

    const localC = storage.getContacts(uid);
    const localM = storage.getMyCard(uid);
    
    setContacts(localC);
    setMyCard(localM);
    
    setLoading(true); // Always check cloud when user changes
  }, [currentUser?.uid]);

  // 2. Focused Cloud Sync
  useEffect(() => {
    if (!currentUser) {
        setLoading(false);
        return;
    }

    const uid = currentUser.uid;
    console.log(`Syncing exclusively for: ${currentUser.email}`);
    
    migrateLocalDataToFirestore(uid);

    const unsubC = onSnapshot(collection(db, 'users', uid, 'contacts'), (snapshot) => {
      const cloudData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const local = storage.getContacts(uid, false);
      const merged = [...cloudData];
      
      local.forEach(l => {
        if (l?.id && !merged.find(m => String(m.id) === String(l.id))) merged.push(l);
      });
      
      merged.sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0));
      const final = merged.filter(Boolean);
      
      setContacts(final);
      storage.saveContacts(final, uid);
      setLoading(false);
    });

    const unsubM = onSnapshot(doc(db, 'users', uid, 'profile', 'myCard'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMyCard(data);
        storage.saveMyCard(data, uid);
      }
      setLoading(false);
    });

    return () => {
      unsubC();
      unsubM();
    };
  }, [currentUser]);

  // Safety global timeout
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const addContact = useCallback(async (newContact) => {
    const id = Date.now();
    const data = { ...newContact, id }; 
    const uid = currentUser?.uid;
    setContacts(prev => [data, ...prev]);
    storage.saveContacts([data, ...storage.getContacts(uid, false)], uid);
    if (uid) setDoc(doc(db, 'users', uid, 'contacts', String(id)), data);
    return data;
  }, [currentUser]);

  const updateContact = useCallback(async (id, info) => {
    const uid = currentUser?.uid;
    setContacts(prev => prev.map(c => String(c.id) === String(id) ? { ...c, ...info } : c));
    const all = storage.getContacts(uid, false).map(c => String(c.id) === String(id) ? { ...c, ...info } : c);
    storage.saveContacts(all, uid);
    if (uid) updateDoc(doc(db, 'users', uid, 'contacts', String(id)), info);
  }, [currentUser]);

  const deleteContact = useCallback(async (id) => {
    const uid = currentUser?.uid;
    setContacts(prev => prev.filter(c => String(c.id) !== String(id)));
    storage.saveContacts(storage.getContacts(uid, false).filter(c => String(c.id) !== String(id)), uid);
    if (uid) deleteDoc(doc(db, 'users', uid, 'contacts', String(id)));
  }, [currentUser]);

  const updateMyCard = useCallback(async (card) => {
    const uid = currentUser?.uid;
    const data = { ...card, id: 0 };
    setMyCard(data);
    storage.saveMyCard(data, uid);
    if (uid) setDoc(doc(db, 'users', uid, 'profile', 'myCard'), data);
    return data;
  }, [currentUser]);

  const toggleFavorite = useCallback(async (id) => {
    // We need to find the contact to know current state.
    // Since contacts state might be stale in closure if not careful, but we have contacts in dependency? 
    // Actually updateContact handles the update, but we need the current value.
    // It is better to rely on the functional update or just find it from current state.
    // However, contacts dependency might cause frequent recreation of this function.
    // Let's just find it in the current contacts list.
    const contact = contacts.find(c => String(c.id) === String(id));
    if (contact) {
        await updateContact(id, { isFavorite: !contact.isFavorite });
    }
  }, [contacts, updateContact]);

  return (
    <ContactsContext.Provider value={{ contacts, myCard, loading, addContact, updateContact, deleteContact, updateMyCard, toggleFavorite }}>
      {children}
    </ContactsContext.Provider>
  );
};
