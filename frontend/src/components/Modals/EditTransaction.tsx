import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { format } from "date-fns"

import { Button } from "../ui/button-tailwind"
import {
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "../ui/dialog-tailwind"
import { Field } from "../ui/field-tailwind"
import { Input, Select } from "../ui/input-tailwind"
import { NumberInput } from "../ui/number-input-tailwind"
import { Text } from "../ui/text-tailwind"

import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { useCurrencies } from "@/hooks/useCurrencies"
import { useCategories } from "@/hooks/useCategories"
import { useAccounts } from "@/hooks/useAccounts"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { useDebts } from "@/hooks/useDebts"
import { useGoals } from "@/hooks/useGoals"
import { usePaymentMethods } from "@/hooks/usePaymentMethods"
import { Category } from "@/client/services/TransactionService"
import { TransactionService } from "@/client/services/TransactionService"
import useAuth from "@/hooks/useAuth"
import { TransactionCreate, Transaction } from "@/types/transaction"

interface EditTransactionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

// Transaction type is now imported from '@/types/transaction'

const EditTransaction = ({ isOpen, onOpenChange, transaction }: EditTransactionProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { user } = useAuth();
  
  // Use existing hooks to fetch data
  const { currencies } = useCurrencies();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { debts, isLoading: debtsLoading } = useDebts();
  const { goals: financialGoals, isLoading: goalsLoading } = useGoals();
  const { paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods();
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TransactionCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      description: "",
      amount: 0,
      transaction_type: "expense",
      date: format(new Date(), 'yyyy-MM-dd'),
      currency_id: "",
      category_id: "",
      payment_method_id: "",
    },
  });

  // Set form values when transaction changes or modal opens
  useEffect(() => {
    if (isOpen && transaction) {
      // Extract payment method ID from the relationship if available
      const paymentMethodId = transaction.payment_method?.id || "";
      
      reset({
        description: transaction.description || "",
        amount: transaction.amount || 0,
        transaction_type: transaction.transaction_type || "expense",
        date: transaction.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        currency_id: transaction.currency?.id || user?.default_currency_id || "",
        category_id: transaction.category?.id || "",
        account_id: transaction.account?.id || "",
        payment_method_id: paymentMethodId,
        subscription_id: transaction.subscription?.id || "",
        financial_goal_id: transaction.financial_goal?.id || "",
        debt_id: transaction.debt?.id || "",
        notes: transaction.notes || "",
      });
      
      // Show advanced options if any of these fields are populated
      if (transaction.subscription || transaction.financial_goal || transaction.debt) {
        setShowAdvancedOptions(true);
      }
    }
  }, [isOpen, transaction, reset, user]);

  const transactionType = watch("transaction_type");
  const selectedAccountId = watch("account_id");

  // Update currency when account changes
  useEffect(() => {
    if (selectedAccountId && accounts.length > 0) {
      const selectedAccount = accounts.find(account => account.id === selectedAccountId);
      if (selectedAccount && selectedAccount.currency_id) {
        setValue("currency_id", selectedAccount.currency_id);
      }
    } else if (user?.default_currency_id && !selectedAccountId) {
      // Reset to default currency when no account is selected
      setValue("currency_id", user.default_currency_id);
    }
  }, [selectedAccountId, accounts, setValue, user]);

  // Update categories when transaction type changes
  useEffect(() => {
    if (categories.length > 0) {
      const filteredCats = categories.filter(c => 
        (transactionType === "income" && c.category_type === "income") || 
        (transactionType === "expense" && c.category_type === "expense")
      );
      
      if (filteredCats.length > 0) {
        // Check if current category is valid for this transaction type
        const currentCategoryId = watch("category_id");
        const currentCategoryIsValid = filteredCats.some(c => c.id === currentCategoryId);
        
        if (!currentCategoryIsValid) {
          setValue("category_id", filteredCats[0].id);
        }
      }
    }
  }, [transactionType, categories, setValue, watch]);

  const mutation = useMutation({
    mutationFn: (data: TransactionCreate) => {
      if (!transaction) return Promise.reject("No transaction to update");
      
      // Ensure all optional fields that are empty strings are set to undefined
      // This prevents the backend from trying to parse empty strings as UUIDs
      // Also ensure description is never undefined to satisfy the API requirements
      const cleanedData = {
        ...data,
        description: data.description || "", // Ensure description is never undefined
        subscription_id: data.subscription_id || undefined,
        financial_goal_id: data.financial_goal_id || undefined,
        debt_id: data.debt_id || undefined,
        account_id: data.account_id || undefined,
      };
      
      return TransactionService.updateTransaction(transaction.id, cleanedData);
    },
    onSuccess: () => {
      showSuccessToast("Transaction updated successfully.");
      reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err: ApiError) => {
      console.error("Transaction update error:", err);
      handleError(err, showErrorToast);
    },
  });

  const onSubmit: SubmitHandler<TransactionCreate> = (data) => {
    // No need for finalData since we're already ensuring description is set in the mutation
    mutation.mutate(data);
  };

  // Get the current currency name for display
  const getCurrentCurrencyName = () => {
    const currencyId = watch("currency_id");
    if (!currencyId) return "Loading...";
    
    // Check if it's from an account
    if (selectedAccountId) {
      const selectedAccount = accounts.find(account => account.id === selectedAccountId);
      // For TypeScript, make sure we safely access the properties
      if (selectedAccount && selectedAccount.currency && selectedAccount.currency.code) {
        return `${selectedAccount.currency.code} (${selectedAccount.name})`;
      }
    }
    
    // Otherwise use the default currency
    const currency = currencies.find(c => c.id === currencyId);
    if (currency) {
      return `${currency.code} (Default)`;
    }
    
    return "Loading...";
  };

  // Get associated debt information if present
  const getLinkedDebtInfo = () => {
    const debtId = watch("debt_id");
    if (!debtId) return null;
    
    const linkedDebt = debts.find(debt => debt.id === debtId);
    if (!linkedDebt) return null;
    
    return {
      name: linkedDebt.creditor_name || 'Unknown',
      // Ensure numeric values have defaults to prevent undefined errors
      remaining: typeof linkedDebt.remaining_amount === 'number' ? linkedDebt.remaining_amount : linkedDebt.amount || 0,
      progress: typeof linkedDebt.payment_progress === 'number' ? linkedDebt.payment_progress : 0
    };
  };
  
  const linkedDebtInfo = getLinkedDebtInfo();

  // Filter categories based on transaction type and remove duplicates
  const filteredCategories = categories.reduce((acc: Category[], category: Category) => {
    // Only include categories that match the transaction type
    if ((transactionType === "income" && category.category_type === "income") || 
        (transactionType === "expense" && category.category_type === "expense")) {
      // Check if this category ID is already in our accumulator
      if (!acc.some(c => c.id === category.id)) {
        acc.push(category);
      }
    }
    return acc;
  }, []);

  // Check if we have any optional items to show
  const hasOptionalItems = 
    (financialGoals && financialGoals.length > 0) || 
    (subscriptions && subscriptions.length > 0) || 
    (debts && debts.length > 0);

  // Handle cancel button click
  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <DialogRoot
      size={{ base: "sm", md: "lg" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => onOpenChange(open)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader data-testid="edit-transaction-header">
            <DialogTitle>Edit Transaction</DialogTitle>
            <Text size="sm" className="text-gray-600 dark:text-gray-300">Update the transaction details.</Text>
          </DialogHeader>
          
          <DialogBody data-testid="edit-transaction-body">
            {/* Main transaction details */}
            <div className="space-y-4">
              {/* First row: Type and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  required
                  invalid={!!errors.transaction_type}
                  errorText={errors.transaction_type?.message}
                  label="Type"
                >
                  <Select
                    id="transaction_type"
                    {...register("transaction_type", {
                      required: "Type is required.",
                    })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Select>
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
                    rules={{ 
                      required: "Amount is required",
                      min: { value: 0.01, message: "Amount must be greater than 0" }
                    }}
                    render={({ field }) => (
                      <NumberInput
                        min={0.01}
                        step={0.01}
                        value={field.value || 0}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </Field>
              </div>

              {/* Second row: Description and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Third row: Account and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  invalid={!!errors.account_id}
                  errorText={errors.account_id?.message}
                  label="Account"
                >
                  <Select
                    id="account_id"
                    {...register("account_id")}
                    placeholder="Select account (optional)"
                    disabled={accountsLoading}
                  >
                    <option value="">------</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Currency">
                  <Input
                    value={getCurrentCurrencyName()}
                    disabled
                    readOnly
                  />
                  <input type="hidden" {...register("currency_id", {
                    required: "Currency is required."
                  })} />
                </Field>
              </div>

              {/* Fourth row: Category and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  required
                  invalid={!!errors.category_id}
                  errorText={errors.category_id?.message}
                  label="Category"
                >
                  <Select
                    id="category_id"
                    {...register("category_id", {
                      required: "Category is required.",
                    })}
                    placeholder="Select category"
                    disabled={categoriesLoading || filteredCategories.length === 0}
                  >
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No categories available</option>
                    )}
                  </Select>
                </Field>

                <Field
                  required
                  invalid={!!errors.payment_method_id}
                  errorText={errors.payment_method_id?.message}
                  label="Payment Method"
                >
                  <Select
                    id="payment_method_id"
                    {...register("payment_method_id", {
                      required: "Payment method is required.",
                    })}
                    placeholder="Select payment method"
                    disabled={paymentMethodsLoading}
                  >
                    {paymentMethods && paymentMethods.length > 0 ? (
                      paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No payment methods available</option>
                    )}
                  </Select>
                </Field>
              </div>
              
              {/* Linked Debt Information (if present) */}
              {linkedDebtInfo && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Linked to Debt</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Creditor:</span> {linkedDebtInfo.name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Remaining Balance:</span> ${linkedDebtInfo.remaining.toFixed(2)}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${linkedDebtInfo.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {linkedDebtInfo.progress}% paid off
                    </p>
                  </div>
                </div>
              )}
              
              {/* Optional fields section */}
              {hasOptionalItems && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium mb-4 dark:text-purple-400 dark:hover:text-purple-300"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    <span className="mr-2">{showAdvancedOptions ? '−' : '+'}</span>
                    {showAdvancedOptions ? 'Hide' : 'Show'} Additional Options
                  </button>
                  
                  {showAdvancedOptions && (
                    <div className="space-y-4">
                      {/* Financial Goal */}
                      {financialGoals && financialGoals.length > 0 && (
                        <Field
                          invalid={!!errors.financial_goal_id}
                          errorText={errors.financial_goal_id?.message}
                          label="Financial Goal"
                        >
                          <Select
                            id="financial_goal_id"
                            {...register("financial_goal_id")}
                            placeholder="Select financial goal (optional)"
                            disabled={goalsLoading}
                          >
                            <option value="">------</option>
                            {financialGoals.map((goal) => (
                              <option key={goal.id} value={goal.id}>
                                {goal.name || `Goal #${goal.id.substring(0, 8)}`}
                              </option>
                            ))}
                          </Select>
                        </Field>
                      )}
                      
                      {/* Optional fields in two columns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Subscription selection */}
                        {subscriptions && subscriptions.length > 0 && (
                          <Field
                            invalid={!!errors.subscription_id}
                            errorText={errors.subscription_id?.message}
                            label="Subscription"
                          >
                            <Select
                              id="subscription_id"
                              {...register("subscription_id")}
                              placeholder="Select subscription (optional)"
                              disabled={subscriptionsLoading}
                            >
                              <option value="">------</option>
                              {subscriptions.map((subscription) => (
                                <option key={subscription.id} value={subscription.id}>
                                  {subscription.service_name || `Subscription #${subscription.id.substring(0, 8)}`}
                                </option>
                              ))}
                            </Select>
                          </Field>
                        )}
                        
                        {/* Debt selection */}
                        {debts && debts.length > 0 && (
                          <Field
                            invalid={!!errors.debt_id}
                            errorText={errors.debt_id?.message}
                            label="Debt"
                          >
                            <Select
                              id="debt_id"
                              {...register("debt_id")}
                              placeholder="Select debt (optional)"
                              disabled={debtsLoading}
                            >
                              <option value="">------</option>
                              {debts.map((debt) => (
                                <option key={debt.id} value={debt.id}>
                                  {debt.creditor_name} ({debt.remaining_amount > 0 ? 
                                    `$${debt.remaining_amount.toFixed(2)} remaining` : 
                                    'Paid off'})
                                </option>
                              ))}
                            </Select>
                          </Field>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter gap={2} data-testid="edit-transaction-footer">
            <Button
              variant="subtle"
              colorPalette="gray"
              disabled={isSubmitting}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorPalette="purple"
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              Update
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default EditTransaction;
