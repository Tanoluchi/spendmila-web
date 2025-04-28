import React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { format, addMonths, endOfMonth } from "date-fns"

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
interface BudgetCreate {
  name: string;
  description?: string;
  amount: number;
  start_date: string;
  end_date: string;
  category_id?: string;
  currency_id: string;
}

// Mock service for now - would be replaced with actual service from SDK
const BudgetService = {
  createBudget: async (data: { requestBody: BudgetCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/budgets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create budget');
      return res.json();
    });
  }
};

interface CreateBudgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateBudget = ({ isOpen: externalIsOpen, onOpenChange }: CreateBudgetProps = {}) => {
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
  
  // Fetch currencies and categories
  const { data: currencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => fetch('/api/v1/currencies').then(res => res.json()),
    enabled: isOpen
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetch('/api/v1/categories').then(res => res.json()),
    enabled: isOpen
  });

  // Get current month start and end dates
  const today = new Date();
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(endOfMonth(today), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BudgetCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      start_date: startDate,
      end_date: endDate,
      currency_id: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: BudgetCreate) =>
      BudgetService.createBudget({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Budget created successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: ApiError) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  const onSubmit: SubmitHandler<BudgetCreate> = (data) => {
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
        <Button variant="solid" colorPalette="teal" className="my-4 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md">
          <Plus size={16} />
          Create Budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to create a new budget.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Budget Name"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "Budget name is required.",
                  })}
                  placeholder="Budget Name"
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
                invalid={!!errors.amount}
                errorText={errors.amount?.message}
                label="Budget Amount"
              >
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: "Amount is required" }}
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
                invalid={!!errors.start_date}
                errorText={errors.start_date?.message}
                label="Start Date"
              >
                <Input
                  id="start_date"
                  {...register("start_date", {
                    required: "Start date is required.",
                  })}
                  type="date"
                />
              </Field>

              <Field
                required
                invalid={!!errors.end_date}
                errorText={errors.end_date?.message}
                label="End Date"
              >
                <Input
                  id="end_date"
                  {...register("end_date", {
                    required: "End date is required.",
                    validate: (value, formValues) => {
                      return new Date(value) >= new Date(formValues.start_date) || 
                        "End date must be after start date";
                    }
                  })}
                  type="date"
                />
              </Field>

              <Field
                invalid={!!errors.category_id}
                errorText={errors.category_id?.message}
                label="Category"
              >
                <Select
                  id="category_id"
                  {...register("category_id")}
                  placeholder="Select category (optional)"
                >
                  {categories?.data?.filter((cat: any) => cat.type === "expense")?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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
              colorPalette="teal"
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

export default CreateBudget;
