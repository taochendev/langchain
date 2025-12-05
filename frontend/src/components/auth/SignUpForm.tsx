'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  const [existingEmail, setExistingEmail] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call signUp and check if it actually created a new user
      const result = await signUp(data.email, data.password);
      
      // If signUp didn't throw but also didn't return a user, it might be an existing email
      // In this case, show the modal instead of success
      if (!result || !result.user) {
        setExistingEmail(data.email);
        setShowEmailExistsModal(true);
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
      // Check if the error is about existing email
      if (errorMessage.toLowerCase().includes('already') || 
          errorMessage.toLowerCase().includes('exists') || 
          errorMessage.toLowerCase().includes('registered') ||
          errorMessage.toLowerCase().includes('user already registered') ||
          errorMessage.toLowerCase().includes('email already confirmed') ||
          errorMessage.toLowerCase().includes('email address already registered') ||
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('taken') ||
          errorMessage.toLowerCase().includes('in use')) {
        setExistingEmail(data.email);
        setShowEmailExistsModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailExistsModalClose = () => {
    setShowEmailExistsModal(false);
    setExistingEmail('');
  };

  const handleGoToSignIn = () => {
    handleEmailExistsModalClose();
    onToggleMode(); // Switch to sign in form
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link. Please check your email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onToggleMode} variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Create a new account to start generating campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Enter your email"
          />
          
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="Enter your password"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your password"
          />
          
          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Email Already Exists Modal */}
    <ConfirmModal
      isOpen={showEmailExistsModal}
      onClose={handleEmailExistsModalClose}
      onConfirm={handleGoToSignIn}
      title="Email Already Registered"
      message={`The email "${existingEmail}" is already registered. Would you like to sign in instead?`}
      confirmText="Go to Sign In"
      cancelText="Try Again"
      type="warning"
      confirmVariant="primary"
    />
    </>
  );
}
