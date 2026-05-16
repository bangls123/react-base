import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
    Badge,
    FormField,
    FormSection,
    RadioGroup,
    Select,
    Upload,
} from '@/shared/components';
import { DateInputTrigger } from '@/shared/components/ui/DateInputTrigger';
import { CharacterSelect } from './CharacterSelect';
import { VideoConfigFormData } from '../schema';

export const VideoConfigStep: React.FC = () => {
    const { control, watch, setValue, formState: { errors }, clearErrors } = useFormContext<VideoConfigFormData>();

    const videoFrequency = watch('videoFrequency');
    const selectedTimes = watch('selectedTimes');
    const watermarkPreviews = watch('watermarkPreviews');

    const [hourInput, setHourInput] = useState<string>('');
    const [minuteInput, setMinuteInput] = useState<string>('');
    const [timeError, setTimeError] = useState<string>('');

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setHourInput(val);
        setTimeError('');
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMinuteInput(val);
        setTimeError('');
    };

    const handleAddTime = () => {
        if (!hourInput || !minuteInput) {
            setTimeError('Vui lòng nhập đầy đủ giờ và phút');
            return;
        }

        const h = parseInt(hourInput, 10);
        const m = parseInt(minuteInput, 10);

        if (isNaN(h) || h < 0 || h > 23) {
            setTimeError('Giờ không hợp lệ (0-23)');
            return;
        }

        if (isNaN(m) || m < 0 || m > 59) {
            setTimeError('Phút không hợp lệ (0-59)');
            return;
        }

        const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        if (selectedTimes.includes(formattedTime)) {
            setTimeError('Thời gian này đã được chọn');
            return;
        }

        setValue('selectedTimes', [...selectedTimes, formattedTime].sort(), { shouldValidate: true });
        setHourInput('');
        setMinuteInput('');
        setTimeError('');
        clearErrors('selectedTimes');
    };

    const handleRemoveTime = (timeToRemove: string) => {
        setValue('selectedTimes', selectedTimes.filter(t => t !== timeToRemove), { shouldValidate: true });
    };

    const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTime();
        }
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        fileArray.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setValue('watermarkPreviews', [...watermarkPreviews, reader.result as string]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleRemoveWatermark = (index: number) => {
        setValue('watermarkPreviews', watermarkPreviews.filter((_, i) => i !== index));
    };

    return (
        <div className="animate-in fade-in flex flex-col gap-5 duration-300">
            <FormSection title="Cấu hình model AI và nguồn dữ liệu">
                <FormField label="Chọn loại model AI (LLM)" required error={errors.aiModel?.message}>
                    <Controller
                        name="aiModel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder='Chọn loại model'
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    clearErrors('aiModel');
                                }}
                                options={[
                                    { label: 'OpenAI/GPT-4', value: 'gpt4' },
                                    { label: 'OpenAI/GPT-5', value: 'gpt5' },
                                ]}
                            />
                        )}
                    />
                </FormField>
                <FormField label="Chọn vùng dữ liệu nội dung" required error={errors.dataSource?.message}>
                    <Controller
                        name="dataSource"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder='Chọn vùng dữ liệu'
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                    clearErrors('dataSource');
                                }}
                                options={[
                                    {
                                        label: 'Nguồn dữ liệu dự báo thời tiết theo giờ – Trung tâm KTTV 1',
                                        value: 'weather_data_1',
                                    },
                                    {
                                        label: 'Nguồn dữ liệu dự báo thời tiết – Khu vực MB',
                                        value: 'weather_data_2',
                                    },
                                ]}
                            />
                        )}
                    />
                </FormField>
            </FormSection>

            <FormSection title="Cấu hình video đầu ra">
                <FormField label="Chọn nhân vật" required error={errors.character?.message}>
                    <Controller
                        name="character"
                        control={control}
                        render={({ field }) => (
                            <CharacterSelect
                                value={field.value}
                                onChange={(val) => {
                                    field.onChange(val);
                                    clearErrors('character');
                                }}
                            />
                        )}
                    />
                </FormField>
                <FormField label="Watermark">
                    <div className='flex flex-wrap items-start gap-4'>
                        <Upload onFileSelect={handleFiles} accept="image/*" multiple />
                        {watermarkPreviews.map((preview, index) => (
                            <div key={index} className="relative group h-[90px] w-[130px] rounded-lg border border-gray-200 overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
                                <img src={preview} alt="Watermark" className="max-h-full max-w-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveWatermark(index)}
                                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </FormField>
                <FormField label="Vị trí Watermark">
                    <Controller
                        name="watermarkPosition"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                name="watermark_position"
                                value={field.value}
                                onChange={field.onChange}
                                optionsWrapperClass="flex flex-row flex-wrap gap-x-6 gap-y-2 space-y-0"
                                options={[
                                    { label: 'Trên trái', value: 'top_left' },
                                    { label: 'Trên giữa', value: 'top_center' },
                                    { label: 'Trên phải', value: 'top_right' },
                                    { label: 'Giữa ảnh', value: 'center' },
                                    { label: 'Dưới trái', value: 'bottom_left' },
                                    { label: 'Dưới giữa', value: 'bottom_center' },
                                    { label: 'Dưới phải', value: 'bottom_right' },
                                ]}
                            />
                        )}
                    />
                </FormField>
            </FormSection>

            <FormSection title="Cấu hình thời gian gen video tự động">
                <FormField label="Tần suất tạo video" required error={errors.videoFrequency?.message}>
                    <div className="flex flex-col gap-4">
                        <Controller
                            name="videoFrequency"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    name="video_frequency"
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        clearErrors('videoFrequency');
                                    }}
                                    optionsWrapperClass="flex flex-row gap-8 space-y-0"
                                    options={[
                                        { label: 'Hàng ngày', value: 'daily' },
                                        { label: 'Cách ngày', value: 'every_other_day' },
                                        { label: 'Mỗi khi có dữ liệu mới', value: 'on_new_data' },
                                    ]}
                                />
                            )}
                        />
                        {videoFrequency === 'every_other_day' && (
                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="w-[80px]">
                                    <Controller
                                        name="frequencyDays"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                placeholder=""
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    clearErrors('frequencyDays');
                                                }}
                                                error={errors.frequencyDays?.message}
                                                options={[
                                                    { label: '1', value: 1 },
                                                    { label: '2', value: 2 },
                                                    { label: '3', value: 3 },
                                                    { label: '4', value: 4 },
                                                    { label: '5', value: 5 },
                                                    { label: '6', value: 6 },
                                                    { label: '7', value: 7 },
                                                ]}
                                            />
                                        )}
                                    />
                                </div>
                                <span className="text-sm text-gray-400">Chọn số ngày</span>
                            </div>
                        )}
                    </div>
                </FormField>
                <FormField label="Thời điểm" required error={timeError || errors.selectedTimes?.message}>
                    <div className="flex items-center">
                        <div className="h-[36px] flex items-center rounded-md border border-gray-200 bg-[#F8F9FA] focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
                            <input
                                placeholder="Giờ"
                                value={hourInput}
                                onChange={handleHourChange}
                                onKeyDown={handleTimeKeyDown}
                                className="w-16 bg-transparent py-2 text-center text-sm outline-none placeholder:text-gray-300"
                            />
                            <div className="h-4 w-[1px] bg-gray-200 shrink-0" />
                            <input
                                placeholder="Phút"
                                value={minuteInput}
                                onChange={handleMinuteChange}
                                onKeyDown={handleTimeKeyDown}
                                className="w-16 bg-transparent py-2 text-center text-sm outline-none placeholder:text-gray-300"
                            />
                            <button
                                type="button"
                                onClick={handleAddTime}
                                className="h-[38px] border-l border-gray-200 bg-white px-4 text-sm font-medium text-[#0091D5] transition-all hover:bg-blue-50 active:bg-blue-100 outline-none"
                            >
                                Thêm giờ
                            </button>
                        </div>
                    </div>
                </FormField>

                <FormField label="Các mốc đã chọn">
                    <div className="flex flex-wrap gap-2">
                        {selectedTimes.length === 0 && (
                            <span className="text-sm text-gray-400">Chưa có mốc thời gian nào</span>
                        )}
                        {selectedTimes.map((time) => (
                            <Badge key={time} variant="secondary" className="flex items-center gap-1">
                                {time} <span onClick={() => handleRemoveTime(time)} className="cursor-pointer text-gray-500 hover:text-red-500">✕</span>
                            </Badge>
                        ))}
                    </div>
                </FormField>
                <div className="flex gap-5 w-full">
                    <FormField label="Ngày bắt đầu" className="flex-1" error={errors.startDate?.message}>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <DateInputTrigger
                                    className="w-full"
                                    value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value ? new Date(e.target.value) : null);
                                        clearErrors(['startDate', 'endDate']);
                                    }}
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Ngày kết thúc" className="flex-1" error={errors.endDate?.message}>
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <DateInputTrigger
                                    className="w-full"
                                    value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value ? new Date(e.target.value) : null);
                                        clearErrors(['startDate', 'endDate']);
                                    }}
                                />
                            )}
                        />
                    </FormField>
                    <div className="flex-1">
                    </div>
                    <div className="flex-1">
                    </div>
                </div>
            </FormSection>
        </div>
    );
};
