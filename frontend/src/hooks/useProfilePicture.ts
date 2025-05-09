// Importaciones comentadas
// import { useState } from "react";
// Comentamos las importaciones que no vamos a usar
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { FileUploadService } from '@/client';
// import { toast } from 'react-hot-toast';

interface UseProfilePictureReturn {
  uploadProfilePicture: (file: File) => void;
  isUploading: boolean;
  error: Error | null;
  previewUrl: string | null;
  fileError: string | null;
  handleFileChange: (file: File | null) => void;
}

/**
 * Custom hook for profile picture upload functionality
 * NOTA: Funcionalidad temporalmente deshabilitada
 */
export const useProfilePicture = (): UseProfilePictureReturn => {
  // Versión simplificada del hook sin funcionalidad real
  // Mantenemos la interfaz para evitar errores en componentes que lo usen
  
  // Comentado temporalmente
  /*
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // File validation and preview generation
  const handleFileChange = (file: File | null) => {
    setFileError(null);
    setPreviewUrl(null);
    
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setFileError('File must be JPG, PNG, or GIF');
      return;
    }
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size must not exceed 2MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload mutation
  const { mutate, isPending, error } = useMutation({
    mutationFn: FileUploadService.uploadProfilePicture,
    onSuccess: (response) => {
      // Log completo de la respuesta para debugging
      console.log('Response data complete:', response);
      
      // Aprovechar inmediatamente la URL absoluta devuelta por el servidor
      if (response?.data?.url) {
        console.log('Using absolute URL from server response:', response.data.url);
        
        // Actualizar la caché de usuario con la nueva URL
        queryClient.setQueryData(['currentUser'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            profile_picture: response.data.url
          };
        });
      }
      
      // De todas formas, invalidar la caché para asegurar la consistencia
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
      // Show success message
      toast.success('Profile picture updated successfully');
      
      // Reset the form state
      setPreviewUrl(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload profile picture: ${error.message}`);
      setFileError(error.message);
    }
  });

  // Wrapper function to upload the profile picture
  const uploadProfilePicture = (file: File) => {
    // Validate the file again just to be safe
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setFileError('File must be JPG, PNG, or GIF');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setFileError('File size must not exceed 2MB');
      return;
    }
    
    // Upload the file
    mutate(file);
  };
  */
  
  // Implementación vacía del hook
  return {
    uploadProfilePicture: () => { console.log('Funcionalidad de imagen de perfil deshabilitada') },
    isUploading: false,
    error: null,
    previewUrl: null,
    fileError: null,
    handleFileChange: () => { console.log('Funcionalidad de imagen de perfil deshabilitada') }
  };
};
