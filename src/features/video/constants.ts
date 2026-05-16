export const CHARACTERS = [
    { label: 'MC Ảo Minh Giang', value: 'mc_minh_giang', image: 'https://ui-avatars.com/api/?name=MG&background=0D8ABC&color=fff' },
    { label: 'MC Hữu Bằng', value: 'mc_huu_bang', image: 'https://ui-avatars.com/api/?name=HB&background=F56A00&color=fff' },
] as const;

export const TAG_SUGGESTIONS = [
    'Mực Tím',
    'Báo Tuổi Trẻ',
    'Truyền hình - Báo Tuổi Trẻ',
    'Tuổi Trẻ Cười',
    'Thanh Niên',
    'VNExpress',
    'Dân Trí',
    'VTV',
    'Zing News',
    'Tin Tức 24h'
] as const;

export const STEP_INDEX = {
    CONFIG: 0,
    PREVIEW: 1,
    PUBLISH: 2,
} as const;

export type StepIndexType = typeof STEP_INDEX[keyof typeof STEP_INDEX];
