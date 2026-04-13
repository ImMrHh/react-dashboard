import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

export const FilterControls = ({ onFilterChange, defaultFilter = 'all' }) => {
  const [filterType, setFilterType] = useState(defaultFilter);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === 'custom') {
      // Don't call callback until both dates are set
      return;
    }
    onFilterChange({ type, startDate: '', endDate: '' });
  };

  const handleCustomDateChange = () => {
  if (!startDate || !endDate) {
    alert('Por favor completa ambas fechas');
    return;
  }
  
  // Validar que startDate <= endDate
  if (new Date(startDate) > new Date(endDate)) {
    alert('La fecha inicial debe ser menor o igual a la fecha final');
    return;
  }
  
  onFilterChange({ type: 'custom', startDate, endDate });
};

  const handleClearCustom = () => {
    setStartDate('');
    setEndDate('');
    setFilterType('all');
    onFilterChange({ type: 'all', startDate: '', endDate: '' });
  };

  const filters = [
    { id: 'all', label: 'Ciclo Completo', desc: 'Todo el período' },
    { id: 'last3months', label: 'Últimos 3 Meses', desc: 'Desde hace 3 meses' },
    { id: 'custom', label: 'Rango Personalizado', desc: 'Selecciona fechas' },
  ];

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
      </div>

      <div className="space-y-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              filterType === filter.id
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50 bg-surface/50'
            }`}
          >
            <div className="font-medium text-white">{filter.label}</div>
            <div className="text-sm text-gray-400">{filter.desc}</div>
          </button>
        ))}
      </div>

      {/* Custom date range inputs */}
      {filterType === 'custom' && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleCustomDateChange}
            disabled={!startDate || !endDate}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar Rango
          </button>

          <button
            onClick={handleClearCustom}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpiar Filtro
          </button>
        </div>
      )}
    </div>
  );
};
