import React from 'react';
import { useTaskStore } from '../../../store/tasks';
import { useFileStore } from '../../../store/files';
import { useAdditionalActivitiesStore } from '../../../store/additionalActivities';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, CheckCircle, Star } from 'lucide-react';

function RecentActivity() {
  const tasks = useTaskStore((state) => state.tasks);
  const files = useFileStore((state) => state.files);
  const additionalActivities = useAdditionalActivitiesStore((state) => state.activities);

  const getRecentActivities = () => {
    const activities = [
      // Actividades de tareas
      ...tasks.flatMap(task => 
        task.historialEstados
          .filter(history => history.to === 'completada')
          .map(history => ({
            type: 'task',
            id: task.id,
            date: new Date(history.date + 'T12:00:00'),
            description: `Tarea ${task.numeroActa} completada`,
            title: task.tipoActa
          }))
      ),
      // Actividades de expedientes
      ...files.map(file => ({
        type: 'file',
        id: file.id,
        date: new Date(file.fecha + 'T12:00:00'),
        description: file.fechaSalida 
          ? `Expediente ${file.numeroExpediente} completado` 
          : `Expediente ${file.numeroExpediente} creado`,
        title: file.caratula
      })),
      // Actividades adicionales
      ...additionalActivities.map(activity => ({
        type: 'additional',
        id: activity.id,
        date: new Date(activity.createdAt),
        description: activity.description,
        title: 'Actividad Adicional'
      }))
    ];

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  const activities = getRecentActivities();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={`${activity.type}-${activity.id}`}>
              <div className="relative pb-8">
                {index !== activities.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      {activity.type === 'file' ? (
                        <FileText className="h-5 w-5 text-gray-500" />
                      ) : activity.type === 'task' ? (
                        <CheckCircle className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Star className="h-5 w-5 text-yellow-500" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      {formatDistanceToNow(activity.date, { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RecentActivity;