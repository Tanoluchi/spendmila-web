import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from 'react-hook-form';
import { Currency } from '@/types/currency';
import { SettingsFormData } from '@/types/settings';

interface PersonalInfoSectionProps {
  form: UseFormReturn<SettingsFormData>;
  currencies: Currency[];
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  form,
  currencies
}) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-1" htmlFor="firstName">
          First Name
        </Label>
        <Input
          type="text"
          id="firstName"
          className="w-full px-3 py-2 bg-background border border-input rounded-md"
          {...register('firstName', { required: 'First name is required' })}
        />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-1" htmlFor="lastName">
          Last Name
        </Label>
        <Input
          type="text"
          id="lastName"
          className="w-full px-3 py-2 bg-background border border-input rounded-md"
          {...register('lastName', { required: 'Last name is required' })}
        />
        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
      </div>
      
      <div>
        <Label className="block text-sm font-medium mb-1" htmlFor="email">
          Email Address
        </Label>
        <Input
          type="email"
          id="email"
          className="w-full px-3 py-2 bg-background border border-input rounded-md"
          {...register('email', { 
            required: 'Email is required', 
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address'}
          })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-1" htmlFor="default_currency_id">
          Default Currency
        </Label>
        <Controller
          name="default_currency_id"
          control={control}
          rules={{ required: "Default currency is required" }}
          render={({ field }) => {
            // Asegurarnos de que siempre tenemos un string o undefined, nunca null
            const value = field.value ? String(field.value) : undefined;
            
            return (
              <Select 
                onValueChange={(newValue) => {
                  console.log('Nueva moneda seleccionada:', newValue);
                  field.onChange(newValue);
                }}
                value={value}
              >
                <SelectTrigger id="default_currency_id" className="w-full">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={String(currency.id)}>
                      {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.default_currency_id && <p className="text-red-500 text-xs mt-1">{errors.default_currency_id.message}</p>}
      </div>
    </div>
  );
};
