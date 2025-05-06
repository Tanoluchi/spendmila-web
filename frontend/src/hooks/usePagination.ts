import { useState, useCallback } from 'react';

interface PaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

/**
 * Hook personalizado para manejar la paginación
 * 
 * @param params Parámetros iniciales de paginación
 * @returns Objeto con propiedades y métodos de paginación
 */
export const usePagination = (params: PaginationParams = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = params;
  
  // Estados para el número de página y elementos por página
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  
  // Cambiar a la página siguiente
  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);
  
  // Cambiar a la página anterior
  const prevPage = useCallback(() => {
    setPage(prev => Math.max(prev - 1, 1));
  }, []);
  
  // Cambiar a una página específica
  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);
  
  // Cambiar el tamaño de la página
  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  }, []);
  
  return {
    page,
    pageSize,
    setPage: goToPage,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
  };
};

export default usePagination;
