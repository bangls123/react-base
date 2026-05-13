import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
};

export const FormField = ({ label, required, error, children, className }: Props) => {
  return (
    <div className={cn("relative w-full", className)}>
      {label && (
       <label className="block mb-1 h-[20px] text-sm font-medium leading-[20px] text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};