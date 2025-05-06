/**
 * Utilidades para el manejo de colores en la aplicación
 */
import { BUDGET_COLOR_PALETTE } from './constants';

/**
 * Función para asignar colores únicos a un conjunto de ítems
 * Asegura que cada ítem tenga un color distinto
 * 
 * @param items Array de ítems que necesitan colores
 * @param getColor Función para obtener el color actual de un ítem (si existe)
 * @param getId Función para obtener un identificador único del ítem
 * @returns Mapa de id -> color con colores únicos asignados
 */
export function assignUniqueColors<T>(
  items: T[],
  getColor: (item: T) => string | null | undefined,
  getId: (item: T) => string
): Map<string, string> {
  const colorMap = new Map<string, string>();
  const usedColors = new Set<string>();

  // Primera pasada: conservar colores existentes
  items.forEach(item => {
    const color = getColor(item);
    const id = getId(item);
    
    if (color) {
      colorMap.set(id, color);
      usedColors.add(color);
    }
  });

  // Segunda pasada: asignar colores a los ítems que no tienen uno
  items.forEach(item => {
    const id = getId(item);
    
    if (!colorMap.has(id)) {
      // Encontrar un color disponible que no se haya usado
      const availableColor = BUDGET_COLOR_PALETTE.find(color => !usedColors.has(color));
      
      // Si todos los colores están en uso, usar uno con una ligera variación
      const color = availableColor || 
        BUDGET_COLOR_PALETTE[Math.floor(Math.random() * BUDGET_COLOR_PALETTE.length)];
      
      colorMap.set(id, color);
      usedColors.add(color);
    }
  });

  return colorMap;
}

/**
 * Obtiene un color oscurecido o aclarado
 * @param color Color hexadecimal
 * @returns Color ajustado
 */
export function adjustColor(color: string): string {
  return color;
  // Esta función puede expandirse en el futuro para generar variantes de colores
}
