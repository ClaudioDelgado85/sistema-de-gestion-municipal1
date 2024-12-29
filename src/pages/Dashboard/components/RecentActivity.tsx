import { useTaskStore } from '../../../store/tasks';
import { useFileStore } from '../../../store/files';
import { useAdditionalActivitiesStore } from '../../../store/additionalActivities';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, CheckCircle, Star } from 'lucide-react';
import { TaskType } from '../../../types/task';

interface Activity {
  type: 'task' | 'file' | 'additional';
  id: string | number;
  date: Date;
  description: string;
  title: string | TaskType;
}

function RecentActivity() {
  const tasks = useTaskStore((state) => state.tasks);
  const files = useFileStore((state) => state.files);
  const additionalActivities = useAdditionalActivitiesStore((state) => state.activities);

  const parseDateSafely = (dateStr: string): Date => {
    try {
      // Intenta parsear la fecha ISO
      return parseISO(dateStr);
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date(); // Fecha actual como fallback
    }
  };

  const getRecentActivities = (): Activity[] => {
    if (!tasks || !files || !additionalActivities) {
      return [];
    }

    const activities: Activity[] = [
      // Actividades de tareas
      ...tasks.flatMap(task => {
        if (!task.updated_at) return [];

        const history = task.estado === 'completada' ? [{
          to: 'completada',
          date: task.updated_at
        }] : [];
        
        return history.map(hist => ({
          type: 'task' as const,
          id: task.id,
          date: parseDateSafely(hist.date),
          description: `Tarea ${task.numero_acta} completada`,
          title: task.tipo_acta
        }));
      }),
      // Actividades de expedientes
      ...files.flatMap(file => {
        if (!file.fecha) return [];
        
        return [{
          type: 'file' as const,
          id: file.id,
          date: parseDateSafely(file.fecha),
          description: file.fechaSalida 
            ? `Expediente ${file.numeroExpediente} completado` 
            : `Expediente ${file.numeroExpediente} creado`,
          title: file.caratula || 'Sin título'
        }];
      }),
      // Actividades adicionales
      ...(additionalActivities || []).flatMap(activity => {
        if (!activity.createdAt) return [];

        return [{
          type: 'additional' as const,
          id: activity.id.toString(),
          date: parseDateSafely(activity.createdAt),
          description: activity.description || 'Actividad sin descripción',
          title: 'Actividad Adicional'
        }];
      })
    ];

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  const activities = getRecentActivities();

  if (!tasks || !files || !additionalActivities) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="text-center py-4">
          <p className="text-gray-500">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={`${activity.type}-${activity.id}`}>
              <div className="relative pb-8">
                {index < activities.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {activity.type === 'file' ? (
                        <FileText className="h-5 w-5 text-gray-500" />
                      ) : activity.type === 'task' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Star className="h-5 w-5 text-yellow-500" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDate(activity.date)}
                      </p>
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