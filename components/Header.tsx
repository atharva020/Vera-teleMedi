'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from '@/lib/types';
import { UserMenu } from '@/components/UserMenu';

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <span className="text-white font-bold text-lg md:text-xl">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Vera</span>
            <span className="hidden sm:block text-xs text-slate-500 -mt-1">Healthcare Platform</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-2 md:space-x-6">
          {user ? (
            <>
              <Link 
                href={user.user_type === 'patient' ? '/patient/dashboard' : '/dashboard'} 
                className="text-xs md:text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-2 md:px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                Dashboard
              </Link>
              <UserMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs md:text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-2 md:px-3 py-2 rounded-lg hover:bg-blue-50">
                Login
              </Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all text-xs md:text-sm">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

