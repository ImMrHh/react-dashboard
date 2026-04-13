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
  LineChart,
  Line,
} from 'recharts';
import { ClipboardList, Calendar } from 'lucide-react';
import { getPlanningStats, normalizeDate } from '../../utils/calculations';

export const PlaneacionTab = ({ data }) => {
  const planningStats = getPlanningStats(data);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-2 border-purple-500/20 bg-purple-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sesiones de Planeación</p>
              <h3 className="text-3xl font-bold text-purple-400">
                {planningStats.totalPlaneacion}
              </h3>
            </div>
            <ClipboardList className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Promedio Mensual</p>
              <h3 className="text-3xl font-bold text-white">
                {planningStats.promedioPorMes}
              </h3>
            </div>
            <Calendar className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Meses con Actividad</p>
              <h3 className="text-3xl font-bold text-white">
                {planningStats.monthly.length}
              </h3>
            </div>
            <Calendar className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      {planningStats.monthly.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Distribución Mensual de Planeaciones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planningStats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
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
              <Bar
                dataKey="sesiones"
                fill="#a855f7"
                name="Sesiones de Planeación"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Planning details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">
          Detalle de Sesiones de Planeación
        </h3>
        {planningStats.detalles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Profesor</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {planningStats.detalles.slice(0, 50).map((record, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{record.Profesor}</td>
                    <td>{record.Materia}</td>
                    <td>{record.Grupo}</td>
                    <td className="text-sm text-gray-400">
                      {normalizeDate(record.Fecha)}
                    </td>
                    <td className="text-sm text-gray-400">{record.Hora}</td>
                    <td className="text-sm text-gray-500 max-w-xs truncate">
                      {record.Observaciones || 'Sin comentarios'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {planningStats.detalles.length > 50 && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Mostrando 50 de {planningStats.detalles.length} sesiones
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              No hay sesiones de planeación registradas en el período seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
