import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Layers, BookOpen } from 'lucide-react';
import { getSubjectStats } from '../../utils/calculations';

export const MateriasTab = ({ data }) => {
  const subjectStats = getSubjectStats(data);

  // Prepare data for chart
  const chartData = subjectStats.slice(0, 12).map((subject) => ({
    nombre: subject.nombre.substring(0, 15), // Truncate long names
    sesiones: subject.sesiones,
  }));

  const totalSesiones = subjectStats.reduce((sum, s) => sum + s.sesiones, 0);
  const promedio = subjectStats.length > 0 ? (totalSesiones / subjectStats.length).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Materias Participantes</p>
              <h3 className="text-3xl font-bold text-white">{subjectStats.length}</h3>
            </div>
            <Layers className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sesiones Totales</p>
              <h3 className="text-3xl font-bold text-white">{totalSesiones}</h3>
            </div>
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Promedio por Materia</p>
              <h3 className="text-3xl font-bold text-white">{promedio}</h3>
            </div>
            <BookOpen className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Top 12 Materias por Sesiones
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="nombre"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar
                dataKey="sesiones"
                fill="#0ea5e9"
                name="Sesiones"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Subject cards table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Detalle de Materias</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Materia</th>
                <th className="text-right">Sesiones</th>
                <th className="text-right">Grupos</th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((subject, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{subject.nombre}</td>
                  <td className="text-right">
                    <span className="px-3 py-1 rounded-full text-sm bg-accent/20 text-accent font-medium">
                      {subject.sesiones}
                    </span>
                  </td>
                  <td className="text-right">{subject.grupos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
