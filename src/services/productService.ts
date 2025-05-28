import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types';

const COLLECTION_NAME = 'products';

export const productService = {
  async getAll(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async add(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...product, createdAt: new Date(), updatedAt: new Date() };
  },

  async update(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...product, updatedAt: new Date() });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};