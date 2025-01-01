import React from 'react';
import { useForm } from 'react-hook-form';
import { OtherActivity, OtherActivityFormData } from '../../types/other-activity';

interface OtherActivityFormProps {
  onSubmit: (data: OtherActivityFormData) => void;
  onCancel: () => void;
  initialData?: OtherActivity;
}

function OtherActivityForm({ onSubmit, onCancel, initialData }: OtherActivityFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<OtherActivityFormData>({
    defaultValues: initialData ? {
      ...initialData,
      fecha: initialData.fecha,
    } : {
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const onFormSubmit = async (data: OtherActivityFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            {...register('fecha', { required: 'La fecha es requerida' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.fecha && (
            <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            {...register('descripcion', { required: 'La descripción es requerida' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            {...register('direccion', { required: 'La dirección es requerida' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.direccion && (
            <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            {...register('observaciones')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default OtherActivityForm;
