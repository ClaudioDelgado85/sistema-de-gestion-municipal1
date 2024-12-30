import React from 'react';
import { useFileStore } from '../../../store/files';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileAnalysis {
  total: number;
  pendientes: number;
  completados: number;
  tiempoPromedioResolucion: number;
  expedientesSinMovimiento: Array<{
    numeroexpediente: string;
    caratula: string;
    diasSinMovimiento: number;
  }>;
}

const FilesAnalysis = () => {
  const files = useFileStore((state) => state.files);

  const analyzeFiles = (): FileAnalysis => {
    const now = new Date();
    let totalDiasResolucion = 0;
    let expedientesResueltos = 0;

    const analysis = files.reduce(
      (acc, file) => {
        // Conteo por estado
        if (file.estado === 'completado') {
          acc.completados++;
          if (file.fechasalida) {
            const diasResolucion = differenceInDays(
              parseISO(file.fechasalida),
              parseISO(file.created_at)
            );
            totalDiasResolucion += diasResolucion;
            expedientesResueltos++;
          }
        } else {
          acc.pendientes++;
          // Verificar expedientes sin movimiento por más de 15 días
          const diasSinMovimiento = differenceInDays(
            now,
            parseISO(file.updated_at)
          );
          if (diasSinMovimiento > 15) {
            acc.expedientesSinMovimiento.push({
              numeroexpediente: file.numeroexpediente,
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
        tiempoPromedioResolucion: 0,
        expedientesSinMovimiento: [],
      } as FileAnalysis
    );

    analysis.tiempoPromedioResolucion = expedientesResueltos
      ? Math.round(totalDiasResolucion / expedientesResueltos)
      : 0;

    return analysis;
  };

  const analysis = analyzeFiles();

  return (
    <div className="space-y-6">
      {/* Resumen de estados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expedientes</p>
              <p className="text-2xl font-semibold text-blue-600">
                {analysis.total}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {analysis.pendientes}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-semibold text-green-600">
                {analysis.completados}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tiempo promedio de resolución */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Tiempo Promedio de Resolución</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">
          {analysis.tiempoPromedioResolucion} días
        </p>
      </div>

      {/* Expedientes sin movimiento */}
      {analysis.expedientesSinMovimiento.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">
              Expedientes Sin Movimiento (+15 días)
            </h3>
          </div>
          <div className="space-y-3">
            {analysis.expedientesSinMovimiento.map((exp) => (
              <div
                key={exp.numeroexpediente}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Expediente: {exp.numeroexpediente}
                  </p>
                  <p className="text-sm text-gray-600">{exp.caratula}</p>
                </div>
                <div className="text-sm text-yellow-600 font-medium">
                  {exp.diasSinMovimiento} días sin movimiento
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesAnalysis;
