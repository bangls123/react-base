import * as React from 'react';
import './Stepper.css';

type Step = {
    label: string;
    icon: React.ReactNode;
};

type Props = {
    steps: Step[];
    currentStep: number;
};

// Giữ nguyên các SVG icon của bạn (với className="h-4 w-4")
const FileTextIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const EyeIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const PaperPlaneIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const defaultSteps: Step[] = [
    { label: 'Cấu hình gen video', icon: <FileTextIcon /> },
    { label: 'Thử nghiệm', icon: <EyeIcon /> },
    { label: 'Cấu hình đăng', icon: <PaperPlaneIcon /> },
];

export const Stepper = ({ steps = defaultSteps, currentStep }: Props) => {
    return (
        <div className="stepper-container">
            {steps.map((step, index) => {
                let statusClass = 'step-item--inactive';
                let isNextActive = false;

                if (index === currentStep) {
                    statusClass = 'step-item--active';
                } else if (index < currentStep) {
                    statusClass = 'step-item--inactive';
                    if (index === currentStep - 1) {
                        isNextActive = true;
                    }
                }
                return (
                    <div
                        key={step.label}
                        className={`step-item ${statusClass} ${isNextActive ? 'next-is-active' : ''}`}
                        style={{ zIndex: steps.length - index }}
                    >
                        <span className="step-content">
                            {step.icon}
                            <span className="mt-[2px] leading-none">{step.label}</span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};