export interface Product {
  id: string;
  number: string;
  basePrice: number;
  p10: number;
  price15: number;
  price20: number;
  price25: number;
  price3plus200: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  name: string;
  formula?: string;
  isEditable: boolean;
  type: 'text' | 'number' | 'formula';
}