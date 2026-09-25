import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  Github,
  Laptop,
  CloudUpload,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { EmailContentData } from '../data/defaultEmail';
import { downloadFullProjectZip } from '../utils/projectExporter';

interface ProjectMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: EmailContentData;
  imageMap: Record<string, string>;
  customImageMap: Record<string, string>;
  onShowToast: (msg: string) => void;
}

export const ProjectMigrationModal: React.FC<ProjectMigrationModalProps> = ({
  isOpen,
  onClose,
  emailData,
  imageMap,
  customImageMap,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'zip' | 'aistudio'>('github');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadFullProjectZip(emailData, imageMap, customImageMap);
      onShowToast('🎉 已成功下載完整專案 ZIP！可直接解壓縮或匯入其他平台。');
    } catch (err: any) {
      console.error('ZIP download error', err);
      onShowToast(`下載失敗：${err.message || '未知錯誤'}`);
    } finally {
      setDownloading(false);
    }
  };

  const sharedUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-sm">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">
                  專案匯出與帳號轉移指南 (Vibe Coding Migration)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-full">
                  多平台相容
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                如何將此專案完整搬遷至另一個付費 Vibe Coding 帳號（Cursor、Lovable、Bolt、Replit 或另一個 AI Studio）
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'github'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>途徑一：GitHub 雲端同步法（推薦）</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('zip')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'zip'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>途徑二：下載專案 ZIP 包</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aistudio')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'aistudio'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>途徑三：Google AI Studio 雙帳號移轉</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {/* TAB 1: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-xs text-indigo-950">
                <div className="font-bold text-sm text-indigo-900 mb-1 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub 是所有 Vibe Coding 付費平台之間最強大的通用橋樑！</span>
                </div>
                <p className="leading-relaxed">
                  主流 AI 程式工具（<strong>Cursor、Lovable、Bolt.new、v0、Replit</strong>）都支援直接從 GitHub 倉庫一鍵匯入。只需一次推送到 GitHub，所有平台都能同步讀取！
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">
                  三步驟將專案轉移到您的新付費帳號：
                </h4>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">
                      在 Google AI Studio 介面匯出至 GitHub
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                      點擊右上角的「<strong>Export to GitHub</strong>」按鈕，授權後將專案推送到您的個人 GitHub Repository（公開或私有皆可）。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">
                      登入您的新付費帳號（Cursor / Lovable / Bolt / v0 / Replit）
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                      進入新工具的儀表板，選擇「<strong>Import from GitHub</strong>」或「<strong>Clone from Git Repository</strong>」。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">選擇該倉庫，立即開始接續對話開發</p>
                    <p className="text-slate-500 leading-relaxed">
                      新平台會自動安裝依賴套件（React, Tailwind, HTML2Canvas, JSZip 等），並在瀏覽器即時啟動預覽，保留全部程式碼！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ZIP DOWNLOAD */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold text-amber-900 text-sm">
                  一鍵打包下載完整的獨立原始碼專案
                </div>
                <p className="leading-relaxed">
                  壓縮包內已備妥 <code>package.json</code>、所有 React 元件、7 張高畫質圖文資產、Base64 防破圖版 HTML 以及執行說明。
                </p>
              </div>

              {/* Download Action Card */}
              <div className="p-5 border-2 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <FolderArchive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      104-learning-edm-project.zip
                    </h4>
                    <p className="text-xs text-slate-500">
                      包含：React + Vite 原始碼、7 張圖片、完整防破圖 HTML
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? '正在打包中...' : '立即下載專案 ZIP'}</span>
                </button>
              </div>

              {/* Instructions for IDEs */}
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-slate-800">匯入 Cursor / Windsurf / VS Code：</h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>下載並解壓縮 <code>104-learning-edm-project.zip</code> 到您的電腦。</li>
                  <li>在 Cursor 點擊 <strong>File &gt; Open Folder...</strong> 開啟該資料夾。</li>
                  <li>
                    在終端機輸入：
                    <code className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded font-mono text-slate-800">
                      npm install && npm run dev
                    </code>
                  </li>
                  <li>即可在 Cursor 內隨時使用 Composer 或 Agent 繼續 Vibe Coding！</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: AI STUDIO ACCOUNT TO ACCOUNT */}
          {activeTab === 'aistudio' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                <div className="font-bold text-blue-900 text-sm">
                  移轉至另一個 Google AI Studio 帳號
                </div>
                <p className="leading-relaxed">
                  若您有另一個專門付費的 Google Workspace / AI Studio 帳號，可透過以下方式移轉：
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="font-bold text-slate-800">方式 A：使用 GitHub 作為中轉（推薦）</div>
                  <p className="text-slate-500 leading-relaxed">
                    在目前帳號右上角匯出至您的 GitHub，接著切換至另一個 Google 帳號登入 AI Studio，點擊首頁的「<strong>Import from GitHub</strong>」直接拉取，所有對話狀態與檔案完整同步。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="font-bold text-slate-800">方式 B：使用專案 ZIP 重新載入</div>
                  <p className="text-slate-500 leading-relaxed">
                    點擊本視窗的「<strong>途徑二：下載專案 ZIP 包</strong>」，在另一個付費帳號開新專案時，直接上傳檔案或將程式碼複製貼入即可立即運行。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>專案程式碼結構標準完整，100% 相容 Vite + React 生態系</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? '打包中...' : '下載專案 ZIP'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
