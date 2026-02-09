import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensuring persistence is local (stays even after browser close)
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // This is CRITICAL for mobile redirect
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("AuthContext: Successful redirect login", result.user.email);
          setCurrentUser(result.user);
        }
      } catch (err) {
        console.error("AuthContext: Redirect result error", err.code);
      }
    };

    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthContext: User state", user ? user.email : "Logged Out");
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile MUST use redirect for best compatibility with Google Auth
      return signInWithRedirect(auth, provider);
    } else {
      try {
        return await signInWithPopup(auth, provider);
      } catch (err) {
        if (err.code === 'auth/popup-blocked') {
          return signInWithRedirect(auth, provider);
        }
        throw err;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Let ContactsContext handle the state reset via useEffect [currentUser]
    } catch (err) {
      console.error("AuthContext: Logout failed", err);
    }
  };

  const value = { currentUser, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc'}}>
          <p style={{color: '#64748b'}}>사용자 정보를 불러오고 있습니다...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
