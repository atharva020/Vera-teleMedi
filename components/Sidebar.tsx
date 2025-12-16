'use client';

import * as React from 'react';
import { useState } from 'react';
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

// Create a context to control sidebar from parent components
export const SidebarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

// Global state for sidebar (shared across all instances)
let globalSidebarState = {
  isOpen: false,
  listeners: new Set<() => void>(),
};

function notifyListeners() {
  globalSidebarState.listeners.forEach(listener => listener());
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(globalSidebarState.isOpen);

  React.useEffect(() => {
    const listener = () => setIsOpen(globalSidebarState.isOpen);
    globalSidebarState.listeners.add(listener);
    return () => {
      globalSidebarState.listeners.delete(listener);
    };
  }, []);

  const handleToggle = React.useCallback((open: boolean) => {
    globalSidebarState.isOpen = open;
    setIsOpen(open);
    notifyListeners();
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen: handleToggle }}>
      {/* Backdrop - Mobile Only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => handleToggle(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center border-b border-slate-200 px-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-semibold text-slate-900">Vera</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {(user.user_type === 'patient' ? patientNavigationItems : navigationItems).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleToggle(false)}
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
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}

// Export a component for the hamburger button that can be used anywhere
export function SidebarToggleButton() {
  const [isOpen, setIsOpen] = React.useState(globalSidebarState.isOpen);

  React.useEffect(() => {
    const listener = () => setIsOpen(globalSidebarState.isOpen);
    globalSidebarState.listeners.add(listener);
    return () => {
      globalSidebarState.listeners.delete(listener);
    };
  }, []);

  const handleToggle = () => {
    const newState = !globalSidebarState.isOpen;
    globalSidebarState.isOpen = newState;
    setIsOpen(newState);
    notifyListeners();
  };
  
  return (
    <button
      onClick={handleToggle}
      className="md:hidden rounded-lg bg-white p-2 hover:bg-slate-100 border border-slate-200 transition-colors"
    >
      <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

