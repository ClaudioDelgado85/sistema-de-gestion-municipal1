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
    defaultValues: {
      fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
      tipo_acta: initialData?.tipo_acta || undefined,
      numero_acta: initialData?.numero_acta || '',
      plazo: initialData?.plazo || '',
      infractor_nombre: initialData?.infractor_nombre || '',
      infractor_dni: initialData?.infractor_dni || '',
      infractor_domicilio: initialData?.infractor_domicilio || '',
      descripcion_falta: initialData?.descripcion_falta || '',
      observaciones: initialData?.observaciones || '',
      estado: initialData?.estado || 'pendiente',
      expediente_id: initialData?.expediente_id
    }
  });

  const tipoActa = watch('tipo_acta');

  const onSubmitForm = async (data: TaskFormData) => {
    try {
      console.log('Datos completos a enviar:', JSON.stringify(data, null, 2));
      await onSubmit(data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
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
            {...register('tipo_acta', { required: 'El tipo de acta es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          >
            <option value="">Seleccione un tipo</option>
            {taskTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.tipo_acta && (
            <p className="mt-1 text-sm text-red-600">{errors.tipo_acta.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Número de Acta
          </label>
          <input
            type="text"
            {...register('numero_acta', { required: 'El número de acta es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.numero_acta && (
            <p className="mt-1 text-sm text-red-600">{errors.numero_acta.message}</p>
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
            {...register('infractor_nombre', { required: 'El nombre es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor_nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor_nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            DNI
          </label>
          <input
            type="text"
            {...register('infractor_dni', { required: 'El DNI es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor_dni && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor_dni.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-lavender-700">
            Domicilio
          </label>
          <input
            type="text"
            {...register('infractor_domicilio', { required: 'El domicilio es requerido' })}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.infractor_domicilio && (
            <p className="mt-1 text-sm text-red-600">{errors.infractor_domicilio.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-lavender-700">
            Descripción de la Falta
          </label>
          <textarea
            {...register('descripcion_falta', { required: 'La descripción es requerida' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-lavender-300 shadow-sm focus:border-lavender-500 focus:ring-lavender-500"
          />
          {errors.descripcion_falta && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion_falta.message}</p>
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