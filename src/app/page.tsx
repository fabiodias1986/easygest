'use client'
import './globals.css';

import { useEffect, useState } from 'react';
import Dashboard from '@/app/components/Dashboard/Dashboard'; // Certifique-se de que o caminho está correto

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<any[]>([]); // Estado para armazenar os dados
  const [showData, setShowData] = useState(false); // Estado para controlar a exibição dos dados

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedTime = localStorage.getItem('authTime');

    if (storedAuth === 'true' && storedTime) {
      const authTime = parseInt(storedTime, 10);
      const currentTime = Date.now();

      // Verifica se a autenticação ainda é válida (1 hora = 3600000 ms)
      if (currentTime - authTime < 3600000) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'easygest2024') {
      setIsAuthenticated(true); // Atualiza o estado para indicar que o usuário está autenticado
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authTime', Date.now().toString()); // Armazena o timestamp da autenticação
    } else {
      setError('Senha incorreta');
    }
  };


  if (isAuthenticated) {
    return (
      <div>
        <Dashboard />

      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}