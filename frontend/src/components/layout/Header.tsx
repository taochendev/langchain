'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              🎯 Campaign Generator
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
