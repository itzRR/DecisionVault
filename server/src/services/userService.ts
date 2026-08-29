import { getDb } from '../db/connection';

export const createOrUpdateUser = async (uid: string, email: string, displayName?: string, photoUrl?: string) => {
  const db = getDb();
  const userRef = db.collection('users').doc(uid);
  
  const doc = await userRef.get();
  
  const now = new Date().toISOString();
  
  if (doc.exists) {
    const data = doc.data()!;
    // Update basic info on login
    await userRef.update({
      email,
      display_name: displayName || data.display_name,
      photo_url: photoUrl || data.photo_url,
      updated_at: now
    });
    return { id: uid, ...data, updated_at: now };
  } else {
    const newUser = {
      email,
      display_name: displayName || null,
      photo_url: photoUrl || null,
      preferences: { theme: 'system', defaultCategory: 'Career' },
      created_at: now,
      updated_at: now
    };
    await userRef.set(newUser);
    return { id: uid, ...newUser };
  }
};

export const getUser = async (uid: string) => {
  const db = getDb();
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const updatePreferences = async (uid: string, preferences: any) => {
  const db = getDb();
  const userRef = db.collection('users').doc(uid);
  
  await userRef.update({
    preferences,
    updated_at: new Date().toISOString()
  });
  
  const updatedDoc = await userRef.get();
  return { id: uid, ...updatedDoc.data() };
};

export const deleteUser = async (uid: string) => {
  const db = getDb();
  
  const batch = db.batch();
  
  // Delete all decisions for this user
  const decisionsSnapshot = await db.collection('decisions').where('user_id', '==', uid).get();
  decisionsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Delete user profile
  batch.delete(db.collection('users').doc(uid));
  
  await batch.commit();
  return true;
};
