import React from 'react';
import { TrendingUp, Users, BookOpen, Clock, Building2, Layers } from 'lucide-react';

const KPICard = ({ icon: Icon, label, value, unit, trend, color = 'accent' }) => {
  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} strokeWidth={1.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>
  );
};

export const KPIGrid = ({ kpis, projections = null }) => {
  const cards = [
    {
      icon: Users,
      label: 'Sesiones VR',
      value: kpis.sesionesVR,
      unit: 'sesiones',
      color: 'accent',
      trend: projections ? `${projections.ciclo2.sesionesVR} →` : null,
    },
    {
      icon: BookOpen,
      label: 'Clases Impartidas',
      value: kpis.clasesImpartidas,
      unit: 'clases',
      color: 'blue',
      trend: projections ? `${projections.ciclo2.clasesImpartidas} →` : null,
    },
    {
      icon: Users,
      label: 'Profesores Activos',
      value: kpis.profesoresActivos,
      unit: '/20',
      color: 'purple',
      trend: projections ? `${projections.ciclo2.profesoresActivos} →` : null,
    },
    {
      icon: Clock,
      label: 'Horas VR',
      value: kpis.horasVR,
      unit: 'horas',
      color: 'green',
      trend: projections ? `${projections.ciclo2.horasVR} →` : null,
    },
    {
      icon: Building2,
      label: 'Instituciones Visitantes',
      value: kpis.institucionesVisitantes,
      unit: 'instituciones',
      color: 'orange',
    },
    {
      icon: Layers,
      label: 'Materias Participantes',
      value: kpis.materiasParticipantes,
      unit: 'materias',
      color: 'pink',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};
