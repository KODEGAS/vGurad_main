import * as admin from 'firebase-admin';

const serviceAccount = require('../config/serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const firestore = admin.firestore();

export { admin, auth, firestore };
