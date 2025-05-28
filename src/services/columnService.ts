import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Column } from '../types';

const COLLECTION_NAME = 'columns';

const DEFAULT_COLUMNS: Omit<Column, 'id'>[] = [
  { name: 'number', type: 'text', isEditable: true },
  { name: 'basePrice', type: 'number', isEditable: true },
  { name: 'p10', type: 'formula', formula: '{basePrice} + 10', isEditable: false },
  { name: 'price15', type: 'formula', formula: 'round({basePrice} * 1.15)', isEditable: false },
  { name: 'price20', type: 'formula', formula: 'round({basePrice} * 1.20)', isEditable: false },
  { name: 'price25', type: 'formula', formula: 'round({basePrice} * 1.25)', isEditable: false },
  { name: 'price3plus200', type: 'formula', formula: 'round({basePrice} * 1.3 + 200)', isEditable: false }
];

export const columnService = {
  async getAll(): Promise<Column[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const snapshot = await getDocs(q);
    const columns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Column));
    
    // If no columns exist, create default columns
    if (columns.length === 0) {
      const createdColumns = await Promise.all(
        DEFAULT_COLUMNS.map(column => this.add(column))
      );
      return createdColumns;
    }
    
    return columns;
  },

  async add(column: Omit<Column, 'id'>): Promise<Column> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), column);
    return { id: docRef.id, ...column };
  },

  async update(id: string, column: Partial<Column>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, column);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};