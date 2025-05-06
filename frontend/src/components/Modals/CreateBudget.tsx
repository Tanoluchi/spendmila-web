import React from "react"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "../ui/button-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { format, endOfMonth } from "date-fns"

import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { BudgetService, type CreateBudgetRequest } from "@/client/services/BudgetService"
import { useBudgets } from "@/hooks/useBudgets"
import { useUserData } from "@/hooks/useUserData"
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

// Form interface that includes all fields needed for budget creation
interface BudgetFormData extends CreateBudgetRequest {
  description?: string;
  timeframe: string;
}

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
  
  // Get user data for currency info
  const { userData, isLoading: isLoadingUser } = useUserData();
  
  // Use the budget hook for mutations
  const { createBudget, isLoading: isLoadingBudgets } = useBudgets();
  
  // Fetch budget categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["budget-categories"],
    queryFn: () => BudgetService.getBudgetCategories(),
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
  } = useForm<BudgetFormData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      category: "",
      color: "#6366F1", // Default indigo color
      timeframe: "monthly",
      currency_id: userData?.default_currency_id || "",
    },
  });

  const onSubmit: SubmitHandler<BudgetFormData> = (data) => {
    // Transform the form data to match the API's expected format
    const budgetData: CreateBudgetRequest = {
      name: data.name,
      amount: data.amount,
      category: data.category,
      color: data.color,
      timeframe: data.timeframe,
      currency_id: data.currency_id || userData?.default_currency_id || "",
    };
    
    try {
      createBudget(budgetData);
      showSuccessToast("Budget created successfully.");
      reset();
      handleOpenChange(false);
    } catch (err: any) {
      handleError(err, showErrorToast);
    }
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
                invalid={!!errors.timeframe}
                errorText={errors.timeframe?.message}
                label="Time Period"
              >
                <Select
                  id="timeframe"
                  {...register("timeframe", {
                    required: "Time period is required.",
                  })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </Select>
              </Field>

              <Field
                invalid={!!errors.category}
                errorText={errors.category?.message}
                label="Category"
              >
                <Select
                  id="category"
                  {...register("category")}
                  placeholder="Select category (optional)"
                >
                  {!isLoadingCategories && categories?.map((category: { name: string; value: string }) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
              
              <Field
                invalid={!!errors.color}
                errorText={errors.color?.message}
                label="Color"
              >
                <Input
                  id="color"
                  {...register("color")}
                  type="color"
                  defaultValue="#6366F1"
                />
              </Field>

              <Field
                required
                invalid={!!errors.currency_id}
                errorText={errors.currency_id?.message}
                label="Currency"
              >
                <Input
                  id="currency_id"
                  {...register("currency_id", {
                    required: "Currency is required.",
                  })}
                  type="hidden"
                  value={userData?.default_currency_id || ""}
                />
                <Input
                  type="text"
                  value={userData?.default_currency?.code || "USD"}
                  disabled
                />
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
              disabled={!isValid || isSubmitting || isLoadingBudgets}
              loading={isSubmitting || isLoadingBudgets}
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
