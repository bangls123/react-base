import React, { useState } from 'react';

interface TabUrlProps {
    onSave: (name: string, content: string, type: 'url') => void;
}

export const TabUrl: React.FC<TabUrlProps> = ({ onSave }) => {
    const [templateName, setTemplateName] = useState('');
    const [htmlUrl, setHtmlUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUrlError('');

        if (!htmlUrl.trim()) {
            setUrlError('Vui lòng nhập URL HTML.');
            return;
        }

        try {
            new URL(htmlUrl);
        } catch (_) {
            setUrlError('Địa chỉ URL không hợp lệ. Vui lòng kiểm tra lại (ví dụ: https://example.com)');
            return;
        }

        const nameToSave = templateName.trim() || new URL(htmlUrl).hostname || 'Mẫu liên kết URL';
        onSave(nameToSave, htmlUrl, 'url');

        setTemplateName('');
        setHtmlUrl('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template name input */}
            <div>
                <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                    Tên mẫu thiết kế (không bắt buộc)
                </label>
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ví dụ: Landing page Lexus LX600"
                    className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                    Đường dẫn URL HTML
                </label>
                <input
                    type="text"
                    value={htmlUrl}
                    onChange={(e) => setHtmlUrl(e.target.value)}
                    placeholder="https://example.com/landing-page"
                    className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                />
                {urlError && <p className="mt-2 text-xs text-red-500 font-semibold">{urlError}</p>}
                <p className="mt-3 text-[10px] text-obsidian-text-dim leading-normal bg-obsidian-container/30 p-2.5 rounded-xl border border-obsidian-border">
                    <strong>Lưu ý:</strong> Một số trang web có thể chặn nhúng xem trước Iframe do chính sách bảo mật bảo vệ (CORS/X-Frame-Options).
                </p>
            </div>

            <button
                type="submit"
                disabled={!htmlUrl.trim()}
                className="w-full bg-obsidian-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
                Mở Editor Landing Page
            </button>
        </form>
    );
};
