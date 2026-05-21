import React, { useState } from 'react';

interface TabCodeProps {
    onSave: (name: string, content: string, type: 'code') => void;
    templateCount: number;
}

export const TabCode: React.FC<TabCodeProps> = ({ onSave, templateCount }) => {
    const [templateName, setTemplateName] = useState('');
    const [htmlCode, setHtmlCode] = useState('');
    const [codeError, setCodeError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCodeError('');

        if (!htmlCode.trim()) {
            setCodeError('Vui lòng nhập đoạn mã HTML.');
            return;
        }

        const nameToSave = templateName.trim() || `Mẫu mã nguồn #${templateCount + 1}`;
        onSave(nameToSave, htmlCode, 'code');

        setTemplateName('');
        setHtmlCode('');
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
                    placeholder="Ví dụ: Trang quảng cáo sản phẩm"
                    className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                    Mã nguồn HTML
                </label>
                <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="<html>&#10;  <body>&#10;    <h1>Xin chào</h1>&#10;  </body>&#10;</html>"
                    className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-xs font-mono min-h-[160px] max-h-[220px] text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                />
                {codeError && <p className="mt-2 text-xs text-red-500 font-semibold">{codeError}</p>}
            </div>

            <button
                type="submit"
                disabled={!htmlCode.trim()}
                className="w-full bg-obsidian-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
                Mở Editor Landing Page
            </button>
        </form>
    );
};
