import { z } from 'zod';

export const videoConfigSchema = z.object({
    aiModel: z.string().min(1, 'Vui lòng chọn loại model AI'),
    dataSource: z.string().min(1, 'Vui lòng chọn vùng dữ liệu nội dung'),
    character: z.string().min(1, 'Vui lòng chọn nhân vật'),
    watermarkPreviews: z.array(z.string()),
    watermarkPosition: z.union([z.string(), z.number()]),
    videoFrequency: z.union([z.string(), z.number()]),
    frequencyDays: z.union([z.string(), z.number()]).optional(),
    selectedTimes: z.array(z.string()).min(1, 'Vui lòng thêm ít nhất một thời điểm'),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
}).refine((data) => {
    if (data.videoFrequency === 'every_other_day' && (!data.frequencyDays || data.frequencyDays === '')) {
        return false;
    }
    return true;
}, {
    message: 'Vui lòng chọn số ngày',
    path: ['frequencyDays']
}).refine((data) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
        return false;
    }
    return true;
}, {
    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
    path: ['endDate']
});

export type VideoConfigFormData = z.infer<typeof videoConfigSchema>;
