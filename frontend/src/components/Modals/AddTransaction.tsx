import React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"

import { Button } from "../ui/button-tailwind"
import {
  DialogActionTrigger,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog-tailwind"
import { Field } from "../ui/field-tailwind"
import { Input, Select, Textarea } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"
import { useState } from "react"
import { Plus } from "lucide-react"
import { format } from "date-fns"

import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

// This would be defined in your client/types.gen.ts
interface TransactionCreate {
  description: string;
  amount: number;
  type: string;
  date: string;
  currency_id: string;
  category_id?: string;
  payment_method_id?: string;
  subscription_id?: string;
  financial_goal_id?: string;
  debt_id?: string;
}

// Mock service for now - would be replaced with actual service from SDK
const TransactionService = {
  createTransaction: async (data: { requestBody: TransactionCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create transaction');
      return res.json();
    });
  }
};

interface AddTransactionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddTransaction = ({ isOpen: externalIsOpen, onOpenChange }: AddTransactionProps = {}) => {
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
  const [showInstallments, setShowInstallments] = useState(false);
  
  // Fetch currencies, categories, and payment methods
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

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => fetch('/api/v1/payment-methods').then(res => res.json()),
    enabled: isOpen
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TransactionCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
      date: format(new Date(), 'yyyy-MM-dd'),
      currency_id: "",
    },
  });

  const transactionType = watch("type");

  const mutation = useMutation({
    mutationFn: (data: TransactionCreate) =>
      TransactionService.createTransaction({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Transaction created successfully.");
      reset();
      handleOpenChange(false);
    },
    onError: (err: ApiError) => {
      handleError(err, showErrorToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const onSubmit: SubmitHandler<TransactionCreate> = (data) => {
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
        <Button variant="solid" colorPalette="purple" className="my-4 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          <Plus size={16} />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new transaction.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.description}
                errorText={errors.description?.message}
                label="Description"
              >
                <Input
                  id="description"
                  {...register("description", {
                    required: "Description is required.",
                  })}
                  placeholder="Description"
                  type="text"
                />
              </Field>

              <Field
                required
                invalid={!!errors.amount}
                errorText={errors.amount?.message}
                label="Amount"
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
                invalid={!!errors.type}
                errorText={errors.type?.message}
                label="Type"
              >
                <Select
                  id="type"
                  {...register("type", {
                    required: "Type is required.",
                  })}
                  onChange={(e) => {
                    register("type").onChange(e);
                    setShowInstallments(e.target.value === "expense");
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </Select>
              </Field>

              {showInstallments && (
                <Field label="Installments">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="installments" mb="0">
                      Pay in installments?
                    </FormLabel>
                    <Switch id="installments" />
                  </FormControl>
                </Field>
              )}

              <Field
                required
                invalid={!!errors.date}
                errorText={errors.date?.message}
                label="Date"
              >
                <Input
                  id="date"
                  {...register("date", {
                    required: "Date is required.",
                  })}
                  type="date"
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
                  placeholder="Select currency"
                >
                  {currencies?.data?.map((currency: any) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </Select>
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
                  {categories?.data?.filter((cat: any) => 
                    transactionType === "income" ? cat.type === "income" : cat.type === "expense"
                  )?.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                invalid={!!errors.payment_method_id}
                errorText={errors.payment_method_id?.message}
                label="Payment Method"
              >
                <Select
                  id="payment_method_id"
                  {...register("payment_method_id")}
                  placeholder="Select payment method (optional)"
                >
                  {paymentMethods?.data?.map((method: any) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
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
              colorPalette="purple"
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

export default AddTransaction;
