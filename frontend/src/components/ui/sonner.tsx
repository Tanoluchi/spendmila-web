import React from 'react';

interface ToasterProps {
  position?: string;
  theme?: string;
  className?: string;
}

const Toaster: React.FC<ToasterProps> = () => {
  // Componente de placeholder que no hace nada
  return null;
};

const toast = {
  success: (message: string) => console.log('Success toast:', message),
  error: (message: string) => console.log('Error toast:', message),
  warning: (message: string) => console.log('Warning toast:', message),
  info: (message: string) => console.log('Info toast:', message),
};

export { Toaster, toast };
