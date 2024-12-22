import React from 'react';
import { useNotificationStore } from '../../store/notifications';

function NotificationPreferences() {
  const { preferences, updatePreferences } = useNotificationStore();

  const togglePreference = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const preferenceItems = [
    {
      key: 'email',
      label: 'Notificaciones por correo electrónico',
      description: 'Recibir notificaciones importantes por correo',
    },
    {
      key: 'browser',
      label: 'Notificaciones del navegador',
      description: 'Mostrar notificaciones en el navegador',
    },
    {
      key: 'taskReminders',
      label: 'Recordatorios de tareas',
      description: 'Recibir recordatorios de tareas pendientes',
    },
    {
      key: 'fileUpdates',
      label: 'Actualizaciones de expedientes',
      description: 'Notificar cuando hay cambios en expedientes',
    },
    {
      key: 'intimationDeadlines',
      label: 'Plazos de intimaciones',
      description: 'Alertar sobre vencimientos de intimaciones',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Preferencias de Notificaciones
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Personalice cómo y cuándo recibir notificaciones
        </p>
      </div>

      <div className="space-y-4">
        {preferenceItems.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                className={`${
                  preferences[key as keyof typeof preferences]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                onClick={() => togglePreference(key as keyof typeof preferences)}
              >
                <span
                  className={`${
                    preferences[key as keyof typeof preferences]
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPreferences;