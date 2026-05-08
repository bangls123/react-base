import { cn } from '@/utils/cn';
import * as React from 'react';

export interface UploadProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  label?: string;
}

const Upload: React.FC<UploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  className,
  label = 'Chọn ảnh',
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div
      className={cn(
        'group relative flex h-[90px] w-[130px] cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200 bg-[#F8F9FA] transition-all hover:bg-gray-100',
        isDragging && 'border-sky-400 bg-sky-50',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <div className="relative mb-1">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#0091D5]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path
              d="M21 15L16 10L5 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F8F9FA] group-hover:bg-gray-100">
            <svg
              width="10"
              height="10"
              viewBox="0 0 22 22"
              fill="none"
              className="text-[#0091D5]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <span className="text-[12px] text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
};

export { Upload };