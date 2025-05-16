import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm, Controller } from "react-hook-form"
import { format } from "date-fns"

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
import { Category, TransactionService } from "@/client/services/TransactionService"
import useAuth from "@/hooks/useAuth"
import { TransactionCreate } from "@/types/transaction"
import { AddTransactionProps } from "@/types/props"

const AddTransaction = ({ isOpen: externalIsOpen, onOpenChange }: AddTransactionProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };
  
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
      account_id: "",
      financial_goal_id: "",
      debt_id: "",
      subscription_id: "",
    },
  });

  // Set default currency when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      reset({
        description: "",
        amount: 0,
        transaction_type: "expense",
        date: format(new Date(), 'yyyy-MM-dd'),
        currency_id: user?.default_currency_id || "",
        category_id: "",
        payment_method_id: "",
        account_id: "", // Will be set below
        financial_goal_id: "",
        debt_id: "",
        subscription_id: "",
      });
      
      if (user?.default_currency_id) {
        setValue("currency_id", user.default_currency_id);
      } else if (currencies.length > 0) {
        // If no default currency is set, use the first available currency
        setValue("currency_id", currencies[0].id);
      }
      
      // Set default category and payment method if available
      if (categories.length > 0) {
        const expenseCategories = categories.filter(c => c.category_type === "expense");
        if (expenseCategories.length > 0) {
          setValue("category_id", expenseCategories[0].id);
        }
      }
      
      if (paymentMethods.length > 0) {
        // Simplemente seleccionar el primer método de pago disponible
        // ya que ahora son entidades globales sin "default"
        setValue("payment_method_id", paymentMethods[0].id);
      }

      // Set default account to "Cash" or the first available account
      if (accounts.length > 0) {
        const cashAccount = accounts.find(acc => acc.name.toLowerCase() === 'cash');
        if (cashAccount) {
          setValue("account_id", cashAccount.id);
          // Update reset call default for account_id as well
          reset(currentValues => ({ ...currentValues, account_id: cashAccount.id })); 
        } else {
          setValue("account_id", accounts[0].id);
          reset(currentValues => ({ ...currentValues, account_id: accounts[0].id }));
        }
      } else {
        reset(currentValues => ({ ...currentValues, account_id: "" }));
      }
    }
  }, [isOpen, currencies, categories, paymentMethods, accounts, setValue, reset, user]);

  const transactionType = watch("transaction_type");
  const selectedAccountId = watch("account_id");

  // Clear payment_method_id if transaction_type is 'income'
  useEffect(() => {
    if (transactionType === 'income') {
      setValue("payment_method_id", "");
      setValue("financial_goal_id", "");
      setValue("debt_id", "");
      setValue("subscription_id", "");
      // Optionally hide advanced options if switching to income from expense
      // and they were visible
      if (showAdvancedOptions) {
        setShowAdvancedOptions(false);
      }
    } else if (transactionType === 'expense') {
      // If switching to expense, payment method might become visible/required
      // but other optional fields are handled by the main conditional display logic
    }
  }, [transactionType, setValue, showAdvancedOptions]);

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
      // Ensure all optional fields that are empty strings are set to undefined
      // This prevents the backend from trying to parse empty strings as UUIDs
      const cleanedData = {
        ...data,
        subscription_id: data.subscription_id || undefined,
        financial_goal_id: data.financial_goal_id || undefined,
        debt_id: data.debt_id || undefined,
        account_id: data.account_id || undefined,
      };
      
      return TransactionService.createTransaction(cleanedData);
    },
    onSuccess: () => {
      showSuccessToast("Transaction created successfully.");
      reset();
      handleOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err: ApiError) => {
      console.error("Transaction creation error:", err);
      handleError(err, showErrorToast);
    },
  });

  const onSubmit: SubmitHandler<TransactionCreate> = (data) => {
    mutation.mutate(data);
  };

  // Get the current currency name for display
  const getCurrentCurrencyName = () => {
    const currencyId = watch("currency_id");
    if (!currencyId) return "Loading...";
    
    // Check if it's from an account
    if (selectedAccountId) {
      const selectedAccount = accounts.find(account => account.id === selectedAccountId);
      if (selectedAccount && selectedAccount.currency) {
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
    handleOpenChange(false);
  };

  return (
    <DialogRoot
      size={{ base: "sm", md: "lg" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => handleOpenChange(open)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2 border-b">
            <DialogTitle>Add Transaction</DialogTitle>
            <Text size="sm" className="text-gray-600">Fill in the details to add a new transaction.</Text>
          </DialogHeader>
          
          <DialogBody className="py-4">
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

                {transactionType === 'expense' && (
                  <Field
                    required={transactionType === 'expense'} // Only required if expense
                    invalid={!!errors.payment_method_id}
                    errorText={errors.payment_method_id?.message}
                    label="Payment Method"
                  >
                    <Select
                      id="payment_method_id"
                      {...register("payment_method_id", {
                        required: transactionType === 'expense' ? "Payment method is required." : false,
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
                )}
              </div>
              
              {/* Optional fields section */}
              {hasOptionalItems && transactionType === 'expense' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium mb-4"
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
                                  {debt.name || `Debt #${debt.id.substring(0, 8)}`}
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

          <DialogFooter gap={2} className="sticky bottom-0 bg-white z-10 pt-2 border-t">
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
