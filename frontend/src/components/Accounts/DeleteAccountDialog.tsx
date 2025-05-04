import React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogRoot 
} from '@/components/ui/dialog-tailwind';
import { Button } from '@/components/ui/button-tailwind';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm
}) => {
  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={({ open }) => onOpenChange(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this account? This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="subtle" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="solid" colorPalette="red" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteAccountDialog;
