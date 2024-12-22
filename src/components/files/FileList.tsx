import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { File } from '../../types/file';
import { cn } from '../../lib/utils';

interface FileListProps {
  files: File[];
  onEdit: (file: File) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  en_proceso: 'bg-yellow-100 text-yellow-800',
  completado: 'bg-green-100 text-green-800',
};

function FileList({ files, onEdit, onDelete }: FileListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carátula
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Salida
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(file.fecha + 'T12:00:00'), 'dd/MM/yyyy', { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {file.numeroExpediente}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {file.caratula}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {file.fechaSalida && format(new Date(file.fechaSalida + 'T12:00:00'), 'dd/MM/yyyy', { locale: es })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {file.destino}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                  statusColors[file.estado]
                )}>
                  {file.estado === 'en_proceso' ? 'En Proceso' : 'Completado'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(file)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(file.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileList;