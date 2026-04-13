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
import { Users, Award, BookOpen } from 'lucide-react';
import { getTeacherStats } from '../../utils/calculations';

export const ProfesoresTab = ({ data }) => {
  const teacherStats = getTeacherStats(data);
  const topTeachers = teacherStats.slice(0, 10);

  // Prepare data for chart
  const chartData = topTeachers.map((teacher) => ({
    nombre: teacher.nombre.split(' ')[0], // First name only for chart
    sesiones: teacher.sesiones,
    materias: teacher.materias,
  }));

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total de Profesores Activos</p>
              <h3 className="text-3xl font-bold text-white">{teacherStats.length}</h3>
            </div>
            <Users className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sesiones Promedio</p>
              <h3 className="text-3xl font-bold text-white">
                {teacherStats.length > 0
                  ? (
                      teacherStats.reduce((sum, t) => sum + t.sesiones, 0) /
                      teacherStats.length
                    ).toFixed(1)
                  : 0}
              </h3>
            </div>
            <Award className="w-6 h-6 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Máximo de Sesiones</p>
              <h3 className="text-3xl font-bold text-white">
                {teacherStats.length > 0 ? teacherStats[0].sesiones : 0}
              </h3>
            </div>
            <Award className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Bar chart */}
      {topTeachers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Top 10 Profesores por Sesiones
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
              <Bar
                dataKey="materias"
                fill="#06b6d4"
                name="Materias"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Teacher cards table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Detalle de Profesores</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Profesor</th>
                <th className="text-right">Sesiones</th>
                <th className="text-right">Materias</th>
                <th className="text-right">Grupos</th>
              </tr>
            </thead>
            <tbody>
              {teacherStats.map((teacher, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{teacher.nombre}</td>
                  <td className="text-right">
                    <span className="px-3 py-1 rounded-full text-sm bg-accent/20 text-accent font-medium">
                      {teacher.sesiones}
                    </span>
                  </td>
                  <td className="text-right">{teacher.materias}</td>
                  <td className="text-right">{teacher.grupos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
