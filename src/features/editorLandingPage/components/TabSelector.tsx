import React from 'react';
import { ACTIVE_TAB, type ActiveTabType } from '../constants/constants';
import { FileTextIcon, HtmlCodeIcon, UrlLinkIcon } from '@/shared/icons';
import { TabFile } from './TabFile';
import { TabCode } from './TabCode';
import { TabUrl } from './TabUrl';

interface TabSelectorProps {
    activeTab: ActiveTabType;
    onTabChange: (tab: ActiveTabType) => void;
    onSave: (name: string, content: string, type: ActiveTabType) => void;
    templateCount: number;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
    activeTab,
    onTabChange,
    onSave,
    templateCount,
}) => {
    return (
        <div className="flex flex-col flex-1">
            {/* Tabs Selector Buttons */}
            <div className="flex bg-obsidian-container p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => onTabChange(ACTIVE_TAB.FILE)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === ACTIVE_TAB.FILE
                            ? 'bg-blue-600 text-white shadow-sm font-bold'
                            : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                        }`}
                >
                    <FileTextIcon />
                    File HTML
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange(ACTIVE_TAB.CODE)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === ACTIVE_TAB.CODE
                            ? 'bg-blue-600 text-white shadow-sm font-bold'
                            : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                        }`}
                >
                    <HtmlCodeIcon />
                    Mã Code HTML
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange(ACTIVE_TAB.URL)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${activeTab === ACTIVE_TAB.URL
                            ? 'bg-blue-600 text-white shadow-sm font-bold'
                            : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40'
                        }`}
                >
                    <UrlLinkIcon />
                    Đường dẫn URL
                </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 min-h-[220px]">
                {activeTab === ACTIVE_TAB.FILE && <TabFile onSave={(name, content) => onSave(name, content, 'file')} />}
                {activeTab === ACTIVE_TAB.CODE && <TabCode onSave={(name, content) => onSave(name, content, 'code')} templateCount={templateCount} />}
                {activeTab === ACTIVE_TAB.URL && <TabUrl onSave={(name, content) => onSave(name, content, 'url')} />}
            </div>
        </div>
    );
};
