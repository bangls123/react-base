import React, { useState } from 'react';
import { TagInput } from './TagInput';
import { RadioGroup } from '@/shared/components';

export const PlatformCard = ({
    title,
    icon,
    tags169: defaultTags169,
    tags916: defaultTags916,
    publishType: defaultPublishType,
    placeholder = "Chọn site",
    platform
}: {
    title: string,
    icon: React.ReactNode,
    tags169: string[],
    tags916: string[],
    publishType: 'wait' | 'auto' | 'schedule',
    placeholder?: string,
    platform?: 'fb' | 'yt' | 'web'
}) => {
    const [publishType, setPublishType] = useState<'wait' | 'auto' | 'schedule'>(defaultPublishType);
    const [tags169, setTags169] = useState<string[]>(defaultTags169);
    const [tags916, setTags916] = useState<string[]>(defaultTags916);

    return (
        <div className="rounded-md border border-gray-200 bg-white shadow-sm ">
            <div className="h-[48px] flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 rounded-t-[5px]">
                <div className="flex h-6 w-6 items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 bg-[#fafbfc] rounded-b-[5px]">
                <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Video ngang 16:9</label>
                        <TagInput tags={tags169} setTags={setTags169} platform={platform} placeholder={placeholder} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Video dọc 9:16</label>
                        <TagInput tags={tags916} setTags={setTags916} platform={platform} placeholder={placeholder} />
                    </div>
                </div>

                <RadioGroup
                    name={`pub_${title}`}
                    value={publishType}
                    onChange={(val) => setPublishType(val as any)}
                    optionsWrapperClass="flex flex-row items-center gap-6 space-y-0"
                    options={[
                        { label: 'Lưu vào chờ xuất bản', value: 'wait' },
                        { label: 'Tự động xuất bản', value: 'auto' },
                        { label: 'Hẹn giờ xuất bản', value: 'schedule' }
                    ]}
                />

                {publishType === 'schedule' && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center rounded-md border border-gray-200 bg-white overflow-hidden">
                            <input type="text" defaultValue="08" className="w-12 py-1.5 text-center text-sm outline-none" />
                            <div className="h-4 w-[1px] bg-gray-200"></div>
                            <input type="text" defaultValue="30" className="w-12 py-1.5 text-center text-sm outline-none" />
                        </div>
                        <span className="text-sm text-gray-400">Thời gian xuất bản theo ngày</span>
                    </div>
                )}
            </div>
        </div>
    );
};
