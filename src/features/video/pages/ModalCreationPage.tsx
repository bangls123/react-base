import { Button, Stepper } from '@/shared/components';
import { useState } from 'react';
import { FileTextIcon, EyeIcon, SendIcon, CheckIcon, NextIcon, BackIcon, CloseIcon } from '@/shared/icons';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { videoConfigSchema, type VideoConfigFormData } from '../schema';

import { VideoConfigStep } from '../components/VideoConfigStep';
import { VideoPreviewStep } from '../components/VideoPreviewStep';
import { PublishConfigStep } from '../components/PublishConfigStep';
import { STEP_INDEX } from '../constants';

const MODAL_STEPS = [
    { label: 'Cấu hình gen video', icon: <FileTextIcon />, isFormValidationRequired: true },
    { label: 'Thử nghiệm', icon: <EyeIcon />, isFormValidationRequired: false },
    { label: 'Cấu hình đăng', icon: <SendIcon />, isFormValidationRequired: false },
];

interface ModalCreationPageProps {
    onClose?: () => void;
}

export default function ModalCreationPage({ onClose }: ModalCreationPageProps) {
    const methods = useForm<VideoConfigFormData>({
        resolver: zodResolver(videoConfigSchema),
        defaultValues: {
            aiModel: '', dataSource: '', character: 'mc_minh_giang',
            watermarkPreviews: [], watermarkPosition: 'top_left',
            videoFrequency: 'daily', frequencyDays: '', selectedTimes: ['06:00', '12:00'],
            startDate: null, endDate: null,
        }
    });
    const [currentStep, setCurrentStep] = useState<number>(STEP_INDEX.CONFIG);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const isLastStep = currentStep === MODAL_STEPS.length - 1;
    const isNextButtonDisabled = currentStep === STEP_INDEX.PREVIEW && !isVideoReady;
    const handleNext = async () => {
        if (MODAL_STEPS[currentStep].isFormValidationRequired) {
            const isValid = await methods.trigger();
            if (!isValid) return;
        }

        if (currentStep < MODAL_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    return (
        <FormProvider {...methods}>
            <div className="mx-auto flex h-[960px] max-h-[80vh] w-full max-w-[880px] flex-col rounded-lg bg-white">
                <div className="shrink-0 border-b border-gray-100 px-0 pb-4 pt-0">
                    <div className="flex w-full justify-center">
                        <Stepper steps={MODAL_STEPS} currentStep={currentStep} />
                    </div>
                </div>
                <div className="custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-0 py-0">
                    {currentStep === STEP_INDEX.CONFIG && <VideoConfigStep />}
                    {currentStep === STEP_INDEX.PREVIEW && (
                        <VideoPreviewStep
                            onGeneratedStatusChange={setIsVideoReady}
                        />
                    )}
                    {currentStep === STEP_INDEX.PUBLISH && <PublishConfigStep />}
                </div>
                <div className="flex shrink-0 items-center justify-center gap-3 rounded-b-lg border-t border-gray-200 bg-white py-4 pb-0">
                    <Button
                        variant="outline"
                        type="button"
                        className="flex min-w-[100px] items-center justify-center gap-2 border-gray-300 px-4 text-gray-600"
                        onClick={onClose}
                    >
                        <CloseIcon />
                        Đóng
                    </Button>
                    {currentStep > 0 && (
                        <Button
                            variant="outline"
                            type="button"
                            className="flex min-w-[100px] items-center justify-center gap-2 border-gray-300 px-4 text-gray-600"
                            onClick={handleBack}
                        >
                            <BackIcon />
                            Quay lại
                        </Button>
                    )}
                    <Button
                        type="button"
                        className="flex min-w-[120px] items-center justify-center gap-2 bg-[#33a8c0] px-4 text-white transition-colors hover:bg-[#288b9e] disabled:bg-[#C2C2C2] disabled:hover:bg-[#C2C2C2] disabled:opacity-100 disabled:cursor-not-allowed"
                        onClick={isLastStep ? onClose : handleNext}
                        disabled={isNextButtonDisabled}
                    >
                        {isLastStep ? (
                            <>
                                <CheckIcon />
                                Lưu và bắt đầu chạy
                            </>
                        ) : (
                            <>
                                <NextIcon />
                                Tiếp theo
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}