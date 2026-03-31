import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterMode, setFilterMode] = useState('full');
  const AUTH_URL = import.meta.env.VITE_AUTH_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const token = sessionStorage.getItem('vr-impact-token') || '';
        const res = await axios.get(`${AUTH_URL}/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataRows = res.data?.rows || [];
        setRows(dataRows);
        setFilteredRows(dataRows);
      } catch (err) {
        console.error('Error fetching data from Worker', err);
      }
    }
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ rows, filteredRows, setFilteredRows, filterMode, setFilterMode }}>
      {children}
    </DataContext.Provider>
  );
}
