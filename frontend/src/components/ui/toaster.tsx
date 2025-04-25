"use client"

import React from 'react';

interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const Toaster: React.FC<ToasterProps> = ({ position = 'top-right' }) => {
  // Esta es una versión simplificada que no hace nada,
  // pero evita errores en el código
  return null;
};

export const toast = {
  success: (message: string) => console.log('Success toast:', message),
  error: (message: string) => console.log('Error toast:', message),
  warning: (message: string) => console.log('Warning toast:', message),
  info: (message: string) => console.log('Info toast:', message),
};
