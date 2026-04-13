import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PINScreen = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(pin);
    if (success) {
      setPin('');
    }
    setLoading(false);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-dark to-dark flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card container */}
        <div className="card border-2 border-accent/20 shadow-2xl shadow-accent/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-accent/10 rounded-full">
                <Lock className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CEAM VR Lab</h1>
            <p className="text-gray-400">Ingresa tu PIN para acceder</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Input */}
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-300 mb-2">
                Código PIN
              </label>
              <input
                id="pin"
                type="text"
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                placeholder="0000"
                maxLength="4"
                className="input text-center text-2xl tracking-widest font-mono"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={pin.length !== 4 || loading}
              className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-gray-500 text-center">
              Dashboard Analítico del Laboratorio VR de CEAM
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
          <p className="text-xs text-gray-400 text-center">
            🔒 Esta sesión es privada y segura. Tu PIN es verificado contra servidores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
};
