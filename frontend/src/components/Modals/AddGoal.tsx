import React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { format, addMonths } from "date-fns"

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
interface FinancialGoalCreate {
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  type: string;
  status: string;
  currency_id: string;
}

// Mock service for now - would be replaced with actual service from SDK
const FinancialGoalService = {
  createFinancialGoal: async (data: { requestBody: FinancialGoalCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/financial-goals/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create financial goal');
      return res.json();
    });
  }
};

interface AddGoalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddGoal = ({ isOpen: externalIsOpen, onOpenChange }: AddGoalProps = {}) => {
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

  // Default target date is 6 months from now
  const targetDate = format(addMonths(new Date(), 6), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FinancialGoalCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      target_amount: 0,
      current_amount: 0,
      target_date: targetDate,
      type: "savings",
      status: "in_progress",
      currency_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FinancialGoalCreate) =>
      FinancialGoalService.createFinancialGoal({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Financial goal created successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: ApiError) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-goals"] });
    },
  });

  const onSubmit: SubmitHandler<FinancialGoalCreate> = (data) => {
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
        <Button variant="solid" colorPalette="green" className="my-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          <Plus size={16} />
          Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new savings goal.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Goal Name"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "Goal name is required.",
                  })}
                  placeholder="Goal Name"
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
                invalid={!!errors.target_amount}
                errorText={errors.target_amount?.message}
                label="Target Amount"
              >
                <Controller
                  name="target_amount"
                  control={control}
                  rules={{ required: "Target amount is required" }}
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
                invalid={!!errors.current_amount}
                errorText={errors.current_amount?.message}
                label="Current Amount"
              >
                <Controller
                  name="current_amount"
                  control={control}
                  rules={{ min: { value: 0, message: "Amount cannot be negative" } }}
                  render={({ field }) => (
                    <NumberInput
                      min={0}
                      step={0.01}
                      value={field.value || 0}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
              </Field>

              <Field
                required
                invalid={!!errors.target_date}
                errorText={errors.target_date?.message}
                label="Target Date"
              >
                <Input
                  id="target_date"
                  {...register("target_date", {
                    required: "Target date is required.",
                    validate: (value) => {
                      return new Date(value) > new Date() || 
                        "Target date must be in the future";
                    }
                  })}
                  type="date"
                />
              </Field>

              <Field
                required
                invalid={!!errors.type}
                errorText={errors.type?.message}
                label="Goal Type"
              >
                <Select
                  id="type"
                  {...register("type", {
                    required: "Goal type is required.",
                  })}
                >
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="debt_payment">Debt Payment</option>
                  <option value="emergency_fund">Emergency Fund</option>
                  <option value="retirement">Retirement</option>
                  <option value="education">Education</option>
                  <option value="travel">Travel</option>
                  <option value="home">Home</option>
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
                  <option value="in_progress">In Progress</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
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
              colorPalette="green"
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

export default AddGoal;
