import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAFboUS2nvfxrmLIKpseYt2SAtgWpZd-zo",
  authDomain: "bienes-360.firebaseapp.com",
  projectId: "bienes-360",
  storageBucket: "bienes-360.firebasestorage.app",
  messagingSenderId: "452905083997",
  appId: "1:452905083997:web:11323c04ca9569f970d9b4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;