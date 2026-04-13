import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('vr_token');
    const role = sessionStorage.getItem('vr_role');
    if (token && role) {
      setAuth({ token, role });
    }
    setLoading(false);
  }, []);

  const login = async (pin) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://vr-lab-auth.6z5fznmp4m.workers.dev/auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin }),
        }
      );

      if (!response.ok) {
        throw new Error('PIN inválido');
      }

      const data = await response.json();
      const { token, role } = data;

      sessionStorage.setItem('vr_token', token);
      sessionStorage.setItem('vr_role', role);
      setAuth({ token, role });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('vr_token');
    sessionStorage.removeItem('vr_role');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};