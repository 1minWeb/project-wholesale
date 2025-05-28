import React from 'react';
import { EditableCell } from './EditableCell';
import { TableActions } from './TableActions';
import { evaluateFormula } from '../../utils/formulaEvaluator';
import type { Product, Column } from '../../types';

interface ProductTableProps {
  products: Product[];
  columns: Column[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export function ProductTable({ products, columns, onUpdateProduct, onDeleteProduct }: ProductTableProps) {
  const handleCellChange = async (productId: string, columnName: string, value: string | number) => {
    await onUpdateProduct(productId, { [columnName]: value });
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.name}
              </th>
            ))}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                No products found. Click "Add Product" to create one.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.id} className="whitespace-nowrap">
                    <EditableCell
                      value={
                        column.type === 'formula'
                          ? evaluateFormula(column.formula || '', product)
                          : product[column.name as keyof Product]
                      }
                      onChange={(value) => handleCellChange(product.id, column.name, value)}
                      column={column}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TableActions
                    onDelete={() => onDeleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}