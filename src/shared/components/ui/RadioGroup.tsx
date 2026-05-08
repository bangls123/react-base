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
  optionsWrapperClass?: string; // Thêm prop này để tùy biến layout của các thẻ con
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
      {/* Thay đổi ở đây: cho phép ghi đè class của wrapper chứa các options */}
      <div className={cn('flex flex-col space-y-2', optionsWrapperClass)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center space-x-2', // Giảm space-x-3 xuống 2 cho gọn nếu cần
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
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
