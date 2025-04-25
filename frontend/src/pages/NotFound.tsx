import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-purple">404</h1>
      <p className="mb-8 text-xl text-gray-600">Página no encontrada</p>
      <Link to="/" className="px-6 py-3 text-white rounded-md bg-purple hover:bg-purple-dark">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound; 