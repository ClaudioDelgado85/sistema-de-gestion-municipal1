import React from 'react';
import { useForm } from 'react-hook-form';
import { File, FileFormData } from '../../types/file';

interface FileFormProps {
  onSubmit: (data: FileFormData) => void;
  onCancel: () => void;
  initialData?: File;
}

function FileForm({ onSubmit, onCancel, initialData }: FileFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FileFormData>({
    defaultValues: initialData ? {
      ...initialData,
      fecha: initialData.fecha,
      fechaSalida: initialData.fechaSalida || undefined,
    } : {
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const onFormSubmit = async (data: FileFormData) => {
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
            Fecha de Entrada
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Expediente
          </label>
          <input
            type="text"
            {...register('numeroExpediente', { required: 'El número de expediente es requerido' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.numeroExpediente && (
            <p className="mt-1 text-sm text-red-600">{errors.numeroExpediente.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Carátula
          </label>
          <input
            type="text"
            {...register('caratula', { required: 'La carátula es requerida' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.caratula && (
            <p className="mt-1 text-sm text-red-600">{errors.caratula.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Salida
          </label>
          <input
            type="date"
            {...register('fechaSalida')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destino
          </label>
          <input
            type="text"
            {...register('destino')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}

export default FileForm;