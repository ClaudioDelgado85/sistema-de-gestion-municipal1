import { useFileStore } from '../../../store/files';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface FileAnalysis {
  total: number;
  pendientes: number;
  completados: number;
  expedientesSinMovimiento: Array<{
    numeroExpediente: string;
    caratula: string;
    diasSinMovimiento: number;
  }>;
}

const FilesAnalysis = () => {
  const files = useFileStore((state) => state.files);

  const analyzeFiles = (): FileAnalysis => {
    const now = new Date();

    const analysis = files.reduce(
      (acc, file) => {
        // Conteo por estado
        if (file.estado === 'completado') {
          acc.completados++;
        } else {
          acc.pendientes++;
          // Verificar expedientes sin movimiento por más de 15 días
          const diasSinMovimiento = differenceInDays(
            now,
            parseISO(file.updated_at)
          );
          if (diasSinMovimiento > 15) {
            acc.expedientesSinMovimiento.push({
              numeroExpediente: file.numeroExpediente,
              caratula: file.caratula,
              diasSinMovimiento,
            });
          }
        }
        return acc;
      },
      {
        total: files.length,
        pendientes: 0,
        completados: 0,
        expedientesSinMovimiento: [],
      } as FileAnalysis
    );

    return analysis;
  };

  const analysis = analyzeFiles();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-blue-50 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600">Total</h4>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-blue-600">
                    {analysis.total}
                  </p>
                  <p className="ml-2 text-xs text-gray-500">En sistema</p>
                </div>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 opacity-20"></div>
        </div>

        <div className="relative overflow-hidden bg-yellow-50 rounded-lg border border-yellow-200 transition-all duration-300 hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600">Pendientes</h4>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-yellow-600">
                    {analysis.pendientes}
                  </p>
                  <p className="ml-2 text-xs text-gray-500">En proceso</p>
                </div>
              </div>
              <div className="p-2 rounded-full bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-600 opacity-20"></div>
        </div>

        <div className="relative overflow-hidden bg-green-50 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-600">Completados</h4>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-green-600">
                    {analysis.completados}
                  </p>
                  <p className="ml-2 text-xs text-gray-500">Finalizados</p>
                </div>
              </div>
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 opacity-20"></div>
        </div>
      </div>

      {/* Lista de expedientes sin movimiento */}
      {analysis.expedientesSinMovimiento.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-600 mb-3">
            Expedientes sin movimiento reciente
          </h4>
          <div className="space-y-2">
            {analysis.expedientesSinMovimiento.map((exp) => (
              <div
                key={exp.numeroExpediente}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {exp.numeroExpediente}
                  </p>
                  <p className="text-xs text-gray-500">{exp.caratula}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {exp.diasSinMovimiento} días
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesAnalysis;
