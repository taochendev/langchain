'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export function EmailExistsDemo() {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoToSignIn = () => {
    setShowModal(false);
    alert('Redirecting to Sign In form...');
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Test Email Exists Modal</h3>
      <Button onClick={handleShowModal}>
        Simulate Email Already Exists Error
      </Button>

      <ConfirmModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleGoToSignIn}
        title="Email Already Registered"
        message={`The email "test@example.com" is already registered. Would you like to sign in instead?`}
        confirmText="Go to Sign In"
        cancelText="Try Again"
        type="warning"
        confirmVariant="primary"
      />
    </div>
  );
}
