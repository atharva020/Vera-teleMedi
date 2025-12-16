'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User } from '@/lib/types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-200 transition-all">
          <span className="text-white text-xs font-medium">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" sideOffset={8} alignOffset={0} className="w-56 p-2">
        {/* User Info */}
        <div className="flex items-center space-x-3 px-3 py-3 border-b border-slate-200">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
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

        {/* Menu Items */}
        <div className="py-1">
          <Link
            href="/profile"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Account</span>
          </Link>

          <Link
            href="/billing"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Billing</span>
          </Link>

          <Link
            href="/notifications"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span>Notifications</span>
          </Link>

          <div className="border-t border-slate-200 my-1"></div>

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors w-full text-left"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


