import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { PlayIcon } from '@/shared/icons';
import { CHARACTERS } from '../constants';

export function CharacterSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = CHARACTERS.find(o => o.value === value);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePlayVoice = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert('Đang phát giọng nói của ' + (selectedOption?.label || 'nhân vật') + '...');
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={cn(
                    "flex h-10 items-center justify-between rounded-md border bg-gray-100 px-3 py-2 text-sm cursor-pointer transition-colors",
                    isOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300 hover:border-gray-400"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {selectedOption ? (
                        <img src={selectedOption.image} className="w-6 h-6 rounded-full object-cover shadow-sm" alt="" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                    )}
                    <span className={!selectedOption ? "text-gray-500" : "text-gray-900"}>
                        {selectedOption?.label || 'Chọn nhân vật'}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {selectedOption && (
                        <button
                            type="button"
                            title="Nghe thử giọng nói"
                            onClick={handlePlayVoice}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#33a8c0] shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <PlayIcon />
                        </button>
                    )}
                    <svg className="ml-2 h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 5H3 M7 1l-4 4 4 4 M3 19h18 M17 15l4 4-4 4" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    {CHARACTERS.map(opt => (
                        <div
                            key={opt.value}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm",
                                value === opt.value ? "bg-[#e6f4f7]" : "hover:bg-gray-50"
                            )}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                        >
                            <img src={opt.image} className="w-6 h-6 rounded-full object-cover shadow-sm" alt="" />
                            <span className={cn(value === opt.value ? "font-medium text-[#288b9e]" : "text-gray-700")}>
                                {opt.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
