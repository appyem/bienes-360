import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const uploadPanorama = async (panoramaData) => {
  try {
    const { 
      imageFile, 
      title, 
      city, 
      neighborhood, 
      sector, 
      description, 
      keywords 
    } = panoramaData;

    if (!imageFile) throw new Error('Debes seleccionar una imagen 360°');

    // 1. Subir imagen a Firebase Storage
    const storagePath = `panoramas/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // 2. Guardar metadatos en Firestore (incluyendo el storagePath)
    const panoramaDoc = {
      title,
      city,
      neighborhood,
      sector,
      description,
      keywords: keywords.split(',').map(k => k.trim().toLowerCase()),
      imageUrl,
      storagePath, // <-- NUEVO: Guardamos la ruta para usar el SDK después
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'panoramas'), panoramaDoc);
    
    console.log('✅ Panorámica subida con ID:', docRef.id);
    return { success: true, id: docRef.id, imageUrl };

  } catch (error) {
    console.error('❌ Error al subir la panorámica:', error);
    return { success: false, error: error.message };
  }
};