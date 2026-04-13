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
import { Building2, Users, Calendar } from 'lucide-react';
import { getVisitingInstitutionsStats } from '../../utils/calculations';

export const EscuelasVisitantesTab = ({ data }) => {
  const institutionStats = getVisitingInstitutionsStats(data);
  const topInstitutions = institutionStats.slice(0, 10);

  // Prepare data for chart
  const chartData = topInstitutions.map((inst) => ({
    nombre: inst.nombre.substring(0, 20), // Truncate long names
    sesiones: inst.sesiones,
    materias: inst.materias,
  }));

  const totalVisitas = institutionStats.reduce((sum, i) => sum + i.sesiones, 0);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-2 border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Instituciones Visitantes</p>
              <h3 className="text-3xl font-bold text-orange-400">
                {institutionStats.length}
              </h3>
            </div>
            <Building2 className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Demostraciones Totales</p>
              <h3 className="text-3xl font-bold text-white">{totalVisitas}</h3>
            </div>
            <Users className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Promedio por Institución</p>
              <h3 className="text-3xl font-bold text-white">
                {institutionStats.length > 0
                  ? (totalVisitas / institutionStats.length).toFixed(1)
                  : 0}
              </h3>
            </div>
            <Calendar className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Top 10 Instituciones Visitantes
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
                fill="#f97316"
                name="Demostraciones"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="materias"
                fill="#fb923c"
                name="Materias Mostradas"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Institution cards grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">Instituciones Visitantes</h3>
        {institutionStats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutionStats.map((institution, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white truncate">
                      {institution.nombre}
                    </h4>
                  </div>
                  <Building2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Demostraciones:</span>
                    <span className="font-semibold text-accent">
                      {institution.sesiones}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Materias:</span>
                    <span className="font-semibold text-accent">
                      {institution.materias}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm text-gray-400">Última visita:</span>
                    <span className="text-sm text-gray-300">
                      {institution.ultimaVisita || 'Sin datos'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              No hay registros de instituciones visitantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
