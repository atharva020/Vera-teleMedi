'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const PopoverContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Popover({ open = false, onOpenChange, children }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { onOpenChange } = React.useContext(PopoverContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange(true),
      'data-popover-trigger': true,
    } as any);
  }

  return (
    <button 
      onClick={() => onOpenChange(true)} 
      type="button"
      data-popover-trigger
    >
      {children}
    </button>
  );
}

export function PopoverContent({ 
  children, 
  className, 
  align = 'end',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  align?: 'start' | 'end' | 'center';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  alignOffset?: number;
}) {
  const { open, onOpenChange } = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    // Find the trigger element
    const trigger = document.querySelector('[data-popover-trigger]') as HTMLElement;
    triggerRef.current = trigger;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        if (trigger && !trigger.contains(event.target as Node)) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (!open || !contentRef.current || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (!trigger || !content) return;

      const triggerRect = trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      if (side === 'bottom') {
        top = triggerRect.bottom + sideOffset;
        if (align === 'end') {
          left = triggerRect.right - contentRect.width + alignOffset;
        } else if (align === 'start') {
          left = triggerRect.left + alignOffset;
        } else {
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + alignOffset;
        }
      } else if (side === 'top') {
        top = triggerRect.top - contentRect.height - sideOffset;
        if (align === 'end') {
          left = triggerRect.right - contentRect.width + alignOffset;
        } else if (align === 'start') {
          left = triggerRect.left + alignOffset;
        } else {
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2 + alignOffset;
        }
      }

      // Ensure it stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left + contentRect.width > viewportWidth) {
        left = viewportWidth - contentRect.width - 8;
      }
      if (left < 8) {
        left = 8;
      }
      if (top + contentRect.height > viewportHeight) {
        top = triggerRect.top - contentRect.height - sideOffset;
      }
      if (top < 8) {
        top = 8;
      }

      content.style.top = `${top}px`;
      content.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, side, align, sideOffset, alignOffset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      <div
        ref={contentRef}
        className={cn(
          'fixed z-50 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

