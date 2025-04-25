import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Estado para almacenar el tema actual
  const [theme, setTheme] = useState<Theme>(() => {
    // Recuperar el tema del localStorage si existe
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // Comprobar la preferencia del sistema si no hay tema guardado
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return savedTheme;
  });

  // Efecto para aplicar el tema al documento HTML
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Añadir o quitar la clase 'dark' según el tema
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
} 