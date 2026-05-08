import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export const FormSection = ({ title, children }: Props) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white overflow-hidden">
      {title && (
        <h3 className="bg-blue-50 border-b border-gray-200 px-4 py-3 text-base font-semibold text-gray-800">
          {title}
        </h3>
      )}
      <div className="space-y-4 p-4">
        {children}
      </div>
    </div>
  );
};