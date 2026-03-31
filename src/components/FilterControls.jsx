import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function FilterControls() {
  const { setFilteredRows, rows, setFilterMode } = useContext(DataContext);

  function showFull() {
    setFilteredRows(rows);
    setFilterMode('full');
  }

  function showRecent() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const filtered = rows.filter(r => new Date(r.Fecha) >= threeMonthsAgo);
    setFilteredRows(filtered);
    setFilterMode('recent');
  }

  return (
    <section className="filter-controls">
      <button onClick={showFull}>Todo el ciclo</button>
      <button onClick={showRecent}>Reciente</button>
      {/* custom date inputs can be added later */}
    </section>
  );
}
