import * as React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { format } from "date-fns"

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
interface DebtCreate {
  name: string;
  description?: string;
  total_amount: number;
  remaining_amount: number;
  interest_rate?: number;
  due_date: string;
  type: string;
  status: string;
  currency_id: string;
}

// Mock service for now - would be replaced with actual service from SDK
const DebtService = {
  createDebt: async (data: { requestBody: DebtCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/debts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create debt');
      return res.json();
    });
  }
};

interface AddDebtProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddDebt = ({ isOpen: externalIsOpen, onOpenChange }: AddDebtProps = {}) => {
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
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DebtCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      total_amount: 0,
      remaining_amount: 0,
      interest_rate: 0,
      due_date: format(new Date(), 'yyyy-MM-dd'),
      type: "personal",
      status: "pending",
      currency_id: "",
    },
  });

  // Watch total_amount to update remaining_amount
  const totalAmount = watch("total_amount");
  
  // Update remaining_amount when total_amount changes
  React.useEffect(() => {
    setValue("remaining_amount", totalAmount);
  }, [totalAmount, setValue]);

  const mutation = useMutation({
    mutationFn: (data: DebtCreate) =>
      DebtService.createDebt({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Debt created successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: ApiError) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });

  const onSubmit: SubmitHandler<DebtCreate> = (data) => {
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
        <Button variant="solid" colorPalette="red" className="my-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
          <Plus size={16} />
          Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Debt</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new debt.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Debt Name"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "Debt name is required.",
                  })}
                  placeholder="Debt Name"
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
                invalid={!!errors.total_amount}
                errorText={errors.total_amount?.message}
                label="Total Amount"
              >
                <Controller
                  name="total_amount"
                  control={control}
                  rules={{ 
                    required: "Total amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" }
                  }}
                  render={({ field }) => (
                    <NumberInput
                      step={0.01}
                      value={field.value || 0}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </Field>

              <Field
                invalid={!!errors.interest_rate}
                errorText={errors.interest_rate?.message}
                label="Interest Rate (%)"
              >
                <Controller
                  name="interest_rate"
                  control={control}
                  rules={{ min: { value: 0, message: "Interest rate cannot be negative" } }}
                  render={({ field }) => (
                    <NumberInput
                      step={0.01}
                      value={field.value || 0}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </Field>

              <Field
                required
                invalid={!!errors.due_date}
                errorText={errors.due_date?.message}
                label="Due Date"
              >
                <Input
                  id="due_date"
                  {...register("due_date", {
                    required: "Due date is required.",
                  })}
                  type="date"
                />
              </Field>

              <Field
                required
                invalid={!!errors.type}
                errorText={errors.type?.message}
                label="Debt Type"
              >
                <Select
                  id="type"
                  {...register("type", {
                    required: "Debt type is required.",
                  })}
                >
                  <option value="personal">Personal</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="auto">Auto</option>
                  <option value="student">Student</option>
                  <option value="business">Business</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </Select>
              </Field>

              <Field
                required
                invalid={!!errors.status}
                errorText={errors.status?.message}
                label="Status"
              >
                <Select
                  id="status"
                  {...register("status", {
                    required: "Status is required.",
                  })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="paid">Paid</option>
                  <option value="defaulted">Defaulted</option>
                  <option value="renegotiated">Renegotiated</option>
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
              colorPalette="red"
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

export default AddDebt;
