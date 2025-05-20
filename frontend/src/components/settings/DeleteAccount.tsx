import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';

export const DeleteAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setConfirmText('');
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    setError('');
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'delete my account') {
      setError('Please type "delete my account" to confirm');
      return;
    }
    
    // In a real app, you would call an API to delete the account
    console.log('Account deletion confirmed');
    
    // Close modal after successful deletion
    setIsModalOpen(false);
    
    // In a real app, you would redirect to a logout page or confirmation page
  };

  return (
    <div className="bg-white shadow rounded-lg border border-red-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-slate-900">Delete Account</h3>
        <div className="mt-2 max-w-xl text-sm text-slate-500">
          <p>
            Once you delete your account, all of your data will be permanently removed. This action
            cannot be undone.
          </p>
        </div>
        <div className="mt-5">
          <Button variant="danger" onClick={handleOpenModal} className="flex items-center gap-2 cursor-pointer">
            <Trash2 size={16} />
            Delete Account
          </Button>
        </div>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Delete Your Account"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCloseModal} className='cursor-pointer'>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} className='cursor-pointer'>
              Delete Account
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 text-red-800 rounded-md flex">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
            <p className="text-sm">
              This action cannot be undone. All of your data will be permanently deleted.
            </p>
          </div>
          
          <p className="text-slate-600 text-sm">
            Please type <span className="font-medium">delete my account</span> to confirm:
          </p>
          
          <Input
            value={confirmText}
            onChange={handleConfirmChange}
            error={error}
            placeholder="delete my account"
          />
        </div>
      </Modal>
    </div>
  );
};