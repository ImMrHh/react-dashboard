// small helper utilities used across components

export function getTipo(row) {
  const a = (row.Actividad || '').toLowerCase();
  if (a.includes('demo')) return 'Demo';
  if (a.includes('clase') || a.includes('clases')) return 'Clase';
  return 'Otro';
}

export function uniqueCount(rows, keyFn) {
  const s = new Set(rows.map(keyFn));
  return s.size;
}

export function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function groupBy(rows, keyFn) {
  return rows.reduce((acc, r) => {
    const k = keyFn(r);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

export function getMonthKey(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function getMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-');
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${monthNames[Number(m) - 1]} ${y}`;
}
