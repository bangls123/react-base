
export const SiteTag = ({ label, platform, onRemove }: { label: string, platform?: 'fb' | 'yt' | 'web', onRemove: () => void }) => {
    const iconColors = { fb: '1877F2', yt: 'FF0000', web: '33a8c0' };
    const bgColor = iconColors[platform || 'web'];
    return (
        <div className="flex items-center gap-1.5 rounded bg-[#eef8fa] px-2 py-1 text-xs text-gray-700 border border-[#d2f0f4]">
            <img src={`https://ui-avatars.com/api/?name=${label.charAt(0)}&background=${bgColor}&color=fff&size=16`} alt="" className="w-4 h-4 rounded-full" />
            <span className="font-medium whitespace-nowrap">{label}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-400 hover:text-gray-600 ml-0.5">✕</button>
        </div>
    );
};
