import { useForm, type SubmitHandler } from "react-hook-form"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { Text } from "../ui/text-tailwind"

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from "../ui/dialog-tailwind"
import { Field } from "../ui/field-tailwind"
import { useAccounts } from "@/hooks/useAccounts"
import { useCurrencies } from "@/hooks/useCurrencies"
import { useAccountTypes } from "@/hooks/useAccountTypes"
import type { CreateAccountRequest } from "@/client/services/AccountService"

interface AddAccountProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  accountId?: string | null;
}

const AddAccount = ({ isOpen: externalIsOpen, onOpenChange, accountId }: AddAccountProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };
  
  const { createAccount, updateAccount, accounts = [] } = useAccounts();
  const { currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { accountTypes, isLoading: isLoadingAccountTypes } = useAccountTypes();
  
  // Buscar la cuenta seleccionada si estamos en modo edición
  const selectedAccount = accountId ? accounts.find(account => account.id === accountId) : undefined;

  const {
    register,
    handleSubmit,

    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateAccountRequest>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: selectedAccount?.name || "",
      institution: selectedAccount?.institution || "",
      balance: selectedAccount?.balance || 0,
      account_type: selectedAccount?.account_type || "checking",
      is_default: selectedAccount?.is_default || false,
      currency_id: selectedAccount?.currency_id || "",
    },
  });

  const onSubmit: SubmitHandler<CreateAccountRequest> = (data) => {
    if (accountId && selectedAccount) {
      updateAccount({ id: accountId, data });
    } else {
      createAccount(data);
    }
    reset();
    handleOpenChange(false);
  };

  // Cargar los datos de la cuenta cuando se cambia el accountId
  useEffect(() => {
    if (selectedAccount) {
      reset({
        name: selectedAccount.name,
        institution: selectedAccount.institution || "",
        balance: selectedAccount.balance,
        account_type: selectedAccount.account_type,
        is_default: selectedAccount.is_default,
        currency_id: selectedAccount.currency_id,
      });
    }
  }, [selectedAccount, reset]);

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => handleOpenChange(open)}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{accountId ? 'Edit Account' : 'Add Account'}</DialogTitle>
              <button 
                type="button" 
                onClick={() => handleOpenChange(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new account.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Account Name"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "Account name is required.",
                  })}
                  placeholder="Account Name"
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.institution}
                errorText={errors.institution?.message}
                label="Institution"
              >
                <Input
                  id="institution"
                  {...register("institution")}
                  placeholder="Bank or Institution (optional)"
                  type="text"
                />
              </Field>

              {/* El balance ahora se calcula automáticamente basado en las transacciones */}

              <Field
                required
                invalid={!!errors.account_type}
                errorText={errors.account_type?.message}
                label="Account Type"
              >
                <Select
                  id="account_type"
                  {...register("account_type", {
                    required: "Account type is required.",
                  })}
                  disabled={isLoadingAccountTypes}
                >
                  {isLoadingAccountTypes ? (
                    <option value="">Cargando tipos de cuenta...</option>
                  ) : accountTypes.length === 0 ? (
                    <>
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                      <option value="credit">Credit Card</option>
                      <option value="investment">Investment</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </>
                  ) : (
                    accountTypes.map((type: { name: string; value: string }) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))
                  )}
                </Select>
              </Field>

              <Field
                required
                invalid={!!errors.currency_id}
                errorText={errors.currency_id?.message}
                label="Currency"
              >
                <Select
                  id="currency_id"
                  {...register("currency_id", {
                    required: "Currency is required.",
                  })}
                  placeholder="Select currency"
                  disabled={isLoadingCurrencies}
                >
                  {isLoadingCurrencies ? (
                    <option value="">Loading currencies...</option>
                  ) : currencies.length === 0 ? (
                    <option value="">No currencies available</option>
                  ) : (
                    currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code} - {currency.name}
                      </option>
                    ))
                  )}
                </Select>
              </Field>
            </div>
          </DialogBody>

          <DialogFooter gap={2}>
            <Button
              variant="subtle"
              colorPalette="gray"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddAccount;
