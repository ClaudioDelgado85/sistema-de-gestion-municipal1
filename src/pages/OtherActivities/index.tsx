import { useEffect, useState } from 'react';
import useOtherActivityStore from '../../store/other-activities';
import { OtherActivity } from '../../types/other-activity';
import OtherActivityForm from '../../components/other-activities/OtherActivityForm';
import OtherActivityList from '../../components/other-activities/OtherActivityList';
import SearchBar from '../../components/common/SearchBar';

function OtherActivities() {
  console.log('Rendering OtherActivities component'); // Debug log
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<OtherActivity | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    addActivity, 
    updateActivity, 
    deleteActivity, 
    getFilteredActivities, 
    fetchActivities,
    setSearchTerm 
  } = useOtherActivityStore();
  
  const filteredActivities = getFilteredActivities();

  useEffect(() => {
    console.log('OtherActivities - Iniciando fetchActivities');
    const loadActivities = async () => {
      try {
        await fetchActivities();
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        setError('Error al cargar las actividades. Por favor, intente nuevamente.');
      }
    };
    
    loadActivities();
  }, [fetchActivities]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingActivity) {
        console.log('Actualizando actividad:', editingActivity.id, data);
        await updateActivity(editingActivity.id, data);
      } else {
        console.log('Creando nueva actividad:', data);
        await addActivity(data);
      }
      setShowForm(false);
      setEditingActivity(null);
      setError(null);
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      setError('Error al guardar la actividad. Por favor, intente nuevamente.');
    }
  };

  const handleEdit = (activity: OtherActivity) => {
    setEditingActivity(activity);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      try {
        await deleteActivity(id);
        setError(null);
      } catch (error) {
        console.error('Error al eliminar actividad:', error);
        setError('Error al eliminar la actividad. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Otras Actividades</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de otras actividades registradas en el sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingActivity(null);
              setShowForm(true);
              setError(null);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Agregar actividad
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8">
        <SearchBar onSearch={setSearchTerm} placeholder="Buscar actividades..." />
      </div>

      {showForm ? (
        <div className="mt-8">
          <OtherActivityForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingActivity(null);
              setError(null);
            }}
            initialData={editingActivity || undefined}
          />
        </div>
      ) : (
        <OtherActivityList
          activities={filteredActivities}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default OtherActivities;
