import { cn } from '@/utils/cn';
import * as React from 'react';

const CalendarIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  placeholder?: string;
}

const DateInputTrigger = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, error, placeholder = "Chọn ngày", value, onClick, ...props }, ref) => {
    let displayValue = placeholder;
    if (value) {
      const date = new Date(value as string);
      if (!isNaN(date.getTime())) {
        displayValue = date.toLocaleDateString('vi-VN');
      }
    }

    return (
      <div className={cn("relative w-full", className)}>
        <div
          className={cn(
            "group flex h-8 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 transition-all hover:border-gray-300",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-[#4FB3D9]" strokeWidth={2} />
            <span className={cn("text-[13px]", value ? "text-gray-700" : "text-gray-400")}>
              {displayValue}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-gray-600" />
        </div>

        <input
          type="date"
          ref={ref}
          value={value}
          onClick={(e) => {
            if ('showPicker' in HTMLInputElement.prototype) {
              try {
                e.currentTarget.showPicker();
              } catch (err) { }
            }
            onClick?.(e);
          }}
          className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer"
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

DateInputTrigger.displayName = "DateInputTrigger";

export { DateInputTrigger };