'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from '@/lib/types';

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">vera</span>
            <span className="text-xs text-slate-500 -mt-1">Healthcare Platform</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                href={user.user_type === 'patient' ? '/patient/dashboard' : '/dashboard'} 
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm text-slate-600">
                  Welcome, {user.username}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50">
                Login
              </Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

