import { ReactNode } from 'react';
type Props = {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};
export const FormField = ({ label, required, error, children }: Props) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-500">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
