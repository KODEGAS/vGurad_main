// src/firebase-admin.ts
import * as admin from 'firebase-admin';

// Replace this with your actual service account credentials.
// The easiest way is to set a GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your JSON key file.
// For testing, you can directly initialize like this:
const serviceAccount = require('../config/serviceAccountKey.json');

// NOTE: You must replace the path above with the correct path to your Firebase service account key.
// It's a file you download from the Firebase console.

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const firestore = admin.firestore();

export { admin, auth, firestore };
