import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { File, FileStatus } from '../../types/file';
import { cn } from '../../lib/utils';

interface FileListProps {
  files: File[];
  onEdit: (file: File) => void;
  onDelete: (id: number) => void;
}

function FileList({ files, onEdit, onDelete }: FileListProps) {
  console.log('FileList - files recibidos:', files);

  const getStatusColor = (estado: FileStatus) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error formateando fecha:', dateString, error);
      return '';
    }
  };

  if (!Array.isArray(files)) {
    console.error('FileList - files no es un array:', files);
    return <div>Error: No se pudieron cargar los expedientes</div>;
  }

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
                {formatDate(file.fecha)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {file.numeroExpediente}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {file.caratula}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(file.fechaSalida)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {file.destino}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusColor(file.estado)
                )}>
                  {file.estado}
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