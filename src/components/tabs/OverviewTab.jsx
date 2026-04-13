import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { KPIGrid } from '../KPICard';
import { TrendingUp, Zap } from 'lucide-react';
import { getMonthlyTrends } from '../../utils/calculations';

export const OverviewTab = ({ data, kpis, projections }) => {
  const [showProjections, setShowProjections] = useState(false);
  const monthlyData = getMonthlyTrends(data);

  // Prepare projection data
  const projectionData = [
    {
      ciclo: 'Ciclo 1 (Actual)',
      sesiones: kpis.sesionesVR,
      clases: kpis.clasesImpartidas,
      horas: kpis.horasVR,
    },
    {
      ciclo: 'Ciclo 2 (Proyectado)',
      sesiones: projections.ciclo2.sesionesVR,
      clases: projections.ciclo2.clasesImpartidas,
      horas: projections.ciclo2.horasVR,
    },
    {
      ciclo: 'Ciclo 3 (Proyectado)',
      sesiones: projections.ciclo3.sesionesVR,
      clases: projections.ciclo3.clasesImpartidas,
      horas: projections.ciclo3.horasVR,
    },
  ];

  const colors = {
    sesiones: '#0ea5e9',
    clases: '#06b6d4',
    horas: '#10b981',
    demos: '#f59e0b',
  };

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Indicadores Clave</h2>
        <KPIGrid kpis={kpis} projections={projections} />
      </div>

      {/* Monthly Trend Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Tendencia Mensual de Sesiones</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="sesiones"
              stroke={colors.sesiones}
              strokeWidth={2}
              dot={{ fill: colors.sesiones, r: 4 }}
              activeDot={{ r: 6 }}
              name="Sesiones Totales"
            />
            <Line
              type="monotone"
              dataKey="clases"
              stroke={colors.clases}
              strokeWidth={2}
              dot={{ fill: colors.clases, r: 4 }}
              activeDot={{ r: 6 }}
              name="Clases"
            />
            <Line
              type="monotone"
              dataKey="demos"
              stroke={colors.demos}
              strokeWidth={2}
              dot={{ fill: colors.demos, r: 4 }}
              activeDot={{ r: 6 }}
              name="Demostraciones"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Projections Section */}
      <div className="card border-2 border-accent/30 bg-accent/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Proyecciones de Crecimiento</h3>
          </div>
          <button
            onClick={() => setShowProjections(!showProjections)}
            className="btn btn-secondary text-sm"
          >
            {showProjections ? 'Ocultar' : 'Ver'} Detalles
          </button>
        </div>

        {showProjections && (
          <div className="space-y-6">
            {/* Growth note */}
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-gray-300">
                <strong>Modelo de crecimiento:</strong> Ciclo 2 y 3 proyectados con 50% de incremento por período.
                Los profesores activos están limitados a 20 máximo.
              </p>
            </div>

            {/* Projection chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis
                  dataKey="ciclo"
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
                <Legend />
                <Bar dataKey="sesiones" fill={colors.sesiones} name="Sesiones" radius={[8, 8, 0, 0]} />
                <Bar dataKey="clases" fill={colors.clases} name="Clases" radius={[8, 8, 0, 0]} />
                <Bar dataKey="horas" fill={colors.horas} name="Horas VR" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Projection details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectionData.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface border border-border">
                  <h4 className="font-semibold text-white text-center mb-3">{item.ciclo}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sesiones:</span>
                      <span className="text-accent font-medium">{item.sesiones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clases:</span>
                      <span className="text-accent font-medium">{item.clases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Horas VR:</span>
                      <span className="text-accent font-medium">{item.horas}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
