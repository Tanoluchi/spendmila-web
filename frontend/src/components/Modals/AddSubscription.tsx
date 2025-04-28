import React from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { useState } from "react"
import { Plus } from "lucide-react"
import { format } from "date-fns"

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
interface SubscriptionCreate {
  name: string;
  description?: string;
  amount: number;
  frequency: string;
  next_payment_date: string;
  status: string;
  currency_id: string;
  category_id?: string;
  icon?: string;
  color?: string;
}

// Mock service for now - would be replaced with actual service from SDK
const SubscriptionService = {
  createSubscription: async (data: { requestBody: SubscriptionCreate }) => {
    // This would call the actual API endpoint
    return fetch('/api/v1/subscriptions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(data.requestBody)
    }).then(res => {
      if (!res.ok) throw new Error('Failed to create subscription');
      return res.json();
    });
  }
};

const AddSubscription = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast } = useCustomToast();
  
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

  // Default next payment date is today
  const nextPaymentDate = format(new Date(), 'yyyy-MM-dd');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SubscriptionCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      frequency: "monthly",
      next_payment_date: nextPaymentDate,
      status: "active",
      currency_id: "",
      icon: "",
      color: "#6366f1", // Default indigo color
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SubscriptionCreate) =>
      SubscriptionService.createSubscription({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Subscription created successfully.");
      reset();
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      handleError(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  const onSubmit: SubmitHandler<SubscriptionCreate> = (data) => {
    mutation.mutate(data);
  };

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="solid" colorPalette="indigo" className="my-4">
          <Plus size={16} className="mr-2" />
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>Fill in the details to add a new subscription.</Text>
            <div className="space-y-4">
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="Subscription Name"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "Subscription name is required.",
                  })}
                  placeholder="Subscription Name"
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
                invalid={!!errors.frequency}
                errorText={errors.frequency?.message}
                label="Billing Cycle"
              >
                <Select
                  {...register("frequency", {
                    required: "Frequency is required",
                  })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="quarterly">Quarterly</option>
                </Select>
              </Field>

              <Field
                required
                invalid={!!errors.next_payment_date}
                errorText={errors.next_payment_date?.message}
                label="Next Payment Date"
              >
                <Input
                  id="next_payment_date"
                  {...register("next_payment_date", {
                    required: "Next payment date is required.",
                  })}
                  type="date"
                />
              </Field>

              <Field
                required
                invalid={!!errors.status}
                errorText={errors.status?.message}
                label="Status"
              >
                <Select
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="paused">Paused</option>
                </Select>
              </Field>

              <Field
                required
                invalid={!!errors.category_id}
                errorText={errors.category_id?.message}
                label="Category"
              >
                <Select
                  {...register("category_id", {
                    required: "Category is required",
                  })}
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
                  {...register("currency_id", {
                    required: "Currency is required",
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
                invalid={!!errors.icon}
                errorText={errors.icon?.message}
                label="Icon (URL or name)"
              >
                <Input
                  id="icon"
                  {...register("icon")}
                  placeholder="Icon URL or name (optional)"
                  type="text"
                />
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
                  defaultValue="#6366f1"
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
              colorPalette="indigo"
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

export default AddSubscription;
