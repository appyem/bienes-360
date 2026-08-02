import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

// Crear un nuevo Lead
export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'nuevo', 
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creando lead:', error);
    throw error;
  }
};

// Obtener todos los leads (ordenados por más recientes)
export const getLeads = async () => {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error obteniendo leads:', error);
    throw error;
  }
};

// Actualizar el estado de un lead
export const updateLeadStatus = async (leadId, status) => {
  try {
    await updateDoc(doc(db, 'leads', leadId), { status });
  } catch (error) {
    console.error('Error actualizando estado del lead:', error);
    throw error;
  }
};