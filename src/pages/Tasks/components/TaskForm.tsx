import { useForm } from 'react-hook-form';
import { Task, TaskFormData, TaskType } from '../../../types/task';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Task;
}

const taskTypes: { value: TaskType; label: string }[] = [
  { value: 'intimacion', label: 'Intimación' },
  { value: 'infraccion', label: 'Infracción' },
  { value: 'clausura', label: 'Clausura' },
  { value: 'decomiso', label: 'Decomiso' },
  { value: 'habilitacion', label: 'Habilitación' },
  { value: 'planos', label: 'Planos' },
];

function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: initialData || {
      fecha: new Date().toLocaleDateString('en-CA'),  // Formato YYYY-MM-DD
      tipoActa: undefined,
    },
  });

  const tipoActa = watch('tipoActa');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Fecha
          </label>
          <input
            type="date"
            {...register('fecha', { required: 'La fecha es requerida' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.fecha && (
            <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Tipo de Acta
          </label>
          <select
            {...register('tipoActa', { required: 'El tipo de acta es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          >
            <option value="">Seleccione un tipo</option>
            {taskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.tipoActa && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoActa.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Número de Acta
          </label>
          <input
            type="text"
            {...register('numeroActa', { required: 'El número de acta es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.numeroActa && (
            <p className="mt-1 text-sm text-red-600">{errors.numeroActa.message}</p>
          )}
        </div>

        {tipoActa === 'intimacion' && (
          <div>
            <label className="block text-sm font-medium text-lavender-700">
              Plazo
            </label>
            <input
              type="date"
              {...register('plazo', { 
                required: 'El plazo es requerido para intimaciones'
              })}
              className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
            />
            {errors.plazo && (
              <p className="mt-1 text-sm text-red-600">{errors.plazo.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Nombre del Infractor
          </label>
          <input
            type="text"
            {...register('infractor.nombre', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor?.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            DNI
          </label>
          <input
            type="text"
            {...register('infractor.dni', { required: 'El DNI es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor?.dni && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor.dni.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Domicilio
          </label>
          <input
            type="text"
            {...register('infractor.domicilio', { required: 'El domicilio es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor?.domicilio && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor.domicilio.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-lavender-700">
            Descripción de la Falta
          </label>
          <textarea
            {...register('descripcionFalta', { required: 'La descripción es requerida' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.descripcionFalta && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcionFalta.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-lavender-700">
            Observaciones
          </label>
          <textarea
            {...register('observaciones')}
            rows={2}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-lavender-300 rounded-md shadow-sm text-sm font-medium text-lavender-700 bg-white hover:bg-lavender-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lavender-600 hover:bg-lavender-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default TaskForm;