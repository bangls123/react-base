import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ACTIVE_TAB, type ActiveTabType } from '../constants/constants';
import { TabSelector } from '../components/TabSelector';
import { CloseIcon, CheckCircleIcon } from '@/shared/icons';
import { formatRelativeTime } from '@/utils/format';
import { parseHTMLIntoBlocks, type ParseResult } from '../components/processChunkHtml';
import { mapBlocksToComponents, type EditorComponentData } from '../components/blockMapper';

export interface LandingPageTemplate {
    id: string;
    name: string;
    type: ActiveTabType;
    content: string;
    createdAt: string;
    thumbnailUrl?: string;
    code?: string;
    parsedStructure?: ParseResult;
    componentsData?: EditorComponentData[];
}

function ModalImportForm() {
    const [activeTab, setActiveTab] = useState<ActiveTabType>(ACTIVE_TAB.FILE);

    const [templates, setTemplates] = useState<LandingPageTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

    const [previewTemplate, setPreviewTemplate] = useState<LandingPageTemplate | null>(null);

    const [successMsg, setSuccessMsg] = useState('');

    const [isClosed, setIsClosed] = useState(true);
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch('https://6a0bc2965aa893e1015a723c.mockapi.io/api/v1/source');
                let customTemplates: LandingPageTemplate[] = [];
                if (response.ok) {
                    customTemplates = await response.json();
                }
                const initialTemplates = [...customTemplates];
                setTemplates(initialTemplates);

                // const activeId = localStorage.getItem('active_landing_page_template_id');
                // if (activeId && initialTemplates.some(t => t.id === activeId || t.code === activeId)) {
                //     setSelectedTemplateId(activeId);
                // } else if (initialTemplates.length > 0) {
                //     const defaultId = initialTemplates[0].code || initialTemplates[0].id;
                //     setSelectedTemplateId(defaultId);
                //     localStorage.setItem('active_landing_page_template_id', defaultId);
                // }
            } catch (error) {
                console.error("Failed to fetch templates from MockAPI", error);
                setTemplates([]);
            }
        };

        fetchTemplates();
    }, []);

    const showToast = useCallback((message: string) => {
        setSuccessMsg(message);
        const timer = setTimeout(() => {
            setSuccessMsg('');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        setIsClosed(true);
    }, []);

    const handleSaveTemplate = useCallback(async (name: string, content: string, type: ActiveTabType) => {
        const code = `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        let parsedStructure = undefined;
        let mappedComponents = undefined;
        try {
            let htmlToParse = content;
            if (type === ACTIVE_TAB.URL) {
                const response = await fetch(content);
                htmlToParse = await response.text();
            }
            parsedStructure = parseHTMLIntoBlocks(htmlToParse);
            if (parsedStructure) {
                mappedComponents = mapBlocksToComponents(parsedStructure.blocks);
            }
        } catch (error) {
            console.error("Failed to parse HTML blocks:", error);
        }

        const newTemplate: LandingPageTemplate = {
            id: '', // Will be updated from MockAPI
            code,
            name,
            type,
            content,
            parsedStructure,
            componentsData: mappedComponents,
            createdAt: new Date().toISOString(),
        };

        setTemplates(prev => {
            // Optimistically update UI
            const tempTemplate = { ...newTemplate, id: `temp_${Date.now()}` };
            return [tempTemplate, ...prev];
        });

        try {
            // POST to /source
            const sourceRes = await fetch('https://6a0bc2965aa893e1015a723c.mockapi.io/api/v1/source', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, type, content, code, createdAt: Date.now(), thumbnailUrl: ""
                })
            });
            let createdSourceId = '';
            if (sourceRes.ok) {
                const createdSource = await sourceRes.json();
                createdSourceId = createdSource.id;
            }

            // POST to /components
            if (mappedComponents && parsedStructure) {
                await fetch('https://6a0bc2965aa893e1015a723c.mockapi.io/api/v1/components', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code,
                        componentsData: mappedComponents,
                        stats: parsedStructure.stats
                    })
                });
            }

            // Update with real ID from server
            if (createdSourceId) {
                setTemplates(prev => prev.map(t => t.code === code ? { ...t, id: createdSourceId } : t));
            }
        } catch (error) {
            console.error("Failed to save to MockAPI", error);
        }

        showToast(
            type === ACTIVE_TAB.FILE ? 'Tải lên file mẫu thành công!' :
                type === ACTIVE_TAB.CODE ? 'Lưu đoạn mã HTML thành công!' :
                    'Lưu URL mẫu thành công!'
        );
    }, [showToast]);

    const handleSelectTemplate = useCallback((idOrCode: string) => {
        setSelectedTemplateId(idOrCode);
        localStorage.setItem('active_landing_page_template_id', idOrCode);

        setTemplates(prev => {
            const t = prev.find(x => x.id === idOrCode || x.code === idOrCode);
            if (t) {
                showToast(`Đã chọn làm mẫu hiện tại: ${t.name}`);

                if (!t.componentsData && t.code) {
                    // Load components from MockAPI
                    (async () => {
                        try {
                            const res = await fetch(`https://6a0bc2965aa893e1015a723c.mockapi.io/api/v1/components?code=${t.code}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.length > 0) {
                                    const componentsData = data[0].componentsData;
                                    setTemplates(currentPrev => currentPrev.map(item =>
                                        item.code === t.code ? { ...item, componentsData } : item
                                    ));
                                }
                            }
                        } catch (error) {
                            console.error("Failed to fetch components for template", error);
                        }
                    })();
                } else if (!t.componentsData && !t.code) {
                    // On-the-fly parse for hardcoded presets
                    (async () => {
                        try {
                            let htmlToParse = t.content;
                            if (t.type === ACTIVE_TAB.URL) {
                                const response = await fetch(t.content);
                                htmlToParse = await response.text();
                            }
                            const parsedStructure = parseHTMLIntoBlocks(htmlToParse);
                            const componentsData = mapBlocksToComponents(parsedStructure.blocks);

                            setTemplates(currentPrev => {
                                return currentPrev.map(item =>
                                    item.id === t.id ? { ...item, parsedStructure, componentsData } : item
                                );
                            });
                        } catch (error) {
                            console.error("Failed to parse blocks:", error);
                        }
                    })();
                }
            }
            return prev;
        });
    }, [showToast]);

    const handleDeleteTemplate = useCallback(async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        let templateCode = '';
        setTemplates(prev => {
            const templateToDelete = prev.find(t => t.id === id);
            if (templateToDelete) {
                templateCode = templateToDelete.code || '';
            }

            const updated = prev.filter(t => t.id !== id);

            setSelectedTemplateId(prevSelected => {
                if (prevSelected === id || (templateCode && prevSelected === templateCode)) {
                    const newActiveId = updated.length > 0 ? (updated[0].code || updated[0].id) : '';
                    if (newActiveId) {
                        localStorage.setItem('active_landing_page_template_id', newActiveId);
                    } else {
                        localStorage.removeItem('active_landing_page_template_id');
                    }
                    return newActiveId;
                }
                return prevSelected;
            });

            return updated;
        });
        showToast('Đã xóa mẫu thành công!');

        if (!id.startsWith('preset_')) {
            try {
                // DELETE from MockAPI
                await fetch(`https://6a0bc2965aa893e1015a723c.mockapi.io/api/v1/source/${id}`, { method: 'DELETE' });
                // We could also try to delete from /components if we had the component id, 
                // but MockAPI handles it usually via a separate request. We'll leave it simple for now.
            } catch (e) {
                console.error("Failed to delete from API", e);
            }
        }
    }, [showToast]);
    const renderedTemplatesList = useMemo(() => {
        if (templates.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center border border-dashed border-obsidian-border rounded-xl bg-obsidian-container/10 p-6">
                    <span className="material-symbols-outlined text-3xl text-obsidian-text-dim mb-3">folder_open</span>
                    <p className="text-xs font-semibold text-white">Chưa có mẫu nào</p>
                    <p className="text-[10px] text-obsidian-text-dim mt-1 max-w-[200px]">Hãy thêm mẫu mới từ bảng điều khiển bên trái.</p>
                </div>
            );
        }

        return templates.map((template) => {
            const templateKey = template.code || template.id;
            const isSelected = selectedTemplateId === templateKey || selectedTemplateId === template.id;
            return (
                <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(templateKey)}
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
                                onClick={(e) => { e.stopPropagation(); handleSelectTemplate(templateKey); }}
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
        });
    }, [templates, selectedTemplateId, handleSelectTemplate, handleDeleteTemplate]);

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
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </header>
                {successMsg && (
                    <div className="absolute top-[68px] left-6 right-6 z-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn shadow-lg shadow-emerald-500/5">
                        <CheckCircleIcon className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <section className="p-6 border-r border-b md:border-b-0 border-obsidian-border flex flex-col h-full overflow-hidden rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                        <h2 className="text-sm font-bold text-obsidian-text-dim uppercase tracking-widest mb-4">Tạo mẫu mới</h2>
                        <TabSelector
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            onSave={handleSaveTemplate}
                            templateCount={templates.length}
                        />
                    </section>
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
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2" data-purpose="template-history-list">
                            {renderedTemplatesList}
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
                                <CloseIcon className="h-5 w-5" />
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
                                    handleSelectTemplate(previewTemplate.code || previewTemplate.id);
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
}

export default ModalImportForm;
