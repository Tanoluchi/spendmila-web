import React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { format, addMonths, endOfMonth } from "date-fns"

import type { ApiError } from "@/client/core/ApiError"
import { toast } from "sonner";
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
import { Budget, BudgetCategory } from "@/types/budget"

// This would be defined in your client/types.gen.ts
interface BudgetUpdate {
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
  updateBudget: async (id: string, data: { requestBody: BudgetUpdate }) => {
    // This would call the actual API endpoint
    return fetch(`/api/v1/budgets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to update budget');
      return res.json();
    });
  }
};

interface EditBudgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  budget?: Budget;
  category?: BudgetCategory;
}

const EditBudget = ({ isOpen: externalIsOpen, onOpenChange, budget, category }: EditBudgetProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };

  const queryClient = useQueryClient();
  // Funciones simplificadas para mostrar toast
  const showSuccessToast = (message: string) => toast.success(message);
  const showErrorToast = (message: string) => toast.error(message);
  
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
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BudgetUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: budget?.name || "",
      description: "",
      amount: category?.amount || 0,
      start_date: startDate,
      end_date: endDate,
      currency_id: budget?.currency_id || "",
    },
  });

  // Update form values when budget or category changes
  useEffect(() => {
    if (budget) {
      setValue("name", budget.name);
      setValue("currency_id", budget.currency_id);
    }
    if (category) {
      setValue("amount", category.amount);
    }
  }, [budget, category, setValue]);

  const mutation = useMutation({
    mutationFn: (data: BudgetUpdate) =>
      BudgetService.updateBudget(budget?.id || "", { requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Budget updated successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: any) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  const onSubmit: SubmitHandler<BudgetUpdate> = (data) => {
    mutation.mutate(data);
  };

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
            <DialogTitle>Edit Budget {category?.name ? `- ${category.name}` : ""}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Update the details for this budget category.</Text>
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
                invalid={!!errors.currency_id}
                errorText={errors.currency_id?.message}
                label="Currency"
              >
                <Select
                  id="currency_id"
                  {...register("currency_id", {
                    required: "Currency is required.",
                  })}
                >
                  <option value="">Select Currency</option>
                  {currencies?.map((currency: any) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditBudget;
