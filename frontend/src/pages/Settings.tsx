import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

// Import hooks
import { useCurrencies } from '@/hooks/useCurrencies';
import { useSettings } from '@/hooks/useSettings';
import { useUserData } from '@/hooks/useUserData';

// Import types
import { SettingsFormData, UserWithExtendedFields } from '@/types/settings';

// Import components
import {
  PersonalInfoSection,
  SettingsSidebar,
  DeleteAccountDialog
} from '@/components/Settings';

function Settings() {
  const { logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Use custom hooks para datos del usuario y monedas
  const { currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { 
    userData: currentUser, 
    isLoading: isLoadingUser,
    getFormDefaultValues,
    // getUserInitials 
  } = useUserData();
  
  // Create the form instance
  const formMethods = useForm<SettingsFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      default_currency_id: null,
      profile_picture: undefined,
    },
    // Modo importante: este modo permite que los valores del formulario persistan
    // mientras no se confirmen con el botón Save Changes
    mode: 'onChange'
  });
  
  const { reset, handleSubmit, formState: { isDirty, isSubmitting } } = formMethods;
  
  // Set form values when user data is available - SOLO cuando el usuario cambia o las monedas se cargan inicialmente
  useEffect(() => {
    if (currentUser && !formMethods.formState.isDirty) {
      const defaultValues = getFormDefaultValues();
      if (defaultValues) {
        // Asegurar que default_currency_id sea un string o null
        const currencyId = defaultValues.default_currency_id !== undefined && 
          defaultValues.default_currency_id !== null ? 
          String(defaultValues.default_currency_id) : 
          (currencies.length > 0 ? String(currencies[0].id) : null);

        
        // Solo reset si el formulario no ha sido modificado por el usuario
        reset({
          ...defaultValues,
          default_currency_id: currencyId,
        }, { keepValues: false, keepDirtyValues: true }); // Mantener valores sucios para preservar selecciones del usuario
      }
    }
  }, [currentUser, currencies, getFormDefaultValues, reset, formMethods.formState.isDirty]);


  
  // Callback para manejar el éxito en la actualización del perfil
  const handleUpdateSuccess = (updatedUserData: UserWithExtendedFields) => {
    console.log('Datos del usuario actualizados recibidos:', updatedUserData);
    
    // Extract first and last name from full name if needed
    let firstName = '';
    let lastName = '';
    if (updatedUserData.full_name) {
      const nameParts = updatedUserData.full_name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Asegurar que default_currency_id sea un string (o null)
    // IMPORTANTE: Usamos exactamente el valor que viene del backend
    // sin compararlo con el valor actual del formulario
    const currencyId = updatedUserData.default_currency_id !== undefined && updatedUserData.default_currency_id !== null
      ? String(updatedUserData.default_currency_id) 
      : null;
      
    console.log('Valor de moneda procesado para el formulario:', currencyId);

    // Reset form with updated values from backend
    reset({
      firstName: updatedUserData.first_name || firstName,
      lastName: updatedUserData.last_name || lastName,
      email: updatedUserData.email,
      // Usamos directamente el valor del backend
      default_currency_id: currencyId,
      profile_picture: updatedUserData.profile_picture,
    }, { keepDirty: false });
  };

  // Usar hooks personalizados para mutaciones
  const { updateUserMutation, deleteUserMutation } = useSettings(
    handleUpdateSuccess,
    logout
  );

  // Handle form submission
  const onSubmit = (data: SettingsFormData) => {
    updateUserMutation.mutate(data);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    deleteUserMutation.mutate();
  };

  // Show loading states
  if (isLoadingUser || !currentUser) {
    return <p className='dark:text-gray-200'>Loading user data...</p>;
  }
  
  if (isLoadingCurrencies) {
    return <p className='dark:text-gray-200'>Loading currencies...</p>;
  }

  // // Get user initials for avatar
  // const userInitials = getUserInitials();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button 
          type="submit" 
          disabled={!isDirty || isSubmitting || updateUserMutation.isPending}
          className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          {isSubmitting || updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Sidebar */}
        <div className="col-span-1">
          <SettingsSidebar 
            onDeleteAccount={() => setIsDeleteDialogOpen(true)}
            onLogout={logout}
            isDeleteDisabled={deleteUserMutation.isPending}
          />
        </div>
        
        {/* Main Content */}
        <div className="col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            
            {/* Personal Information Form */}
            <PersonalInfoSection form={formMethods} currencies={currencies} />
            
            {/* Profile Picture Section */}
            {/* <ProfilePictureSection 
              currentPicture={currentUser?.profile_picture} 
              userInitials={userInitials}
            /> */}

            {/* Delete Account Button */}
            <div className="mt-4">
              <button 
                type="button" 
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 text-red-600 dark:text-red-400"
                onClick={() => setIsDeleteDialogOpen(true)} 
                disabled={deleteUserMutation.isPending}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteAccount}
        isDeleting={deleteUserMutation.isPending}
      />
    </form>
  );
}

export default Settings;
