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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      await signIn(data.email, data.password);
      
      // Show success message and redirect
      setIsRedirecting(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Small delay to show success state
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your campaigns
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
          
          {isRedirecting ? (
            <div className="text-center space-y-2">
              <div className="text-green-600 font-medium">✅ Sign in successful!</div>
              <div className="text-sm text-gray-600">Redirecting to dashboard...</div>
            </div>
          ) : (
            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          )}
          
          <div className="text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Don&apos;t have an account? Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
