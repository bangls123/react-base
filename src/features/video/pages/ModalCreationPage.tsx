import {
    Badge,
    Button,
    FormField,
    FormSection,
    Input,
    RadioGroup,
    Select,
    Upload,
    Stepper,
} from '@/shared/components';
import { DateInputTrigger } from '@/shared/components/ui/DateInputTrigger';
import { cn } from '@/utils/cn';
import { useState, useRef, useEffect } from 'react';

// --- ICONS ---
const FileTextIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);

const EyeIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
);

const PaperPlaneIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
    </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("w-4 h-4", className)}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

// --- DỮ LIỆU NHÂN VẬT ---
const CHARACTERS = [
    { label: 'MC Ảo Minh Giang', value: 'mc_minh_giang', image: 'https://ui-avatars.com/api/?name=MG&background=0D8ABC&color=fff' },
    { label: 'MC Hữu Bằng', value: 'mc_huu_bang', image: 'https://ui-avatars.com/api/?name=HB&background=F56A00&color=fff' },
];

// --- CẤU HÌNH STEPS ---
const MODAL_STEPS = [
    { label: 'Cấu hình gen video', icon: <FileTextIcon /> },
    { label: 'Thử nghiệm', icon: <EyeIcon /> },
    { label: 'Cấu hình đăng', icon: <PaperPlaneIcon /> },
];

function CharacterSelect({ value, onChange }: { value: string, onChange: (val: string) => void }) {
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
                    "flex h-10 items-center justify-between rounded-md border bg-white px-3 py-2 text-sm cursor-pointer transition-colors",
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
                            className="flex h-7 w-7 items-center justify-center rounded-full text-[#33a8c0] hover:bg-[#e6f4f7] transition-colors"
                        >
                            <SpeakerIcon />
                        </button>
                    )}
                    <svg className={cn("ml-1 h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
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

// --- COMPONENTS FOR STEP 3 ---
const GlobeIcon = () => (
    <svg className="w-5 h-5 text-[#33a8c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TiktokIcon = () => (
    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.02-.33-.02-.66-.01-.99.14-2.12 1.28-4.14 3.02-5.36 1.23-.88 2.75-1.33 4.27-1.35.03 1.34.03 2.68.01 4.02-1.07.03-2.16.29-3.06.88-.71.46-1.28 1.15-1.5 1.97-.24.87-.14 1.83.31 2.62.4.73 1.05 1.3 1.8 1.62.77.34 1.64.41 2.46.22 1.24-.28 2.29-1.12 2.73-2.29.21-.55.29-1.14.28-1.72V.02z" />
    </svg>
);

const SiteTag = ({ label, platform }: { label: string, platform?: 'fb' | 'yt' | 'web' }) => {
    const iconColors = { fb: '1877F2', yt: 'FF0000', web: '33a8c0' };
    const bgColor = iconColors[platform || 'web'];
    return (
        <div className="flex items-center gap-1.5 rounded bg-[#eef8fa] px-2 py-1 text-xs text-gray-700 border border-[#d2f0f4]">
            <img src={`https://ui-avatars.com/api/?name=${label.charAt(0)}&background=${bgColor}&color=fff&size=16`} alt="" className="w-4 h-4 rounded-full" />
            <span className="font-medium whitespace-nowrap">{label}</span>
            <button type="button" className="text-gray-400 hover:text-gray-600 ml-0.5">✕</button>
        </div>
    );
};

const PlatformCard = ({
    title,
    icon,
    tags169,
    tags916,
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

    return (
        <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                {icon}
                <h3 className="font-bold text-gray-800">{title}</h3>
            </div>
            <div className="p-4 bg-[#fafbfc]">
                <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Video ngang 16:9</label>
                        <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2 min-h-[42px]">
                            {tags169.map(t => <SiteTag key={t} label={t} platform={platform} />)}
                            <input type="text" placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300 min-w-[80px]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Video dọc 9:16</label>
                        <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2 min-h-[42px]">
                            {tags916.map(t => <SiteTag key={t} label={t} platform={platform} />)}
                            <input type="text" placeholder={placeholder} className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300 min-w-[80px]" />
                        </div>
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
        console.log(files[0]);
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
        <div className="mx-auto flex h-[80vh] w-full max-w-5xl flex-col rounded-lg bg-white">
            {/* HEADER: Stepper */}
            <div className="shrink-0 border-b border-gray-100 px-0 pb-4 pt-0">
                <div className="flex w-full justify-center">
                    <Stepper steps={MODAL_STEPS} currentStep={currentStep} />
                </div>
            </div>

            {/* BODY: Nội dung cuộn được */}
            <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-0 py-0">
                {currentStep === 0 && (
                    <div className="animate-in fade-in flex flex-col gap-6 duration-300">
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
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-2">
                                        <Upload onFileSelect={handleFiles} />
                                    </div>
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
                                                    placeholder="Chọn số ngày"
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
                                    <div className="flex items-center rounded-md border border-gray-200 bg-[#F8F9FA] focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
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

                {/* ================= BƯỚC 1: THỬ NGHIỆM ================= */}
                {currentStep === 1 && (
                    <div className="animate-in fade-in flex flex-col duration-300 rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm flex-1 min-h-0">
                        <div className="bg-[#f3f6f9] shrink-0 px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Video thử nghiệm
                        </div>
                        <div className="custom-scrollbar p-4 flex flex-col gap-4 overflow-y-auto">
                            {/* Tabs */}
                            <div className="flex w-full rounded-md bg-[#f8f9fa] p-1 border border-gray-200">
                                <button
                                    type="button"
                                    className={cn("flex-1 rounded-sm py-2 text-sm font-medium transition-colors", videoRatio === '16:9' ? "bg-white text-[#33a8c0] shadow-sm" : "text-gray-600 hover:text-gray-900")}
                                    onClick={() => setVideoRatio('16:9')}
                                >
                                    Ngang 16:9
                                </button>
                                <button
                                    type="button"
                                    className={cn("flex-1 rounded-sm py-2 text-sm font-medium transition-colors", videoRatio === '9:16' ? "bg-white text-[#33a8c0] shadow-sm" : "text-gray-600 hover:text-gray-900")}
                                    onClick={() => setVideoRatio('9:16')}
                                >
                                    Dọc 9:16
                                </button>
                            </div>

                            {/* Preview Area */}
                            <div className={cn("flex flex-col items-center justify-center rounded-sm transition-all duration-300 overflow-hidden", videoRatio === '16:9' ? "aspect-video w-full" : "aspect-[9/16] w-[320px] mx-auto", isGenerated ? "bg-black border border-gray-200" : "bg-[#eaf8fb] border border-[#d2f0f4]", !isGenerated && videoRatio === '9:16' && "py-10")}>
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
                                        src="https://www.youtube.com/embed/GZ1gGW1B2JI?autoplay=1&mute=1"
                                        title="Video thử nghiệm"
                                        frameBorder="0"
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
                    <div className="animate-in fade-in flex flex-col gap-4 duration-300 px-4 pb-6">
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
                    className="flex min-w-[120px] items-center justify-center gap-2 bg-[#33a8c0] px-4 text-white transition-colors hover:bg-[#288b9e]"
                    onClick={currentStep === MODAL_STEPS.length - 1 ? onClose : handleNext}
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
