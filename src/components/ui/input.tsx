import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 border border-gray-300 rounded-lg',
        'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        'focus:outline-none transition duration-200',
        className
      )}
      {...props}
    />
  );
}
