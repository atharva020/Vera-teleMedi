'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: User;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Consultations', href: '/consultations', icon: '🩺' },
  { name: 'My Profile', href: '/profile', icon: '👤' },
  { name: 'Messages', href: '/messages', icon: '💬' },
  { name: 'Appointments', href: '/appointments', icon: '📅' },
  { name: 'Medical Records', href: '/records', icon: '📋' },
  { name: 'Prescriptions', href: '/prescriptions', icon: '💊' },
  { name: 'Billing', href: '/billing', icon: '💳' },
];

// Patient navigation items (different from doctor)
const patientNavigationItems = [
  { name: 'Home', href: '/patient', icon: '🏠' },
  { name: 'Dashboard', href: '/patient/dashboard', icon: '📊' },
  { name: 'Consultations', href: '/consultations', icon: '🩺' },
  { name: 'My Profile', href: '/profile', icon: '👤' },
  { name: 'Messages', href: '/messages', icon: '💬' },
  { name: 'Appointments', href: '/appointments', icon: '📅' },
  { name: 'Medical Records', href: '/records', icon: '📋' },
  { name: 'Billing', href: '/billing', icon: '💳' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-slate-900">vera</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {(user.user_type === 'patient' ? patientNavigationItems : navigationItems).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.username}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.user_type === 'patient' ? 'Patient' : 'Doctor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

