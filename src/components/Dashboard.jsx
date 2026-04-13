import React, { useState, useMemo } from 'react';
import { LogOut, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFetchData, filterDataByDate, getDateRange } from '../hooks/useData';
import { calculateKPIs, calculateProjections } from '../utils/calculations';
import { FilterControls } from './FilterControls';
import { OverviewTab } from './tabs/OverviewTab';
import { ProfesoresTab } from './tabs/ProfesoresTab';
import { MateriasTab } from './tabs/MateriasTab';
import { CancelacionesTab } from './tabs/CancelacionesTab';
import { PlaneacionTab } from './tabs/PlaneacionTab';
import { EscuelasVisitantesTab } from './tabs/EscuelasVisitantesTab';

const TABS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'materias', label: 'Materias' },
  { id: 'profesores', label: 'Profesores' },
  { id: 'cancelaciones', label: 'Cancelaciones' },
  { id: 'planeacion', label: 'Planeación' },
  { id: 'escuelas', label: 'Escuelas Visitantes' },
];

export const Dashboard = () => {
  const { auth, logout } = useAuth();
  const { data, loading, error } = useFetchData(auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (filterType === 'custom' && customStartDate && customEndDate) {
      return filterDataByDate(
        data,
        new Date(customStartDate),
        new Date(customEndDate)
      );
    }

    const range = getDateRange(filterType);
    if (!range) return data;

    return filterDataByDate(data, range.start, range.end);
  }, [data, filterType, customStartDate, customEndDate]);

  // Calculate KPIs from filtered data
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const projections = useMemo(() => calculateProjections(kpis), [kpis]);

  const handleFilterChange = ({ type, startDate, endDate }) => {
    setFilterType(type);
    if (type === 'custom') {
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    } else {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded border-2 border-accent"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CEAM VR Lab</h1>
                <p className="text-xs text-gray-400">Dashboard Analítico</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">
                  {auth?.role === 'admin' ? '👤 Administrador' : '📋 Coordinación'}
                </p>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Cargando datos...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">Error al cargar datos</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FilterControls
                  onFilterChange={handleFilterChange}
                  defaultFilter={filterType}
                />
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              {/* Tab navigation */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-accent text-white'
                        : 'bg-surface text-gray-300 hover:bg-border'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="animate-fade-in">
                {activeTab === 'overview' && (
                  <OverviewTab data={filteredData} kpis={kpis} projections={projections} />
                )}
                {activeTab === 'materias' && <MateriasTab data={filteredData} />}
                {activeTab === 'profesores' && <ProfesoresTab data={filteredData} />}
                {activeTab === 'cancelaciones' && (
                  <CancelacionesTab data={data} /> // Use full data for cancelations
                )}
                {activeTab === 'planeacion' && (
                  <PlaneacionTab data={filteredData} />
                )}
                {activeTab === 'escuelas' && (
                  <EscuelasVisitantesTab data={filteredData} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 Centro Escolar Anglo Mexicano - Dashboard VR Lab
          </p>
        </div>
      </footer>
    </div>
  );
};
