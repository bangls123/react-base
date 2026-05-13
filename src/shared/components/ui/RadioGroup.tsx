import * as React from 'react';
import { cn } from '@/utils/cn';

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  optionsWrapperClass?: string;
  error?: string;
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  value,
  onChange,
  className,
  optionsWrapperClass,
  error,
  label,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className={cn('flex flex-col space-y-2', optionsWrapperClass)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center space-x-2',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
           <input
  type="radio"
  name={name}
  value={option.value}
  checked={value === option.value}
  onChange={() => !option.disabled && onChange(option.value)}
  disabled={option.disabled}
  className="appearance-none relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 bg-white outline-none transition-colors checked:border-[#33a8c0] before:content-[''] before:h-4 before:w-4 before:rounded-full before:bg-transparent checked:before:bg-[#33a8c0] focus:outline-none"
/>
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export { RadioGroup };