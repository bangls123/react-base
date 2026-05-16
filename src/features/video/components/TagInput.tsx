import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { SiteTag } from './SiteTag';
import { TAG_SUGGESTIONS } from '../constants';

export function TagInput({ tags, setTags, platform, placeholder }: { tags: string[], setTags: (tags: string[]) => void, platform?: 'fb' | 'yt' | 'web', placeholder?: string }) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredSuggestions = TAG_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
    );

    // Reset index khi nội dung search thay đổi
    useEffect(() => {
        setActiveIndex(0);
    }, [inputValue, tags.length]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setInputValue('');
        setIsOpen(true);
        inputRef.current?.focus();
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setActiveIndex(prev => (prev + 1) % filteredSuggestions.length);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (isOpen) {
                setActiveIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (isOpen && filteredSuggestions.length > 0) {
                handleAddTag(filteredSuggestions[activeIndex]);
            } else if (inputValue) {
                handleAddTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            handleRemoveTag(tags[tags.length - 1]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2 min-h-[42px] focus-within:border-[#33a8c0] focus-within:ring-1 focus-within:ring-[#33a8c0] cursor-text transition-colors"
                onClick={() => {
                    inputRef.current?.focus();
                    setIsOpen(true);
                }}
            >
                {tags.map(t => <SiteTag key={t} label={t} platform={platform} onRemove={() => handleRemoveTag(t)} />)}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300 min-w-[80px]"
                    value={inputValue}
                    onChange={e => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {isOpen && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg py-1">
                    {filteredSuggestions.map((s, index) => (
                        <div
                            key={s}
                            className={cn(
                                "px-3 py-2 text-sm cursor-pointer transition-colors",
                                index === activeIndex ? "bg-[#eaf8fb] text-[#33a8c0] font-medium" : "text-gray-700 hover:bg-gray-50"
                            )}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleAddTag(s);
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
