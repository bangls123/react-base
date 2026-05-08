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
import { useState } from 'react';

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

// --- CẤU HÌNH STEPS ---
const MODAL_STEPS = [
    { label: 'Cấu hình gen video', icon: <FileTextIcon /> },
    { label: 'Thử nghiệm', icon: <EyeIcon /> },
    { label: 'Cấu hình đăng', icon: <PaperPlaneIcon /> },
];

interface ModalCreationPageProps {
    onClose?: () => void;
}

function ModalCreationPage({ onClose }: ModalCreationPageProps) {
    // Quản lý Step hiện tại
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [watermarkPosition, setWatermarkPosition] = useState<string | number>('top_left');
    const [videoFrequency, setVideoFrequency] = useState<string | number>('daily');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        console.log(files[0]);
    };

    const handleNext = () => {
        if (currentStep < MODAL_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
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
                            <FormField label="Chọn loại model AI (LLM)" required>
                                <Select
                                    options={[
                                        { label: 'OpenAI/GPT-4', value: 'gpt4' },
                                        { label: 'OpenAI/GPT-5', value: 'gpt5' },
                                    ]}
                                />
                            </FormField>
                            <FormField label="Chọn vùng dữ liệu nội dung" required>
                                <Select
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
                            <FormField label="Chọn nhân vật" required>
                                <Select
                                    options={[
                                        { label: 'MC Ảo Minh Giang', value: 'mc_minh_giang' },
                                        { label: 'MC Hữu Bằng', value: 'mc_huu_bang' },
                                    ]}
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
                            <FormField label="Tần xuất tạo video" required>
                                <RadioGroup
                                    name="video_frequency"
                                    value={videoFrequency}
                                    onChange={setVideoFrequency}
                                    optionsWrapperClass="flex flex-row gap-6 space-y-0"
                                    options={[
                                        { label: 'Hàng ngày', value: 'daily' },
                                        { label: 'Cách ngày', value: 'every_other_day' },
                                        { label: 'Mỗi khi có dữ liệu mới', value: 'on_new_data' },
                                    ]}
                                />
                            </FormField>

                            <FormField label="Thời điểm" required>
                                <div className="flex items-center">
                                    <div className="flex items-center rounded-md border border-gray-200 bg-[#F8F9FA] focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
                                        <input
                                            placeholder="Giờ"
                                            className="w-16 bg-transparent py-2 text-center text-sm outline-none placeholder:text-gray-300"
                                        />
                                        <div className="h-4 w-[1px] bg-gray-200 shrink-0" />
                                        <input
                                            placeholder="Phút"
                                            className="w-16 bg-transparent py-2 text-center text-sm outline-none placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            className="h-[38px] border-l border-gray-200 bg-white px-4 text-sm font-medium text-[#0091D5] transition-all hover:bg-blue-50 active:bg-blue-100 outline-none"
                                        >
                                            Thêm giờ
                                        </button>
                                    </div>
                                </div>
                            </FormField>

                            <FormField label="Các mốc đã chọn">
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        06:00 <span className="cursor-pointer text-gray-500 hover:text-red-500">✕</span>
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        12:00 <span className="cursor-pointer text-gray-500 hover:text-red-500">✕</span>
                                    </Badge>
                                </div>
                            </FormField>
                            <div className="flex gap-6">
                                <FormField label="Ngày bắt đầu">
                                    <DateInputTrigger className="w-full" />
                                </FormField>
                                <FormField label="Ngày kết thúc">
                                    <DateInputTrigger className="w-full" />
                                </FormField>
                            </div>
                        </FormSection>
                    </div>
                )}

                {/* ================= BƯỚC 1: THỬ NGHIỆM ================= */}
                {currentStep === 1 && (
                    <div className="animate-in fade-in flex flex-col gap-6 duration-300">
                        <FormSection title="Xem trước video thử nghiệm">
                            <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 text-gray-500">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl">🎬</div>
                                    <p>Video preview sẽ hiển thị tại đây</p>
                                    <Button className="mt-4 bg-primary-600 text-white hover:bg-primary-700">
                                        Tạo thử video
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <FormField label="Ghi chú thử nghiệm">
                                    <Input placeholder="Nhập ghi chú cho bản thử nghiệm này..." />
                                </FormField>
                            </div>
                        </FormSection>
                    </div>
                )}

                {/* ================= BƯỚC 2: CẤU HÌNH ĐĂNG ================= */}
                {currentStep === 2 && (
                    <div className="animate-in fade-in flex flex-col gap-6 duration-300">
                        <FormSection title="Thiết lập kênh đăng bài">
                            <FormField label="Chọn nền tảng">
                                <Select
                                    options={[
                                        { label: 'Facebook Page', value: 'fb' },
                                        { label: 'Youtube Channel', value: 'yt' },
                                        { label: 'TikTok', value: 'tt' },
                                    ]}
                                />
                            </FormField>
                            <FormField label="Tiêu đề video mặc định">
                                <Input placeholder="VD: Bản tin thời tiết ngày {{date}}" />
                            </FormField>
                            <FormField label="Mô tả (Caption)">
                                <textarea
                                    className="min-h-[120px] w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Nhập nội dung mô tả video. Bạn có thể sử dụng các biến như {{date}}, {{time}}..."
                                />
                            </FormField>
                        </FormSection>
                    </div>
                )}
            </div>

            {/* FOOTER: Buttons */}
            <div className="flex shrink-0 items-center justify-center gap-3 rounded-b-lg border-t border-gray-200 bg-white py-4 pb-0">
                {/* Nút Đóng */}
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

                {/* Nút Quay lại - Hiển thị từ bước 2 trở đi */}
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

                {/* Nút Tiếp theo / Hoàn thành */}
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
