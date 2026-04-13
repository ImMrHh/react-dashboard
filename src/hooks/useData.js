import { useState, useEffect } from 'react';

export const useFetchData = (auth) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth?.token) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allRecords = [];
        let nextPage = null;
        
        do {
          const url = nextPage
            ? `https://vr-lab-auth.6z5fznmp4m.workers.dev/data?page=${nextPage}`
            : 'https://vr-lab-auth.6z5fznmp4m.workers.dev/data';

          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }

          const pageData = await response.json();
          
          // Manejar diferentes formatos de respuesta
          let records = [];
          if (Array.isArray(pageData)) {
            records = pageData;
          } else if (pageData.data && Array.isArray(pageData.data)) {
            records = pageData.data;
          } else if (pageData.rows && Array.isArray(pageData.rows)) {
            records = pageData.rows;
          }
          
          allRecords.push(...records);
          nextPage = pageData.nextPage || null;
        } while (nextPage);

        setData(allRecords);
      } catch (err) {
        setError(err.message);
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [auth?.token]);

  return { data, loading, error };
};

// Parse and normalize date to YYYY-MM-DD format
export const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    // Handle various date formats
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

export const getDateRange = (filterType) => {
  const today = new Date();
  const start = new Date();

  switch (filterType) {
    case 'last3months':
      start.setMonth(today.getMonth() - 3);
      break;
    case 'custom':
      return null; // Custom range handled separately
    default:
      return { start: null, end: today }; // Full cycle
  }

  return { start, end: today };
};

export const filterDataByDate = (records, startDate, endDate) => {
  return records.filter((record) => {
    const normalized = normalizeDate(record.Fecha);
    if (!normalized) return false;

    const recordDate = new Date(normalized);
    if (startDate && recordDate < startDate) return false;
    if (endDate && recordDate > endDate) return false;

    return true;
  });
};