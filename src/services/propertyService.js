import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const PROPERTIES_COLLECTION = 'properties';

// Crear nueva propiedad (ACTUALIZADO para soportar imagen 360° interna)
export const createProperty = async (propertyData, images = [], image360File = null) => {
  try {
    // 1. Generar un ID nuevo para el documento ANTES de guardarlo
    const newDocRef = doc(collection(db, PROPERTIES_COLLECTION));
    const newPropertyId = newDocRef.id;

    // 2. Subir imágenes 2D a Storage usando el nuevo ID
    const imageUrls = await uploadPropertyImages(images, newPropertyId);
    
    // 3. Subir imagen 360° interna si el usuario la proporcionó
    let image360Url = null;
    if (image360File) {
      const storageRef360 = ref(storage, `properties/${newPropertyId}/interior_360_${image360File.name}`);
      const snapshot360 = await uploadBytes(storageRef360, image360File);
      image360Url = await getDownloadURL(snapshot360.ref);
    }
    
    // 4. Guardar propiedad en Firestore con todos los datos
    await setDoc(newDocRef, {
      ...propertyData,
      images: imageUrls,
      image360: image360Url, // <-- NUEVO CAMPO para el recorrido interno
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    });
    
    return { id: newPropertyId, ...propertyData, images: imageUrls, image360: image360Url };
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Actualizar propiedad existente
export const updateProperty = async (propertyId, propertyData, newImages = []) => {
  try {
    let imageUrls = propertyData.images || [];
    
    // Si hay nuevas imágenes, subirlas
    if (newImages.length > 0) {
      const newImageUrls = await uploadPropertyImages(newImages, propertyId);
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    await updateDoc(doc(db, PROPERTIES_COLLECTION, propertyId), {
      ...propertyData,
      images: imageUrls,
      updatedAt: serverTimestamp()
    });
    
    return { id: propertyId, ...propertyData, images: imageUrls };
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

// Eliminar propiedad
export const deleteProperty = async (propertyId) => {
  try {
    const propertyDoc = await getDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
    if (propertyDoc.exists()) {
      const propertyData = propertyDoc.data();
      
      if (propertyData.images && propertyData.images.length > 0) {
        for (const imageUrl of propertyData.images) {
          try {
            // Extraer el path relativo de la URL para poder borrarlo correctamente
            const urlParts = imageUrl.split('/o/');
            if (urlParts.length > 1) {
              const pathWithParams = urlParts[1].split('?')[0];
              const decodedPath = decodeURIComponent(pathWithParams);
              const imageRef = ref(storage, decodedPath);
              await deleteObject(imageRef);
            }
          } catch (err) {
            console.warn('Error deleting image:', err);
          }
        }
      }
    }
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

// Obtener todas las propiedades
export const getAllProperties = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, PROPERTIES_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

// Obtener una propiedad por ID
export const getPropertyById = async (propertyId) => {
  try {
    const docSnap = await getDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

// Subir imágenes a Firebase Storage
const uploadPropertyImages = async (images, propertyId) => {
  const imageUrls = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const timestamp = Date.now();
    const fileName = `${propertyId}/${timestamp}_${i}_${image.name}`;
    const storageRef = ref(storage, `properties/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, image);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    imageUrls.push(downloadUrl);
  }
  
  return imageUrls;
};

// Cambiar estado de una propiedad
export const updatePropertyStatus = async (propertyId, status) => {
  try {
    await updateDoc(doc(db, PROPERTIES_COLLECTION, propertyId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    throw error;
  }
};