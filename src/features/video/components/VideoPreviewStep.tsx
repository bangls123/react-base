import { useState, useEffect } from 'react';
import { Button } from '@/shared/components';
import { cn } from '@/utils/cn';

interface VideoPreviewStepProps {
    onGeneratedStatusChange: (status: boolean) => void;
}

export function VideoPreviewStep({ onGeneratedStatusChange }: VideoPreviewStepProps) {

    const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(true);
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        if (!isGenerating) return;

        if (progress < 100) {
            const timer = setTimeout(() => {
                setProgress((prev) => prev + 5);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsGenerating(false);
            setIsGenerated(true);
            onGeneratedStatusChange(true);
        }
    }, [isGenerating, progress, onGeneratedStatusChange]);

    useEffect(() => {
        return () => onGeneratedStatusChange(false);
    }, [onGeneratedStatusChange]);

    const handleCancel = () => {
        setIsGenerating(false);
        setProgress(0);
        setIsGenerated(false);
        onGeneratedStatusChange(false);
    };

    const handleRetry = () => {
        setIsGenerating(true);
        setProgress(0);
        setIsGenerated(false);
        onGeneratedStatusChange(false);
    };

    return (
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
                                onClick={handleCancel}
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
                                onClick={handleRetry}
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
    );
}