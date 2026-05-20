import React, { useState, useEffect, useRef } from 'react';

interface LandingPageTemplate {
    id: string;
    name: string;
    type: 'file' | 'code' | 'url';
    content: string;
    createdAt: string;
    thumbnailUrl?: string;
}

function ModalImportForm() {
    // Tab states
    const [activeTab, setActiveTab] = useState<'file' | 'code' | 'url'>('file');
    // Form input states
    const [templateName, setTemplateName] = useState('');
    // File upload state
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Code snippet state
    const [htmlCode, setHtmlCode] = useState('');
    const [codeError, setCodeError] = useState('');
    // URL state
    const [htmlUrl, setHtmlUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    // Templates state
    const [templates, setTemplates] = useState<LandingPageTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

    // Preview state
    const [previewTemplate, setPreviewTemplate] = useState<LandingPageTemplate | null>(null);

    // Feedback messages
    const [successMsg, setSuccessMsg] = useState('');

    // Closed state
    const [isClosed, setIsClosed] = useState(true);

    // Load templates from localStorage on mount (and pre-populate presets if empty)
    useEffect(() => {
        const savedTemplates = localStorage.getItem('imported_landing_page_templates');
        let initialTemplates: LandingPageTemplate[] = [];

        if (savedTemplates) {
            try {
                initialTemplates = JSON.parse(savedTemplates);
            } catch (e) {
                console.error('Failed to parse saved templates:', e);
            }
        }

        if (initialTemplates.length === 0) {
            initialTemplates = [
                {
                    id: 'preset_saas',
                    name: 'SaaS Dashboard Pro',
                    type: 'code',
                    content: `<!DOCTYPE html>
                <html>
                <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                </head>
                <body class="bg-slate-900 text-white font-sans p-8">
                <div class="max-w-4xl mx-auto">
                    <header class="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
                    <div class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">SaaSify Pro</div>
                    <div class="space-x-4">
                        <a href="#" class="text-slate-400 hover:text-white">Features</a>
                        <a href="#" class="text-slate-400 hover:text-white">Pricing</a>
                        <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold">Get Started</button>
                    </div>
                    </header>
                    <main class="text-center py-20">
                    <span class="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">New Version 2.0</span>
                    <h1 class="text-5xl font-extrabold mb-6 leading-tight mt-4">Supercharge Your Business Workflow</h1>
                    <p class="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">Integrate all your tools, track real-time metrics, and automate daily tasks with our secure cloud dashboard.</p>
                    <div class="flex justify-center gap-4">
                        <button class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20">Try for Free</button>
                        <button class="border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-800">Book a Demo</button>
                    </div>
                    </main>
                </div>
                </body>
                </html>`,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmPYxEV2Dqf8_gljD4SkEbGaHfRYT-ZJP8ZGno-X0kGWXOGzcDskFR9AZC6PSqRwMWMxd0Lcng3Ix3MCswAjqL5u2x3H_-VaYOb1uuiJEx0lPy4JCR1Nw9Q4N4ImShHNAtKhPvTkP3tmuUex2dleoXJO_c3LOuffHtGOd0mP_doyaREZI3dS9e5lUkVtTUlSgNqZVq32gVQRZ5HGat15akT84DHnibIHrVeE6vSapnItzAWxHHBS3srLXu9ezKODD7w-ql5UeiQj0'
                },
                {
                    id: 'preset_tech',
                    name: 'TechBase Landing',
                    type: 'code',
                    content: `<!DOCTYPE html>
                <html>
                <head>
                <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-black text-white font-mono p-8">
                <div class="max-w-4xl mx-auto py-12">
                    <div class="border border-green-500/30 p-8 rounded-xl bg-zinc-950">
                    <div class="text-green-500 mb-4">$ npm init techbase-app</div>
                    <h1 class="text-4xl font-bold mb-4 text-slate-100">Next-Gen Developer Platform</h1>
                    <p class="text-slate-400 mb-6">Build, deploy, and scale serverless functions globally with zero configuration.</p>
                    <button class="bg-green-500 text-black font-bold px-6 py-3 rounded hover:bg-green-400">Deploy Now</button>
                    </div>
                </div>
                </body>
                </html>`,
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM1DVihGmznMB3utIyh9KnxXhwqMnmPPwgVitoHaPVR2eCQBLJY5b_kiWLgR36rklixL888rkYpPfVT45_BicBL0NMPtqAEKKtc6acJw8OVv9IhSxWY8yBAKnF5SiS7iYTUGNZx8_-ZF5deVGZqG6R_kvikPnFSOM0IlLDVjgHsQNY_rAlaO2TxcstH7THwiVx96IBSyY4CXXHxLWWkLlMS5SEaLzX4Cb2N2YHZErs1LmV8meJNLKRef0LUGMTE65AnyTDlrVwQCU'
                },
                {
                    id: 'preset_agency',
                    name: 'Creative Agency',
                    type: 'code',
                    content: `<!DOCTYPE html>
                    <html>
                    <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
                    </head>
                    <body class="bg-amber-50 text-stone-900 font-sans p-8">
                    <div class="max-w-4xl mx-auto py-12">
                        <span class="text-xs font-bold tracking-widest text-amber-600 uppercase">We are Studio-X</span>
                        <h1 class="text-6xl font-black mt-2 mb-6 text-stone-900">We craft digital experiences that matter.</h1>
                        <p class="text-lg text-stone-600 mb-8 max-w-xl">A full-service creative agency specializing in brand strategy, visual identity, and high-performance websites.</p>
                        <a href="#" class="inline-block bg-stone-900 text-white font-bold px-8 py-4 rounded-full hover:bg-stone-800">Our Portfolio</a>
                    </div>
                    </body>
                    </html>`,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
                    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLFUiAZT-Cq7HvLE8B3X9D8ceiClDofeowcmDER2RsKpTJQTr03prPNx8NtI37jepZdfAQSbG7e74h9MSfLBdW_g9Fkjz9QerCsfF0Hj_LDyBS54lsxwfejQHGopY3CerrFmapo_cuvgzxz6GwC9HC1xpXZf8OhQ9gU5XRhTKE73MT1dHIjmVGLLBUf-HAvP0PiEUsstsG7z7eK48j-gHq0thX5CS_rH_RZct5_5uPWPivQhwgCoE7xhDuIHTh3vspszMIbcHdA2M'
                }
            ];
            localStorage.setItem('imported_landing_page_templates', JSON.stringify(initialTemplates));
        }

        setTemplates(initialTemplates);

        const activeId = localStorage.getItem('active_landing_page_template_id');
        if (activeId) {
            setSelectedTemplateId(activeId);
        } else if (initialTemplates.length > 0) {
            setSelectedTemplateId(initialTemplates[0].id);
            localStorage.setItem('active_landing_page_template_id', initialTemplates[0].id);
        }
    }, []);

    // Save templates helper
    const saveTemplatesToStorage = (newTemplates: LandingPageTemplate[]) => {
        setTemplates(newTemplates);
        localStorage.setItem('imported_landing_page_templates', JSON.stringify(newTemplates));
    };

    // Close modal state
    const handleClose = () => {
        setIsClosed(true);
    };

    // Handle file upload
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

    const handleSaveFileTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileContent) {
            setFileError('Vui lòng chọn một file HTML hợp lệ.');
            return;
        }

        const nameToSave = templateName.trim() || fileName || 'Mẫu tải lên không tên';
        const newTemplate: LandingPageTemplate = {
            id: `tmpl_${Date.now()}`,
            name: nameToSave,
            type: 'file',
            content: fileContent,
            createdAt: new Date().toISOString(),
        };

        const updated = [newTemplate, ...templates];
        saveTemplatesToStorage(updated);

        // Clear form
        setTemplateName('');
        setFileContent('');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';

        showToast('Tải lên file mẫu thành công!');
    };

    // Handle code snippet
    const handleSaveCodeTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        setCodeError('');

        if (!htmlCode.trim()) {
            setCodeError('Vui lòng nhập đoạn mã HTML.');
            return;
        }

        const nameToSave = templateName.trim() || `Mẫu mã nguồn #${templates.length + 1}`;
        const newTemplate: LandingPageTemplate = {
            id: `tmpl_${Date.now()}`,
            name: nameToSave,
            type: 'code',
            content: htmlCode,
            createdAt: new Date().toISOString(),
        };

        const updated = [newTemplate, ...templates];
        saveTemplatesToStorage(updated);

        setTemplateName('');
        setHtmlCode('');

        showToast('Lưu đoạn mã HTML thành công!');
    };

    // Handle URL
    const handleSaveUrlTemplate = (e: React.FormEvent) => {
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
        const newTemplate: LandingPageTemplate = {
            id: `tmpl_${Date.now()}`,
            name: nameToSave,
            type: 'url',
            content: htmlUrl,
            createdAt: new Date().toISOString(),
        };

        const updated = [newTemplate, ...templates];
        saveTemplatesToStorage(updated);

        setTemplateName('');
        setHtmlUrl('');

        showToast('Lưu URL mẫu thành công!');
    };

    // Select template
    const handleSelectTemplate = (id: string) => {
        setSelectedTemplateId(id);
        localStorage.setItem('active_landing_page_template_id', id);
        const t = templates.find(x => x.id === id);
        showToast(`Đã chọn làm mẫu hiện tại: ${t?.name}`);
    };

    // Delete template
    const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = templates.filter(t => t.id !== id);
        saveTemplatesToStorage(updated);
        if (selectedTemplateId === id) {
            setSelectedTemplateId('');
            localStorage.removeItem('active_landing_page_template_id');
        }
        showToast('Đã xóa mẫu thành công!');
    };

    // Toast feedback
    const showToast = (message: string) => {
        setSuccessMsg(message);
        setTimeout(() => {
            setSuccessMsg('');
        }, 3000);
    };

    // Format relative time helper
    const formatRelativeTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / (60 * 1000));
            const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
            const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

            if (diffMins < 60) {
                return `Cập nhật ${diffMins || 1} phút trước`;
            } else if (diffHours < 24) {
                return `Cập nhật ${diffHours} giờ trước`;
            } else if (diffDays === 1) {
                return 'Cập nhật Hôm qua';
            } else {
                return `Cập nhật ngày ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            }
        } catch {
            return 'Cập nhật gần đây';
        }
    };

    if (isClosed) {
        return (
            <div className="min-h-[calc(100vh-140px)] w-full flex items-start justify-center pt-8 md:pt-14 p-4 text-white font-sans">
                <div className="text-center p-8 bg-obsidian-surface rounded-2xl border border-obsidian-border shadow-2xl max-w-md">
                    <button
                        onClick={() => setIsClosed(false)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 mx-auto"
                    >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        Tạo mới Landing Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-140px)] w-full flex items-start justify-center pt-8 md:pt-14 p-4 font-sans text-white">
            {/* Main Modal Card */}
            <main className="w-full max-w-5xl bg-obsidian-surface text-white rounded-2xl shadow-2xl overflow-hidden border border-obsidian-border flex flex-col relative" id="landing-page-modal">

                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-obsidian-border bg-obsidian-surface">
                    <h1 className="text-xl font-semibold tracking-tight">Chọn mẫu Landing Page</h1>
                    <button
                        onClick={handleClose}
                        aria-label="Đóng"
                        className="p-1 hover:bg-obsidian-surface-bright rounded-full transition-colors text-obsidian-text-dim hover:text-white"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                    </button>
                </header>

                {/* Dynamic Toast banner inside modal header area */}
                {successMsg && (
                    <div className="absolute top-[68px] left-6 right-6 z-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn shadow-lg shadow-emerald-500/5">
                        <svg className="w-4.5 h-4.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                    {/* Left Column: Create New */}
                    <section className="p-6 border-r border-b md:border-b-0 border-obsidian-border flex flex-col h-full overflow-hidden rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                        <h2 className="text-sm font-bold text-obsidian-text-dim uppercase tracking-widest mb-4">Tạo mẫu mới</h2>

                        {/* Tabs Selector */}
                        <div className="flex bg-obsidian-container p-1 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => { setActiveTab('file'); setTemplateName(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === 'file'
                                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                                    : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                                    }`}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                                File HTML
                            </button>
                            <button
                                type="button"
                                onClick={() => { setActiveTab('code'); setTemplateName(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === 'code'
                                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                                    : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                                    }`}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                                Mã Code HTML
                            </button>
                            <button
                                type="button"
                                onClick={() => { setActiveTab('url'); setTemplateName(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === 'url'
                                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                                    : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                                    }`}
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                                Đường dẫn URL
                            </button>
                        </div>

                        {/* Template name input */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                                Tên mẫu thiết kế (không bắt buộc)
                            </label>
                            <input
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder={
                                    activeTab === 'file' ? 'Tên mẫu (mặc định lấy tên file)' :
                                        activeTab === 'code' ? 'Ví dụ: Trang quảng cáo sản phẩm' :
                                            'Ví dụ: Landing page Lexus LX600'
                                }
                                className="w-full bg-obsidian-surface-bright/20 border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-white focus:bg-obsidian-surface-bright/40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                            />
                        </div>

                        {/* Tab Inputs */}
                        <div className="flex-1 min-h-[220px]">
                            {activeTab === 'file' && (
                                <form onSubmit={handleSaveFileTemplate} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-obsidian-text-dim uppercase tracking-wider mb-2">
                                            Chọn file HTML nguồn
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`dotted-zone border border-obsidian-border rounded-xl bg-obsidian-container/30 hover:bg-obsidian-container/50 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center ${fileName ? 'border-emerald-500/40 bg-emerald-500/5' : ''
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
                            )}

                            {activeTab === 'code' && (
                                <form onSubmit={handleSaveCodeTemplate} className="space-y-6">
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
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                        </svg>
                                        Lưu mẫu từ mã code
                                    </button>
                                </form>
                            )}

                            {activeTab === 'url' && (
                                <form onSubmit={handleSaveUrlTemplate} className="space-y-6">
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
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                        </svg>
                                        Lưu liên kết URL
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>

                    {/* Right Column: Templates List */}
                    <section className="p-6 bg-[#091020]/40 flex flex-col h-[560px] overflow-hidden rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl" data-purpose="template-list-section">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-obsidian-text-dim uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">history</span>
                                DANH SÁCH MẪU ĐÃ TẢI
                            </h2>
                            <span className="text-[10px] font-bold bg-obsidian-container border border-obsidian-border text-obsidian-text-dim px-2.5 py-0.5 rounded-full">
                                {templates.length} Mẫu
                            </span>
                        </div>

                        {/* List scroll container */}
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2" data-purpose="template-history-list">
                            {templates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-obsidian-border rounded-xl bg-obsidian-container/10 p-6">
                                    <span className="material-symbols-outlined text-3xl text-obsidian-text-dim mb-3">folder_open</span>
                                    <p className="text-xs font-semibold text-white">Chưa có mẫu nào</p>
                                    <p className="text-[10px] text-obsidian-text-dim mt-1 max-w-[200px]">Hãy thêm mẫu mới từ bảng điều khiển bên trái.</p>
                                </div>
                            ) : (
                                templates.map((template) => {
                                    const isSelected = selectedTemplateId === template.id;
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template.id)}
                                            className={`flex items-center gap-4 p-3 rounded-xl bg-obsidian-container/30 border transition-all cursor-pointer group relative ${isSelected
                                                ? 'border-obsidian-accent bg-obsidian-container/60 shadow-md shadow-blue-500/5'
                                                : 'border-obsidian-border hover:bg-obsidian-container/60 hover:border-obsidian-accent/50'
                                                }`}
                                        >
                                            {/* Thumbnail Image/Placeholder */}
                                            <div className="w-16 h-12 rounded-md overflow-hidden flex-shrink-0 bg-obsidian-surface-bright border border-obsidian-border flex items-center justify-center">
                                                {template.thumbnailUrl ? (
                                                    <img
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                        src={template.thumbnailUrl}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-wider ${template.type === 'file'
                                                        ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400'
                                                        : template.type === 'code'
                                                            ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400'
                                                            : 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400'
                                                        }`}>
                                                        {template.type}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detail text */}
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <span className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-obsidian-accent font-bold' : 'text-white group-hover:text-obsidian-accent'
                                                    }`}>
                                                    {template.name}
                                                </span>
                                                <span className="text-[10px] text-obsidian-text-dim mt-0.5">
                                                    {formatRelativeTime(template.createdAt)}
                                                </span>
                                            </div>

                                            {/* Action buttons (Right-aligned) */}
                                            <div className="flex items-center gap-1.5 shrink-0 z-10">
                                                {/* Preview button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}
                                                    className="w-7.5 h-7.5 bg-obsidian-surface-bright hover:bg-slate-700 text-obsidian-text-dim hover:text-white border border-obsidian-border rounded-lg flex items-center justify-center transition-colors"
                                                    title="Xem trước mẫu"
                                                >
                                                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                                                </button>

                                                {/* Active Selection / Use Button */}
                                                {isSelected ? (
                                                    <div className="w-7.5 h-7.5 bg-blue-500/10 border border-blue-500/30 text-obsidian-accent rounded-lg flex items-center justify-center" title="Mẫu đang chọn">
                                                        <span className="material-symbols-outlined text-[15px]">check</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template.id); }}
                                                        className="w-7.5 h-7.5 bg-obsidian-surface-bright hover:bg-blue-500/10 text-obsidian-text-dim hover:text-obsidian-accent border border-obsidian-border rounded-lg flex items-center justify-center transition-colors"
                                                        title="Sử dụng mẫu này"
                                                    >
                                                        <span className="material-symbols-outlined text-[15px]">check</span>
                                                    </button>
                                                )}

                                                {/* Delete button (only allow deletion for custom items, not presets) */}
                                                {template.id !== 'preset_saas' && template.id !== 'preset_tech' && template.id !== 'preset_agency' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                        className="w-7.5 h-7.5 bg-obsidian-surface-bright hover:bg-red-500/10 text-obsidian-text-dim hover:text-red-500 border border-obsidian-border rounded-lg flex items-center justify-center transition-colors"
                                                        title="Xóa mẫu"
                                                    >
                                                        <span className="material-symbols-outlined text-[15px]">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                </div>
            </main>

            {/* High-fidelity dark preview modal dialog */}
            {previewTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                    {/* Backdrop overlay */}
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                        onClick={() => setPreviewTemplate(null)}
                    />

                    {/* Content container */}
                    <div className="relative z-50 w-full max-w-4xl h-[80vh] flex flex-col bg-obsidian-surface text-white rounded-2xl border border-obsidian-border shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-border bg-obsidian-surface">
                            <h3 className="text-lg font-semibold text-white">Xem trước: {previewTemplate.name}</h3>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-1 hover:bg-obsidian-surface-bright rounded-full transition-colors text-obsidian-text-dim hover:text-white"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Sub-header info bar */}
                        <div className="bg-[#091020]/60 border-b border-obsidian-border px-6 py-2.5 flex items-center justify-between text-xs text-obsidian-text-dim">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-obsidian-surface-bright text-white text-[9px] font-bold uppercase tracking-wider">
                                    {previewTemplate.type}
                                </span>
                                <span className="font-mono truncate max-w-[400px]">
                                    {previewTemplate.type === 'url' ? previewTemplate.content : 'Mã HTML nguồn'}
                                </span>
                            </div>
                            <div>
                                Độ rộng khung: <span className="font-semibold text-white">100% (Responsive)</span>
                            </div>
                        </div>

                        {/* Embedded Iframe body */}
                        <div className="flex-1 bg-white overflow-hidden min-h-[300px]">
                            {previewTemplate.type === 'url' ? (
                                <iframe
                                    src={previewTemplate.content}
                                    title={previewTemplate.name}
                                    className="w-full h-full border-0"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            ) : (
                                <iframe
                                    srcDoc={previewTemplate.content}
                                    title={previewTemplate.name}
                                    className="w-full h-full border-0"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 py-4 border-t border-obsidian-border flex justify-end gap-3 bg-obsidian-container/20">
                            <button
                                type="button"
                                onClick={() => setPreviewTemplate(null)}
                                className="px-4 py-2 border border-obsidian-border rounded-xl text-sm font-semibold hover:bg-obsidian-surface-bright transition-colors text-white"
                            >
                                Đóng xem trước
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleSelectTemplate(previewTemplate.id);
                                    setPreviewTemplate(null);
                                }}
                                className="px-4 py-2 bg-obsidian-accent hover:bg-blue-600 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Sử dụng mẫu này
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ModalImportForm;
