'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onClose();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'rounded-lg border border-stone-200 bg-white shadow-[0_4px_24px_rgba(26,23,20,0.12)]',
        'p-0 w-full max-w-md backdrop:bg-stone-950/30 backdrop:backdrop-blur-sm',
        'open:animate-in',
        className
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-950">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-stone-600 font-sans">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-4 shrink-0 -mr-1 -mt-0.5"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>
      {children && (
        <div className="px-6 py-5">{children}</div>
      )}
      {footer && (
        <div className="px-6 pb-5 pt-2 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </dialog>
  );
}

export { Modal };
export type { ModalProps };
