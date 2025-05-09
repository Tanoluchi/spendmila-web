import { useQuery } from '@tanstack/react-query';
import { UsersService } from '@/client';
import { toast } from 'react-hot-toast';
import useAuth from './useAuth';
import { UserWithExtendedFields } from '@/types/settings';

/**
 * Custom hook to fetch and manage user data
 * @returns User data and loading state
 */
export const useUserData = () => {
  // Obtener usuario desde el contexto de autenticación
  const { user } = useAuth();
  const hasUserFromAuth = !!user;

  // Consulta para obtener datos del usuario desde la API
  const { 
    data: apiUserData,
    isLoading,
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => UsersService.readUserMe(),
    enabled: !hasUserFromAuth, // Solo ejecutar si no tenemos usuario en contexto
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  // Usar datos del auth context o de la API
  const userData = (user || apiUserData) as UserWithExtendedFields;
  
  // Manejar errores
  if (error) {
    console.error('Error fetching user data:', error);
    toast.error('Error loading user data. Please try again.');
  }

  /**
   * Genera las iniciales del usuario basadas en nombre y apellido
   */
  const getUserInitials = (): string => {
    if (!userData) return '';
    
    const firstInitial = userData.first_name?.[0]?.toUpperCase() || '';
    const lastInitial = userData.last_name?.[0]?.toUpperCase() || '';
    
    return `${firstInitial}${lastInitial}`;
  };

  /**
   * Extrae el nombre y apellido desde el nombre completo o usa los campos directos
   */
  const getNameParts = () => {
    if (!userData) return { firstName: '', lastName: '' };
    
    let firstName = userData.first_name || '';
    let lastName = userData.last_name || '';
    
    // Si tenemos full_name pero no first_name/last_name, extraer de full_name
    if ((!firstName || !lastName) && userData.full_name) {
      const nameParts = userData.full_name.split(' ');
      firstName = firstName || nameParts[0] || '';
      lastName = lastName || nameParts.slice(1).join(' ') || '';
    }
    
    return { firstName, lastName };
  };

  /**
   * Preparar valores iniciales para formularios basados en datos del usuario
   */
  const getFormDefaultValues = () => {
    if (!userData) return null;
    
    const { firstName, lastName } = getNameParts();
    
    return {
      firstName,
      lastName,
      email: userData.email,
      default_currency_id: userData.default_currency_id,
      profile_picture: userData.profile_picture
    };
  };

  return {
    userData,
    isLoading,
    isError,
    error,
    refetch,
    getUserInitials,
    getNameParts,
    getFormDefaultValues
  };
};
