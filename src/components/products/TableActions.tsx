import React from 'react';
import { Trash2Icon } from 'lucide-react';

interface TableActionsProps {
  onDelete: () => void;
}

export function TableActions({ onDelete }: TableActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-900"
        title="Delete"
      >
        <Trash2Icon className="h-5 w-5" />
      </button>
    </div>
  );
}