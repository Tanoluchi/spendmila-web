import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService, UserPublic, UserUpdateMe } from '@/client';
import { toast } from 'react-hot-toast';
import { SettingsFormData, UserUpdatePayload, UserWithExtendedFields } from '@/types/settings';

interface UseSettingsReturn {
  updateUserMutation: {
    mutate: (data: SettingsFormData) => void;
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
  deleteUserMutation: {
    mutate: () => void;
    isPending: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
}

/**
 * Hook para manejar las operaciones de configuración del usuario
 * Provee mutaciones para actualizar y eliminar usuario
 */
export const useSettings = (
  onUpdateSuccess?: (userData: UserWithExtendedFields) => void,
  onDeleteSuccess?: () => void
): UseSettingsReturn => {
  const queryClient = useQueryClient();

  // Mutación para actualizar perfil de usuario
  const {
    mutate: updateUser,
    isPending: isUpdatePending,
    isSuccess: isUpdateSuccess,
    error: updateError
  } = useMutation<UserPublic, Error, UserUpdateMe>({
    mutationFn: (updateData: UserUpdateMe) => 
      UsersService.updateUserMe({ requestBody: updateData }),
    onSuccess: (updatedUserData) => {
      console.log('Respuesta del backend tras actualizar usuario:', updatedUserData);
      
      // Formatear default_currency_id de manera consistente
      // Si existe un valor, lo convertimos a string, si no, es null
      const processedUserData = {
        ...updatedUserData,
        default_currency_id: updatedUserData.default_currency_id !== undefined && 
          updatedUserData.default_currency_id !== null ? 
          String(updatedUserData.default_currency_id) : 
          null
      };
      
      // Actualizar cache con los datos procesados
      queryClient.setQueryData(['currentUser'], processedUserData);
      
      // Mostrar mensaje de éxito
      toast.success('Perfil actualizado exitosamente');
      
      // Convertir a tipo extendido
      const extendedUser = processedUserData as UserWithExtendedFields;
      console.log('Datos extendidos que se pasan al callback:', extendedUser);
      
      // Llamar callback si existe
      if (onUpdateSuccess) {
        onUpdateSuccess(extendedUser);
      }
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar perfil: ${error.message || 'Error desconocido'}`);
    },
  });

  // Mutación para eliminar cuenta de usuario
  const {
    mutate: deleteUser,
    isPending: isDeletePending,
    isSuccess: isDeleteSuccess,
    error: deleteError
  } = useMutation({
    mutationFn: () => UsersService.deleteUserMe(),
    onSuccess: () => {
      toast.success('Cuenta eliminada exitosamente');
      console.log('Cuenta eliminada correctamente, ejecutando callback para cerrar sesión');
      
      // Invalidar todas las consultas para limpiar el caché
      queryClient.invalidateQueries();
      
      // Limpiar datos de usuario en localStorage si es necesario
      localStorage.removeItem('authToken');
      
      // Llamar al callback de logout inmediatamente
      if (onDeleteSuccess) {
        // Pequeño retraso para asegurar que el toast se muestre antes de redireccionar
        setTimeout(() => {
          onDeleteSuccess();
        }, 500);
      }
    },
    onError: (error: Error) => {
      console.error('Error al eliminar cuenta:', error);
      toast.error(`Error al eliminar cuenta: ${error.message || 'Error desconocido'}`);
    },
  });

  // Función para preparar y enviar datos del formulario
  const updateUserData = (data: SettingsFormData) => {
    console.log('Datos del formulario recibidos para actualizar:', data);
    
    // IMPORTANTE: Para default_currency_id, preservamos exactamente el valor seleccionado
    // sin transformaciones adicionales que pudieran causar problemas
    let currencyId = data.default_currency_id;
    
    // Solo si tenemos un valor válido, lo convertimos a string (formato esperado por API)
    if (data.default_currency_id !== undefined && data.default_currency_id !== null && data.default_currency_id !== '') {
      currencyId = String(data.default_currency_id);
    } else {
      // Si no hay valor, explícitamente lo dejamos como null para API
      currencyId = null;
    }
    
    console.log('ID de moneda a enviar al backend:', currencyId);
    
    // Crear payload correctamente tipado
    const payload: UserUpdatePayload = {
      email: data.email || undefined,
      first_name: data.firstName || undefined,
      last_name: data.lastName || undefined,
      // Usamos el valor procesado - crítico para mantener coherencia
      default_currency_id: currencyId,
    };
    
    // Log para debug
    console.log('Enviando payload al backend:', payload);
    
    // Establecer full_name basado en nombre y apellido
    if (!data.firstName && !data.lastName) {
      payload.full_name = null;
    } else {
      payload.full_name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    }

    updateUser(payload as UserUpdateMe);
  };

  return {
    updateUserMutation: {
      mutate: updateUserData,
      isPending: isUpdatePending,
      isSuccess: isUpdateSuccess,
      error: updateError
    },
    deleteUserMutation: {
      mutate: deleteUser,
      isPending: isDeletePending,
      isSuccess: isDeleteSuccess,
      error: deleteError
    }
  };
};
