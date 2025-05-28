import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import type { Column } from '../../types';

interface ColumnSettingsProps {
  columns: Column[];
  onAddColumn: (column: Omit<Column, 'id'>) => Promise<void>;
  onUpdateColumn: (id: string, updates: Partial<Column>) => Promise<void>;
  onDeleteColumn: (id: string) => Promise<void>;
  onClose: () => void;
}

export function ColumnSettings({
  columns,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
  onClose
}: ColumnSettingsProps) {
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'text' as const,
    formula: '',
    isEditable: true
  });

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddColumn(newColumn);
    setNewColumn({ name: '', type: 'text', formula: '', isEditable: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Column Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-3">
            <h3 className="text-lg font-medium">Add New Column</h3>
            <div className="ml-2 group relative">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <div className="hidden group-hover:block absolute left-full ml-2 p-2 bg-gray-800 text-white text-sm rounded w-64">
                Formula examples:
                <ul className="list-disc ml-4 mt-1">
                  <li>{'{basePrice} * 1.2'} (20% markup)</li>
                  <li>round({'{basePrice} * 0.9'})</li>
                  <li>max({'{quantity}'}, 10)</li>
                </ul>
              </div>
            </div>
          </div>
          <form onSubmit={handleAddColumn} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newColumn.name}
                onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newColumn.type}
                onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value as 'text' | 'number' | 'formula' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="formula">Formula</option>
              </select>
            </div>
            {newColumn.type === 'formula' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Formula</label>
                <input
                  type="text"
                  value={newColumn.formula}
                  onChange={(e) => setNewColumn({ ...newColumn, formula: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g. {basePrice} * 1.15"
                  required={newColumn.type === 'formula'}
                />
              </div>
            )}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Column
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Existing Columns</h3>
          <div className="space-y-4">
            {columns.map((column) => (
              <div key={column.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => onUpdateColumn(column.id, { name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <select
                  value={column.type}
                  onChange={(e) => onUpdateColumn(column.id, { type: e.target.value as 'text' | 'number' | 'formula' })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="formula">Formula</option>
                </select>
                {column.type === 'formula' && (
                  <input
                    type="text"
                    value={column.formula}
                    onChange={(e) => onUpdateColumn(column.id, { formula: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g. {basePrice} * 1.15"
                  />
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    className="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}