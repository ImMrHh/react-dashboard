import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { getTipo, uniqueCount, pct, groupBy, getMonthKey, getMonthLabel } from '../utils/helpers';

function MetricCard({ label, value, sub, change }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-sub">{sub}</div>
      {change && <div className="metric-change">{change}</div>}
    </div>
  );
}

export default function MetricsGrid() {
  const { filteredRows } = useContext(DataContext);
  const confirmed = filteredRows.filter(r => r.Status === 'Confirmed');
  const clases = confirmed.filter(r => getTipo(r) === 'Clase');
  const demos = confirmed.filter(r => getTipo(r) === 'Demo');
  const profs = uniqueCount(confirmed, r => r.Profesor || '—');
  const schools = uniqueCount(demos, r => r.Grupo || '—');
  const materias = uniqueCount(clases, r => r.Materia || '—');
  const clasePct = pct(clases.length, confirmed.length);

  const byMonth = groupBy(confirmed, r => getMonthKey(r.Fecha));
  const months = Object.keys(byMonth).sort();
  let growthChange = '';
  if (months.length >= 2) {
    const prev = byMonth[months[months.length - 2]] || 0;
    const curr = byMonth[months[months.length - 1]] || 0;
    const g = prev ? Math.round(((curr - prev) / prev) * 100) : 0;
    const sign = g >= 0 ? '↑' : '↓';
    growthChange = `${sign} ${Math.abs(g)}% ${getMonthLabel(months[months.length - 1])}`;
  }

  return (
    <section className="metrics-grid">
      <MetricCard label="Sesiones Confirmadas" value={confirmed.length} sub="en el período seleccionado" change={growthChange} />
      <MetricCard label="Clases Impartidas" value={clases.length} sub="con participación de alumnos" change={`${clasePct}% del total`} />
      <MetricCard label="Instituciones Visitantes" value={schools} sub="escuelas visitantes" change={`${demos.length} demos`} />
      <MetricCard label="Profesores Participantes" value={profs} sub="activos en el programa" change={`${materias} materias`} />
    </section>
  );
}
