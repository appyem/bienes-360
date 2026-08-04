import { 
  collection, 
  addDoc, 
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ==========================================
// 1. CREAR (Tu función original, intacta)
// ==========================================
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

    const storagePath = `panoramas/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const panoramaDoc = {
      title,
      city,
      neighborhood,
      sector,
      description,
      keywords: keywords.split(',').map(k => k.trim().toLowerCase()),
      imageUrl,
      storagePath,
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

// ==========================================
// 2. LEER (Obtener todas las panorámicas)
// ==========================================
export const getAllPanoramas = async () => {
  try {
    const q = query(collection(db, 'panoramas'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error al obtener las panorámicas:', error);
    throw error;
  }
};

// ==========================================
// 3. ACTUALIZAR (Editar panorámica existente)
// ==========================================
export const updatePanorama = async (id, panoramaData, newImageFile = null) => {
  try {
    const docRef = doc(db, 'panoramas', id);
    const docSnap = await getDoc(docRef);
    
    let updateData = { 
      ...panoramaData, 
      updatedAt: serverTimestamp() 
    };

    // Si se proporciona una nueva imagen, la subimos y borramos la anterior
    if (newImageFile) {
      const oldData = docSnap.data();
      
      // 1. Intentar borrar la imagen anterior del Storage
      if (oldData?.storagePath) {
        try {
          await deleteObject(ref(storage, oldData.storagePath));
        } catch (err) {
          console.warn('⚠️ No se pudo eliminar la imagen anterior del Storage:', err);
        }
      }

      // 2. Subir la nueva imagen
      const newStoragePath = `panoramas/${Date.now()}_${newImageFile.name}`;
      const storageRef = ref(storage, newStoragePath);
      const snapshot = await uploadBytes(storageRef, newImageFile);
      
      updateData.imageUrl = await getDownloadURL(snapshot.ref);
      updateData.storagePath = newStoragePath;
    }

    await updateDoc(docRef, updateData);
    console.log('✅ Panorámica actualizada con ID:', id);
    return { success: true };

  } catch (error) {
    console.error('❌ Error al actualizar la panorámica:', error);
    return { success: false, error: error.message };
  }
};

// ==========================================
// 4. ELIMINAR (Borrar panorámica y su imagen)
// ==========================================
export const deletePanorama = async (id) => {
  try {
    const docRef = doc(db, 'panoramas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // 1. Borrar la imagen del Storage
      if (data?.storagePath) {
        try {
          await deleteObject(ref(storage, data.storagePath));
        } catch (err) {
          console.warn('⚠️ No se pudo eliminar la imagen del Storage:', err);
        }
      }
    }

    // 2. Borrar el documento de Firestore
    await deleteDoc(docRef);
    console.log('✅ Panorámica eliminada con ID:', id);
    return { success: true };

  } catch (error) {
    console.error('❌ Error al eliminar la panorámica:', error);
    return { success: false, error: error.message };
  }
};