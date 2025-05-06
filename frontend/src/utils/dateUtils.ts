import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Obtiene un arreglo de los últimos N meses en formato "Mes YYYY"
 * ordenados cronológicamente
 * 
 * @param months Número de meses a retornar
 * @returns Array de strings con formato "Mes YYYY"
 */
export const getLastMonths = (months = 12): string[] => {
  const result = [];
  const today = new Date();

  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    result.push(format(date, 'MMMM yyyy', { locale: es }));
  }

  // Ordenar cronológicamente (enero, febrero, etc.)
  return result.sort((a, b) => {
    const dateA = parseMonthYear(a);
    const dateB = parseMonthYear(b);
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Convierte un string con formato "Mes YYYY" a un objeto Date
 * 
 * @param monthYear String con formato "Mes YYYY"
 * @returns Objeto Date
 */
export const parseMonthYear = (monthYear: string): Date => {
  try {
    return parse(monthYear, 'MMMM yyyy', new Date(), { locale: es });
  } catch (error) {
    console.error('Error parsing month/year:', error);
    return new Date();
  }
};

/**
 * Obtiene los años disponibles a partir de un listado de meses
 * ordenados del más reciente al más antiguo
 * 
 * @param monthsArray Array de strings con formato "Mes YYYY"
 * @returns Array de años únicos ordenados descendentemente
 */
export const getAvailableYears = (monthsArray: string[]): number[] => {
  const years = monthsArray.map(month => {
    const parts = month.split(' ');
    return parseInt(parts[parts.length - 1]);
  });
  
  // Eliminar duplicados y ordenar de manera descendente
  return [...new Set(years)].sort((a, b) => b - a);
};
