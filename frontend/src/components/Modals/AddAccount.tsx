import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"

import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  DialogActionTrigger,
  DialogTitle
} from "../ui/dialog-tailwind"
import { Field } from "../ui/field-tailwind"

// This would be defined in your client/types.gen.ts
interface AccountCreate {
  name: string;
  description?: string;
  balance: number;
  type: string;
  currency_id: string;
  is_active: boolean;
}

// Mock service for now - would be replaced with actual service from SDK
const AccountService = {
  createAccount: async (data: { requestBody: AccountCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/accounts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create account');
      return res.json();
    });
  }
};

interface AddAccountProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddAccount = ({ isOpen: externalIsOpen, onOpenChange }: AddAccountProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  
  // Fetch currencies
  const { data: currencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => fetch('/api/v1/currencies').then(res => res.json()),
    enabled: isOpen
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AccountCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      balance: 0,
      type: "checking",
      is_active: true,
      currency_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AccountCreate) =>
      AccountService.createAccount({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Account created successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: ApiError) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const onSubmit: SubmitHandler<AccountCreate> = (data) => {
    mutation.mutate(data);
  };

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => handleOpenChange(open)}
    >
      <DialogTrigger asChild>
        <Button variant="solid" colorPalette="blue" className="my-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          <Plus size={16} />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
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
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="Description"
              >
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Description (optional)"
                  type="text"
                />
              </Field>

              <Field
                required
                invalid={!!errors.balance}
                errorText={errors.balance?.message}
                label="Initial Balance"
              >
                <Controller
                  name="balance"
                  control={control}
                  rules={{ required: "Initial balance is required" }}
                  render={({ field }) => (
                    <NumberInput
                      step={0.01}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </Field>

              <Field
                required
                invalid={!!errors.type}
                errorText={errors.type?.message}
                label="Account Type"
              >
                <Select
                  id="type"
                  {...register("type", {
                    required: "Account type is required.",
                  })}
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                  <option value="investment">Investment</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
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
                >
                  {currencies?.data?.map((currency: any) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="blue"
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default AddAccount;
