import * as React from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, placeholder, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(props.value ?? props.defaultValue ?? '');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined) {
        setInternalValue(props.value);
      }
    }, [props.value]);

    const isPlaceholderSelected = internalValue === '';

    return (
      <div className="w-full">
        {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <select
            className={cn(
              'h-9 block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              isPlaceholderSelected ? 'text-gray-400' : 'text-gray-900',
              className,
            )}
            ref={ref}
            defaultValue={props.value === undefined && props.defaultValue === undefined ? "" : undefined}
            {...props}
            onChange={handleChange}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
