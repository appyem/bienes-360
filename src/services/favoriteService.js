import { db } from '../config/firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

// Agregar a favoritos
export const addFavorite = async (userId, property) => {
  await setDoc(doc(db, 'users', userId, 'favorites', property.id), {
    propertyId: property.id,
    title: property.title,
    price: property.price,
    image: property.images?.[0] || '',
    status: property.status,
    addedAt: new Date().toISOString()
  });
};

// Eliminar de favoritos
export const removeFavorite = async (userId, propertyId) => {
  await deleteDoc(doc(db, 'users', userId, 'favorites', propertyId));
};

// Obtener lista de favoritos del usuario
export const getFavorites = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'favorites'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Verificar si una propiedad ya es favorita
export const isFavorite = async (userId, propertyId) => {
  const docSnap = await getDoc(doc(db, 'users', userId, 'favorites', propertyId));
  return docSnap.exists();
};