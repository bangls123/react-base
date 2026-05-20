import React, { useState, useRef } from 'react';

interface TabFileProps {
    onSave: (name: string, content: string, type: 'file') => void;
}

export const TabFile: React.FC<TabFileProps> = ({ onSave }) => {
    const [templateName, setTemplateName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileError('');
        if (!file) return;

        if (!file.name.endsWith('.html') && file.type !== 'text/html') {
            setFileError('Chỉ chấp nhận file định dạng .html');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setFileContent(text);
            setFileName(file.name);
            if (!templateName) {
                setTemplateName(file.name.replace(/\.[^/.]+$/, ""));
            }
        };
        reader.onerror = () => {
            setFileError('Lỗi đọc file. Vui lòng thử lại.');
        };
        reader.readAsText(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileContent) {
            setFileError('Vui lòng chọn một file HTML hợp lệ.');
            return;
        }

        const nameToSave = templateName.trim() || fileName || 'Mẫu tải lên không tên';
        onSave(nameToSave, fileContent, 'file');

        // Clear form
        setTemplateName('');
        setFileContent('');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                    placeholder="Tên mẫu (mặc định lấy tên file)"
                    className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                    Chọn file HTML nguồn
                </label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`dotted-zone border border-obsidian-border rounded-xl bg-obsidian-container/30 hover:bg-obsidian-container/50 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center ${
                        fileName ? 'border-emerald-500/40 bg-emerald-500/5' : ''
                    }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".html,text/html"
                        className="hidden"
                    />
                    {fileName ? (
                        <>
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <p className="text-sm font-semibold mb-1 text-emerald-400 break-all px-4">{fileName}</p>
                            <p className="text-xs text-obsidian-text-dim">Nhấp để thay đổi file khác</p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-blue-500/10 text-obsidian-accent rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                            </div>
                            <p className="text-sm font-semibold mb-1">Kéo thả hoặc nhấp để chọn file .html</p>
                            <p className="text-xs text-obsidian-text-dim">Kích thước file khuyến nghị &lt; 2MB</p>
                        </>
                    )}
                </div>
                {fileError && <p className="mt-2 text-xs text-red-500 font-semibold">{fileError}</p>}
            </div>

            <button
                type="submit"
                disabled={!fileContent}
                className="w-full bg-obsidian-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Lưu mẫu từ file
            </button>
        </form>
    );
};
