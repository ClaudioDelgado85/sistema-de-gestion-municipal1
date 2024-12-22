import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdditionalActivitiesStore } from '../../../store/additionalActivities';

export function AddActivityInput() {
  const [activity, setActivity] = useState('');
  const addActivity = useAdditionalActivitiesStore((state) => state.addActivity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim()) {
      addActivity(activity.trim());
      setActivity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Agregar actividad adicional"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          type="submit" 
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
