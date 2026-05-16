import {
    Badge,
    Button,
    FormField,
    FormSection,
    RadioGroup,
    Select,
    Upload,
    Stepper,
} from '@/shared/components';
import { DateInputTrigger } from '@/shared/components/ui/DateInputTrigger';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';

import { FileTextIcon, EyeIcon, SendIcon, GlobeIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from '@/shared/icons';
import { CharacterSelect } from '../components/CharacterSelect';
import { PlatformCard } from '../components/PlatformCard';
// --- CẤU HÌNH STEPS ---
const MODAL_STEPS = [
    { label: 'Cấu hình gen video', icon: <FileTextIcon /> },
    { label: 'Thử nghiệm', icon: <EyeIcon /> },
    { label: 'Cấu hình đăng', icon: <SendIcon /> },
];

interface ModalCreationPageProps {
    onClose?: () => void;
}

function ModalCreationPage({ onClose }: ModalCreationPageProps) {
    // Quản lý Step hiện tại
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [watermarkPosition, setWatermarkPosition] = useState<string | number>('top_left');
    const [videoFrequency, setVideoFrequency] = useState<string | number>('daily');
    const [frequencyDays, setFrequencyDays] = useState<string | number>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [character, setCharacter] = useState<string>('mc_minh_giang');
    const [aiModel, setAiModel] = useState<string>('');
    const [dataSource, setDataSource] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [selectedTimes, setSelectedTimes] = useState<string[]>(['06:00', '12:00']);
    const [hourInput, setHourInput] = useState<string>('');
    const [minuteInput, setMinuteInput] = useState<string>('');
    const [timeError, setTimeError] = useState<string>('');
    const [watermarkPreviews, setWatermarkPreviews] = useState<string[]>([]);

    const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        if (currentStep === 1) {
            setIsGenerating(true);
            setProgress(0);
            setIsGenerated(false);
        }
    }, [currentStep]);

    useEffect(() => {
        if (!isGenerating) return;

        if (progress < 100) {
            const timer = setTimeout(() => {
                setProgress(prev => prev + 5);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsGenerating(false);
            setIsGenerated(true);
        }
    }, [isGenerating, progress]);

    const handleCancelGenerate = () => {
        setIsGenerating(false);
        setProgress(0);
        setIsGenerated(false);
    };

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

        setSelectedTimes([...selectedTimes, formattedTime].sort());
        setHourInput('');
        setMinuteInput('');
        setTimeError('');
    };

    const handleRemoveTime = (timeToRemove: string) => {
        setSelectedTimes(selectedTimes.filter(t => t !== timeToRemove));
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
                    setWatermarkPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleRemoveWatermark = (index: number) => {
        setWatermarkPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        if (currentStep === 0) {
            const newErrors: Record<string, string> = {};
            let hasError = false;

            if (!aiModel) {
                newErrors.aiModel = 'Vui lòng chọn loại model AI';
                hasError = true;
            }
            if (!dataSource) {
                newErrors.dataSource = 'Vui lòng chọn vùng dữ liệu nội dung';
                hasError = true;
            }
            if (!character) {
                newErrors.character = 'Vui lòng chọn nhân vật';
                hasError = true;
            }
            if (!videoFrequency) {
                newErrors.videoFrequency = 'Vui lòng chọn tần suất tạo video';
                hasError = true;
            }
            if (videoFrequency === 'every_other_day' && !frequencyDays) {
                newErrors.frequencyDays = 'Vui lòng chọn số ngày';
                hasError = true;
            }
            if (selectedTimes.length === 0) {
                setTimeError('Vui lòng thêm ít nhất một thời điểm');
                hasError = true;
            }
            if (startDate && endDate && startDate > endDate) {
                newErrors.endDate = 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
                hasError = true;
            }

            setErrors(newErrors);
            if (hasError) return;
        }

        if (currentStep < MODAL_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setErrors({});
            setTimeError('');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className="mx-auto flex h-[960px] max-h-[80vh] w-full max-w-[880px] flex-col rounded-lg bg-white">
            <div className="shrink-0 border-b border-gray-100 px-0 pb-4 pt-0">
                <div className="flex w-full justify-center">
                    <Stepper steps={MODAL_STEPS} currentStep={currentStep} />
                </div>
            </div>
            <div className="custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-0 py-0">
                {currentStep === 0 && (
                    <div className="animate-in fade-in flex flex-col gap-5 duration-300">
                        <FormSection title="Cấu hình model AI và nguồn dữ liệu">
                            <FormField label="Chọn loại model AI (LLM)" required error={errors.aiModel}>
                                <Select
                                    placeholder='Chọn loại model'
                                    value={aiModel}
                                    onChange={(e) => {
                                        setAiModel(e.target.value);
                                        setErrors(prev => ({ ...prev, aiModel: '' }));
                                    }}
                                    options={[
                                        { label: 'OpenAI/GPT-4', value: 'gpt4' },
                                        { label: 'OpenAI/GPT-5', value: 'gpt5' },
                                    ]}
                                />
                            </FormField>
                            <FormField label="Chọn vùng dữ liệu nội dung" required error={errors.dataSource}>
                                <Select
                                    placeholder='Chọn vùng dữ liệu'
                                    value={dataSource}
                                    onChange={(e) => {
                                        setDataSource(e.target.value);
                                        setErrors(prev => ({ ...prev, dataSource: '' }));
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
                            </FormField>
                        </FormSection>

                        <FormSection title="Cấu hình video đầu ra">
                            <FormField label="Chọn nhân vật" required error={errors.character}>
                                <CharacterSelect
                                    value={character}
                                    onChange={(val) => {
                                        setCharacter(val);
                                        setErrors(prev => ({ ...prev, character: '' }));
                                    }}
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
                                <RadioGroup
                                    name="watermark_position"
                                    value={watermarkPosition}
                                    onChange={setWatermarkPosition}
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
                            </FormField>
                        </FormSection>

                        <FormSection title="Cấu hình thời gian gen video tự động">
                            <FormField label="Tần suất tạo video" required error={errors.videoFrequency}>
                                <div className="flex flex-col gap-4">
                                    <RadioGroup
                                        name="video_frequency"
                                        value={videoFrequency}
                                        onChange={(val) => {
                                            setVideoFrequency(val);
                                            setErrors(prev => ({ ...prev, videoFrequency: '' }));
                                        }}
                                        optionsWrapperClass="flex flex-row gap-8 space-y-0"
                                        options={[
                                            { label: 'Hàng ngày', value: 'daily' },
                                            { label: 'Cách ngày', value: 'every_other_day' },
                                            { label: 'Mỗi khi có dữ liệu mới', value: 'on_new_data' },
                                        ]}
                                    />
                                    {videoFrequency === 'every_other_day' && (
                                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="w-[80px]">
                                                <Select
                                                    placeholder=""
                                                    value={frequencyDays}
                                                    onChange={(e) => {
                                                        setFrequencyDays(e.target.value);
                                                        setErrors(prev => ({ ...prev, frequencyDays: '' }));
                                                    }}
                                                    error={errors.frequencyDays}
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
                                            </div>
                                            <span className="text-sm text-gray-400">Chọn số ngày</span>
                                        </div>
                                    )}
                                </div>
                            </FormField>
                            <FormField label="Thời điểm" required error={timeError}>
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
                                <FormField label="Ngày bắt đầu" className="flex-1" error={errors.startDate}>
                                    <DateInputTrigger
                                        className="w-full"
                                        value={startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : ''}
                                        onChange={(e) => {
                                            setStartDate(e.target.value ? new Date(e.target.value) : null);
                                            setErrors(prev => ({ ...prev, startDate: '', endDate: '' }));
                                        }}
                                    />
                                </FormField>

                                <FormField label="Ngày kết thúc" className="flex-1" error={errors.endDate}>
                                    <DateInputTrigger
                                        className="w-full"
                                        value={endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10) : ''}
                                        onChange={(e) => {
                                            setEndDate(e.target.value ? new Date(e.target.value) : null);
                                            setErrors(prev => ({ ...prev, startDate: '', endDate: '' }));
                                        }}
                                    />
                                </FormField>
                                <div className="flex-1">
                                </div>
                                <div className="flex-1">
                                </div>
                            </div>
                        </FormSection>
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="animate-in fade-in flex flex-col duration-300 rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm flex-1 min-h-0">
                        <div className="bg-[#f3f6f9] shrink-0 px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Video thử nghiệm
                        </div>
                        <div className="custom-scrollbar p-4 flex flex-col gap-4 overflow-y-auto">
                            {/* Tabs */}
                            <div className="h-[40px] px-1 py-1 flex w-full items-center gap-1 rounded-md bg-[#f8f9fa] border border-gray-200">
                                <button
                                    type="button"
                                    className={cn(
                                        "h-[32px] flex-1 flex items-center justify-center rounded-sm text-sm font-medium leading-[20px] transition-colors",
                                        videoRatio === '16:9' ? "bg-white text-[#33a8c0] shadow-sm" : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => setVideoRatio('16:9')}
                                >
                                    Ngang 16:9
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        "h-[32px] flex-1 flex items-center justify-center rounded-sm text-sm font-medium leading-[20px] transition-colors",
                                        videoRatio === '9:16' ? "bg-white text-[#33a8c0] shadow-sm" : "text-gray-600 hover:text-gray-900"
                                    )}
                                    onClick={() => setVideoRatio('9:16')}
                                >
                                    Dọc 9:16
                                </button>
                            </div>
                            {/* Preview Area */}
                            <div className={cn(
                                "shrink-0 flex flex-col items-center justify-center rounded-sm transition-all duration-300 overflow-hidden",
                                videoRatio === '16:9' ? "aspect-video w-full" : "aspect-[9/16] w-[320px] mx-auto",
                                isGenerated ? "bg-black border border-gray-200" : "bg-[#eaf8fb] border border-[#d2f0f4]",
                                !isGenerated && videoRatio === '9:16' && "py-10"
                            )}>
                                {isGenerating ? (
                                    <div className="flex w-full max-w-md flex-col items-center px-6">
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-white shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#4F8EEB] to-[#9B60ED] transition-all duration-100 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-4 text-center text-sm text-gray-500">
                                            AI đang xử lý kịch bản và dữ liệu để tạo video thử nghiệm vui lòng chờ giây lát...
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleCancelGenerate}
                                            className="mt-6 rounded border border-gray-300 bg-white px-5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
                                        >
                                            Huỷ
                                        </button>
                                    </div>
                                ) : isGenerated ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube-nocookie.com/embed/FN7ALfpGxiI?autoplay=1&mute=1&origin=http://YOUR_IP_ADDRESS"
                                        title="Video thử nghiệm"
                                        style={{ border: 0 }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full object-cover"
                                    ></iframe>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-2 text-4xl">🎬</div>
                                        <p className="text-gray-500">Video preview sẽ hiển thị tại đây</p>
                                        <Button
                                            type="button"
                                            onClick={() => { setIsGenerating(true); setProgress(0); setIsGenerated(false); }}
                                            className="mt-4 bg-[#33a8c0] text-white hover:bg-[#288b9e]"
                                        >
                                            Tạo lại video
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {isGenerated ? (
                                <div className="mt-2 flex flex-col gap-3 px-2 pb-2">
                                    <h3 className="text-xl font-bold text-gray-900 leading-snug">Dự báo thời tiết 19/1/2026: Hà Nội nắng nhẹ 26 độ, sắp đón không khí lạnh mạnh</h3>
                                    <div className="h-[1px] w-full bg-gray-200 my-1"></div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Dự báo thời tiết 19/1/2026, hầu hết các vùng trên cả nước đều xuất hiện nắng; mức nhiệt cao nhất ở Hà Nội khoảng 26 độ. Chiều tối và đêm 20/1, một đợt không khí lạnh mạnh tràn về.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-2 flex flex-col gap-3 px-2 pb-2">
                                    <div className="h-2.5 w-full rounded-full bg-[#eaf8fb]"></div>
                                    <div className="h-2.5 w-[90%] rounded-full bg-[#eaf8fb]"></div>
                                    <div className="h-2.5 w-full rounded-full bg-[#eaf8fb]"></div>
                                    <div className="h-2.5 w-[80%] rounded-full bg-[#eaf8fb]"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="animate-in fade-in flex flex-col gap-4 duration-300 ">
                        <PlatformCard
                            title="Webiste"
                            icon={<GlobeIcon />}
                            tags169={['Mực Tím', 'Báo Tuổi Trẻ']}
                            tags916={[]}
                            publishType="wait"
                            placeholder="Chọn site"
                            platform="web"
                        />
                        <PlatformCard
                            title="Facebook Page"
                            icon={<FacebookIcon />}
                            tags169={['Mực Tím', 'Truyền hình - Báo Tuổi Trẻ', 'Tuổi Trẻ Cười']}
                            tags916={['Truyền hình - Báo Tuổi Trẻ']}
                            publishType="wait"
                            placeholder="Chọn page"
                            platform="fb"
                        />
                        <PlatformCard
                            title="Youtube"
                            icon={<YoutubeIcon />}
                            tags169={['Tuổi Trẻ Cười']}
                            tags916={['Mực tím']}
                            publishType="schedule"
                            placeholder="Chọn page"
                            platform="yt"
                        />
                        <PlatformCard
                            title="Tiktok"
                            icon={<TiktokIcon />}
                            tags169={[]}
                            tags916={['Mực tím']}
                            publishType="wait"
                            placeholder="Chọn kênh"
                            platform="web"
                        />
                    </div>
                )}
            </div>
            <div className="flex shrink-0 items-center justify-center gap-3 rounded-b-lg border-t border-gray-200 bg-white py-4 pb-0">
                <Button
                    variant="outline"
                    type="button"
                    className="flex min-w-[100px] items-center justify-center gap-2 border-gray-300 px-4 text-gray-600"
                    onClick={onClose}
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    Đóng
                </Button>
                {currentStep > 0 && (
                    <Button
                        variant="outline"
                        type="button"
                        className="flex min-w-[100px] items-center justify-center gap-2 border-gray-300 px-4 text-gray-600"
                        onClick={handleBack}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Quay lại
                    </Button>
                )}
                <Button
                    type="button"
                    className="flex min-w-[120px] items-center justify-center gap-2 bg-[#33a8c0] px-4 text-white transition-colors hover:bg-[#288b9e] disabled:bg-[#C2C2C2] disabled:hover:bg-[#C2C2C2] disabled:opacity-100 disabled:cursor-not-allowed"
                    onClick={currentStep === MODAL_STEPS.length - 1 ? onClose : handleNext}
                    disabled={currentStep === 1 && !isGenerated}
                >
                    {currentStep === MODAL_STEPS.length - 1 ? (
                        <>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Lưu và bắt đầu chạy
                        </>
                    ) : (
                        <>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                            Tiếp theo
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default ModalCreationPage;
