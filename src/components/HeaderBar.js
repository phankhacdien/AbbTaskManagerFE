import React, { useState } from 'react';
import NewTaskDialog from './NewTaskDialog';

export default function HeaderBar({ onTaskCreated }) {
  const [showDialog, setShowDialog] = useState(false);
  const filters = ['New Task', 'Suspend', 'Done', 'PreGolive', 'All'];

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <div className="text-2xl">📋</div>
        {filters.map(f => (
          <button
            key={f}
            className={`px-4 py-1 rounded-full ${f === 'New Task' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-600`}
            onClick={() => f === 'New Task' && setShowDialog(true)}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto">
          <input type="text" placeholder="Search..." className="rounded px-3 py-1 text-black" />
        </div>
      </div>

      {showDialog && <NewTaskDialog onClose={() => setShowDialog(false)} onCreate={onTaskCreated} />}
    </>
  );
}
