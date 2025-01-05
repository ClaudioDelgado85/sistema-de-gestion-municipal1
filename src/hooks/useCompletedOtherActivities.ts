import { useOtherActivitiesStore } from '../store/otherActivities';
import { OtherActivity } from '../types/OtherActivity';

export function useCompletedOtherActivities(): OtherActivity[] {
  const activities = useOtherActivitiesStore((state) => state.activities);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('Estado del store de actividades:', useOtherActivitiesStore.getState());
  console.log('Todas las actividades disponibles:', activities);

  const completedActivities = activities.filter(activity => {
    const activityDate = new Date(activity.created_at);
    activityDate.setHours(0, 0, 0, 0);

    const isToday = activityDate.getTime() === today.getTime();
    // Aceptar tanto 'completada' como 'completado'
    const isCompleted = activity.estado === 'completada' || activity.estado === 'completado';

    console.log('Evaluando actividad:', {
      id: activity.id,
      created_at: activity.created_at,
      fechaParseada: activityDate.toISOString(),
      today: today.toISOString(),
      isToday,
      estado: activity.estado,
      isCompleted
    });

    return isToday && isCompleted;
  });

  console.log('Actividades filtradas para hoy:', completedActivities);
  return completedActivities;
}
