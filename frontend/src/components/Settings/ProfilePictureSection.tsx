import React from 'react';
// Comentamos todas las importaciones relacionadas con la funcionalidad de imagen de perfil
// import { useRef, ChangeEvent } from 'react';
// import { AlertCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useProfilePicture } from '@/hooks/useProfilePicture';

interface ProfilePictureSectionProps {
  // Mantenemos las props pero no las usaremos
  currentPicture?: string | null;
  userInitials: string;
}

export const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  // Desestructuramos pero no usamos currentPicture para satisfacer el tipo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentPicture,
  userInitials
}) => {
  // Todo el código relacionado con la imagen de perfil está comentado temporalmente
  /*
  // Función para normalizar la URL de la imagen
  const normalizeImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    
    // Si la URL ya es absoluta (comienza con http:// o https://), la usamos como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Si es una ruta relativa, la convertimos en absoluta usando el backend
    if (url.startsWith('/')) {
      // IMPORTANTE: Usar la URL del backend, no la del frontend
      // En desarrollo, el backend suele estar en el puerto 8000
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      console.log('URL del backend utilizada:', backendUrl);
      return `${backendUrl}${url}`;
    }
    
    // Si no es ninguna de las anteriores, asumimos que es una ruta relativa sin / inicial
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${backendUrl}/${url}`;
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    handleFileChange,
    previewUrl,
    fileError,
    uploadProfilePicture,
    isUploading
  } = useProfilePicture();

  // Handle file input change
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Submit the upload
  const handleUpload = () => {
    if (fileInputRef.current?.files?.[0]) {
      uploadProfilePicture(fileInputRef.current.files[0]);
    }
  };
  */

  return (
    <div className="pt-4 border-t">
      <h4 className="text-lg font-medium mb-2">Profile Picture</h4>
      <div className="flex items-center gap-4">
        {/* Comentado temporalmente - Funcionalidad de imágenes de perfil deshabilitada */}
        <div className="w-16 h-16 rounded-full bg-purple flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {userInitials}
          </span>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">
            La funcionalidad de imagen de perfil está temporalmente deshabilitada.
          </p>
        </div>
      </div>
    </div>
  );
};
