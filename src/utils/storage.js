import { contacts as initialContacts } from '../data/contacts';

const STORAGE_KEYS = {
  CONTACTS_PRE: 'bizcard_contacts_',
  MY_CARD_PRE: 'bizcard_my_card_',
  GUEST_CONTACTS: 'bizcard_contacts_guest', // Changed from legacy to guest
  GUEST_MY_CARD: 'bizcard_my_card_guest'
};

const INITIAL_MY_CARD = {
  id: 0,
  name: "나의 명함",
  company: "회사명",
  title: "직함",
  phone: "010-0000-0000",
  email: "email@example.com",
  tags: ["나"],
  color: "#2563eb"
};

export const storage = {
  getContacts: (uid = null, includeDefault = true) => {
    // If we have a UID, we ONLY check that UID's key. NO fallback to legacy.
    const key = uid ? `${STORAGE_KEYS.CONTACTS_PRE}${uid}` : STORAGE_KEYS.GUEST_CONTACTS;
    const data = localStorage.getItem(key);

    if (!data) {
      // For guests, we can show default. For users, they start fresh if no cloud data yet.
      return (includeDefault && !uid) ? initialContacts : [];
    }
    
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return (includeDefault && !uid) ? initialContacts : [];
    }
  },

  saveContacts: (contacts, uid = null) => {
    try {
      const key = uid ? `${STORAGE_KEYS.CONTACTS_PRE}${uid}` : STORAGE_KEYS.GUEST_CONTACTS;
      localStorage.setItem(key, JSON.stringify(contacts));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Storage: saveContacts failed", e);
    }
  },

  getMyCard: (uid = null) => {
    const key = uid ? `${STORAGE_KEYS.MY_CARD_PRE}${uid}` : STORAGE_KEYS.GUEST_MY_CARD;
    const data = localStorage.getItem(key);
    
    if (!data) return uid ? null : INITIAL_MY_CARD;
    try {
      return JSON.parse(data);
    } catch {
      return uid ? null : INITIAL_MY_CARD;
    }
  },

  saveMyCard: (card, uid = null) => {
    try {
      const key = uid ? `${STORAGE_KEYS.MY_CARD_PRE}${uid}` : STORAGE_KEYS.GUEST_MY_CARD;
      localStorage.setItem(key, JSON.stringify(card));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Storage: saveMyCard failed", e);
    }
  },

  // Completely wipe any keys that could cause data leak
  clearLegacyData: () => {
    const legacyKeys = [
      'bizcard_contacts_stable',
      'bizcard_my_card_stable',
      'contacts',
      'bizcard_my_card',
      'bizcard_contacts_v3',
      'bizcard_contacts_v2',
      'bizcard_contacts_v1'
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
    console.log("Storage: Legacy data scrubbed.");
  },

  clearGuestData: () => {
    localStorage.removeItem(STORAGE_KEYS.GUEST_CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.GUEST_MY_CARD);
    console.log("Storage: Guest data cleared.");
  }
};
