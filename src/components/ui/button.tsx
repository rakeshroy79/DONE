import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-semibold transition duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}
