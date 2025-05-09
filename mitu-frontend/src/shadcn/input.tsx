import * as React from 'react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const r = ref ? ref : useRef<HTMLInputElement>(null);
    const handleFocus = () => {
      //@ts-ignore
      r.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    return (
      <input
        onFocus={handleFocus}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
        data-testid="input"
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
