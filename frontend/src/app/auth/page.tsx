'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function AuthPage() {
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Campaign Generator
					</h1>
					<p className="text-gray-600">
						AI-powered marketing campaign generator
					</p>
				</div>

				{isSignUp ? (
					<SignUpForm onToggleMode={() => setIsSignUp(false)} />
				) : (
					<LoginForm onToggleMode={() => setIsSignUp(true)} />
				)}
			</div>
		</div>
	);
}
