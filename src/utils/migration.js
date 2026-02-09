import { db } from '../firebase';
import { doc, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import { storage } from './storage';

export const migrateLocalDataToFirestore = async (userId, isManual = false) => {
  if (!userId) {
    console.error("Migration: No userId provided");
    return;
  }

  try {
    console.log("Migration: Starting for UID", userId);
    
    // 1. Migrate My Card
    const myCardRef = doc(db, 'users', userId, 'profile', 'myCard');
    const myCardSnap = await getDoc(myCardRef);
    const localMyCard = storage.getMyCard();

    if (!myCardSnap.exists() && localMyCard) {
      console.log("Migration: Local MyCard found, uploading...");
      await setDoc(myCardRef, localMyCard);
    }

    // 2. Migrate Contacts (Skip dummy data by passing false)
    const localContacts = storage.getContacts(false);

    
    if (localContacts && localContacts.length > 0) {
      const migrationFlag = localStorage.getItem(`migrated_contacts_${userId}`);
      
      // If manually triggered OR flag not set
      if (!migrationFlag || isManual) {
        if (isManual) {
          alert(`[진단] ${localContacts.length}개의 데이터를 서버로 전송 시도합니다.\n사용자 ID: ${userId}`);
        }
      } else {
        console.log("Migration: Already migrated, skipping automatic run.");
        return;
      }
      
      const batch = writeBatch(db);
      localContacts.forEach(contact => {
        const cid = contact.id || Date.now();
        const contactRef = doc(db, 'users', userId, 'contacts', String(cid));
        batch.set(contactRef, contact);
      });
      
      await batch.commit();
      
      localStorage.setItem(`migrated_contacts_${userId}`, 'true');
      if (isManual) {
        alert("✅ 복구 완료! 이제 명함들이 목록에 나타나야 합니다.");
      }
      console.log("Migration: Success");
    }
  } catch (err) {
    console.error("Migration: Error", err);
    if (isManual) {
      if (err.code === 'unavailable') {
        alert(`❌ 네트워크 상의 이유로 서버에 연결할 수 없습니다.\n\n나중에 인터넷 환경이 더 좋은 곳에서 다시 시도해 주세요.`);
      } else {
        alert(`❌ 동기화 실패\n오류 내용: ${err.message}`);
      }
    }
  }
};

