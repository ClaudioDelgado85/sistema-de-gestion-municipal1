import React from 'react';
import { useTaskStore } from '../../../store/tasks';
import { Task, TaskType } from '../../../types/task';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface TaskTypeCount {
  tipo: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

const COLORS = {
  'intimacion': '#FCD34D',    // Amarillo
  'infraccion': '#F87171',    // Rojo
  'clausura': '#60A5FA',      // Azul
  'decomiso': '#34D399',      // Verde
  'habilitacion': '#A78BFA',  // Violeta
  'planos': '#FB923C',        // Naranja
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          Cantidad: {payload[0].value}
        </p>
        <p className="text-sm text-gray-600">
          Porcentaje: {payload[0].payload.porcentaje.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const TasksOverview = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const getTasksByType = (tasks: Task[]): TaskTypeCount[] => {
    const total = tasks.length;
    const counts = tasks.reduce((acc, task) => {
      acc[task.tipo_acta] = (acc[task.tipo_acta] || 0) + 1;
      return acc;
    }, {} as Record<TaskType, number>);

    return Object.entries(counts).map(([tipo, cantidad]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      cantidad,
      porcentaje: (cantidad / total) * 100,
      color: COLORS[tipo as keyof typeof COLORS] || '#CBD5E1'
    })).sort((a, b) => b.cantidad - a.cantidad);
  };

  const data = getTasksByType(tasks);
  const totalTasks = tasks.length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Distribución de Tareas por Tipo</h3>
        <span className="text-sm text-gray-500">Total: {totalTasks}</span>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="tipo" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="cantidad" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {data.map((item) => (
          <div 
            key={item.tipo} 
            className="flex items-center text-sm"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">
              {item.tipo}: {item.porcentaje.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksOverview;
