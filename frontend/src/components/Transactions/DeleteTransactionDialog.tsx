import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionService } from '@/client/services/TransactionService';
import useCustomToast from '@/hooks/useCustomToast';

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog-tailwind';
import { Button } from '@/components/ui/button-tailwind';
import { Text } from '@/components/ui/text-tailwind';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  transactionDescription: string;
}

const DeleteTransactionDialog = ({
  isOpen,
  onOpenChange,
  transactionId,
  transactionDescription,
}: DeleteTransactionDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const deleteMutation = useMutation({
    mutationFn: () => TransactionService.deleteTransaction(transactionId),
    onSuccess: () => {
      showSuccessToast('Transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      showErrorToast('Failed to delete transaction. Please try again.');
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate();
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => onOpenChange(open)}
      size={{ base: 'sm' }}
      placement="center"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>
            Are you sure you want to delete this transaction{' '}
            {transactionDescription ? (
              <span className="font-semibold">"{transactionDescription}"</span>
            ) : (
              ''
            )}?
          </Text>
          <Text className="mt-2 text-red-500">This action cannot be undone.</Text>
        </DialogBody>
        <DialogFooter gap={2}>
          <Button
            variant="subtle"
            colorPalette="gray"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            colorPalette="red"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteTransactionDialog;
