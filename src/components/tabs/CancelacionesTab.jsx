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
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { getCancellationStats, normalizeDate } from '../../utils/calculations';

export const CancelacionesTab = ({ data }) => {
  const cancellationStats = getCancellationStats(data);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-2 border-red-500/20 bg-red-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sesiones Canceladas</p>
              <h3 className="text-3xl font-bold text-red-400">
                {cancellationStats.totalCancelados}
              </h3>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Tasa de Cancelación</p>
              <h3 className="text-3xl font-bold text-white">
                {cancellationStats.tasaCancelacion}%
              </h3>
            </div>
            <TrendingDown className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Promedio Mensual</p>
              <h3 className="text-3xl font-bold text-white">
                {cancellationStats.monthly.length > 0
                  ? (
                      cancellationStats.totalCancelados /
                      cancellationStats.monthly.length
                    ).toFixed(1)
                  : 0}
              </h3>
            </div>
            <TrendingDown className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      {cancellationStats.monthly.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Tendencia Mensual de Cancelaciones
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cancellationStats.monthly}>
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
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="cancelados"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Cancelaciones"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cancellation details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Detalle de Cancelaciones</h3>
        {cancellationStats.detalles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Profesor</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Fecha</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {cancellationStats.detalles.slice(0, 50).map((record, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{record.Profesor}</td>
                    <td>{record.Materia}</td>
                    <td>{record.Grupo}</td>
                    <td className="text-sm text-gray-400">
                      {normalizeDate(record.Fecha)}
                    </td>
                    <td className="text-sm text-gray-500 max-w-xs truncate">
                      {record.Observaciones || 'Sin comentarios'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cancellationStats.detalles.length > 50 && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Mostrando 50 de {cancellationStats.detalles.length} cancelaciones
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400">
              ¡Excelente! No hay cancelaciones registradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
