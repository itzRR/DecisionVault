import * as admin from 'firebase-admin';

// The admin app is initialized in middleware/auth.ts
// We just export a helper to get the Firestore instance
export const getDb = () => {
  return admin.firestore();
};
