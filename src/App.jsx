import React from 'react';
import { useAuth } from './context/AuthContext';
import { Dashboard } from './components/Dashboard';
import { PINScreen } from './components/auth/PINScreen';

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Inicializando...</p>
        </div>
      </div>
    );
  }

  return auth ? <Dashboard /> : <PINScreen />;
}

export default App;
