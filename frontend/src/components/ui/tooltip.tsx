import React from 'react';

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  // Este es un componente de placeholder que simplemente renderiza sus hijos
  return <>{children}</>;
};

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
