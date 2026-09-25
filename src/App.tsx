import React, { useState, useEffect, useRef } from 'react';
import {
  WordToolbar,
} from './components/WordToolbar';
import { EmailEditor } from './components/EmailEditor';
import { QuickFieldsPanel } from './components/QuickFieldsPanel';
import { ExportModal } from './components/ExportModal';
import { GmailAntiBreakModal } from './components/GmailAntiBreakModal';
import { ProjectMigrationModal } from './components/ProjectMigrationModal';
import {
  INITIAL_EMAIL_DATA,
  EmailContentData,
  generateEmailHtml,
} from './data/defaultEmail';
import {
  initializeBase64ImageMap,
  copyRichTextEmailToClipboard,
  copyEmailAsImageToClipboard,
  downloadEmailAsImage,
  downloadHtmlFile,
} from './utils/imageConverter';
import {
  Copy,
  Code2,
  Image as ImageIcon,
  CheckCircle2,
  Mail,
  Sliders,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Sparkles,
  CloudUpload,
} from 'lucide-react';

const STORAGE_KEY_CONTENT = '104_learning_edm_content_v1';
const STORAGE_KEY_IMAGES = '104_learning_edm_images_v1';

export default function App() {
  const [emailData, setEmailData] = useState<EmailContentData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTENT);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved email data from localStorage', e);
    }
    return INITIAL_EMAIL_DATA;
  });

  const [customImageMap, setCustomImageMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IMAGES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load custom images from localStorage', e);
    }
    return {};
  });

  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [showQuickPanel, setShowQuickPanel] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('已自動儲存');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const emailContainerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize rasterized Base64 maps on mount
  useEffect(() => {
    initializeBase64ImageMap().then((map) => {
      setImageMap(map);
    });
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3800);
  };

  // Auto-save logic
  const handleContentModified = () => {
    setIsSaving(true);
    setSaveStatus('正在儲存...');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(emailData));
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(customImageMap));
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setSaveStatus(`已儲存於 ${timeStr}`);
      } catch (err) {
        console.error('Save failed', err);
        setSaveStatus('儲存發生錯誤');
      } finally {
        setIsSaving(false);
      }
    }, 600);
  };

  // Manual save
  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(emailData));
      localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(customImageMap));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSaveStatus(`已儲存於 ${timeStr}`);
      showToast('💾 內容與自訂圖片已成功儲存！');
    } catch {
      showToast('儲存失敗，請確認瀏覽器儲存空間。');
    }
  };

  // Reset to original
  const handleReset = () => {
    setEmailData(INITIAL_EMAIL_DATA);
    setCustomImageMap({});
    localStorage.removeItem(STORAGE_KEY_CONTENT);
    localStorage.removeItem(STORAGE_KEY_IMAGES);
    setSaveStatus('已恢復預設範本');
    setShowResetConfirm(false);
    showToast('🔄 已成功恢復為 104 學習原始預設範本！');
  };

  // Custom image upload handler
  const handleCustomImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomImageMap((prev) => {
          const updated = { ...prev, [key]: dataUrl };
          try {
            localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(updated));
          } catch (err) {
            console.warn('Failed to save image into localStorage', err);
          }
          return updated;
        });
        showToast('📷 已更新圖片！');
        handleContentModified();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetCustomImage = (key: string) => {
    setCustomImageMap((prev) => {
      const next = { ...prev };
      delete next[key];
      try {
        localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save image into localStorage', err);
      }
      return next;
    });
    showToast('已還原為原廠預設圖片');
    handleContentModified();
  };

  // Quick Direct Copy for Gmail (Feature #3 requested)
  const handleQuickCopyForGmail = async () => {
    const fullHtml = generateEmailHtml(emailData, imageMap, {
      imageMode: 'base64',
      customImageMap,
    });
    const res = await copyRichTextEmailToClipboard(fullHtml, imageMap, customImageMap);
    showToast(res.message);
  };

  // Quick Copy HTML code (Feature #2 requested)
  const handleQuickCopyHtml = async () => {
    const fullHtml = generateEmailHtml(emailData, imageMap, {
      imageMode: 'base64',
      customImageMap,
    });
    try {
      await navigator.clipboard.writeText(fullHtml);
      showToast('📋 已一鍵複製 Base64 防破圖 HTML 完整程式碼！');
    } catch {
      setIsExportModalOpen(true);
    }
  };

  // Quick Copy entire eDM as Image
  const handleQuickCopyImage = async () => {
    if (!emailContainerRef.current) return;
    const res = await copyEmailAsImageToClipboard(emailContainerRef.current);
    showToast(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. Global Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-blue-400 bg-clip-text text-transparent">
                104 學習
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold">
                eDM 視覺化編輯器
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Word 式直接編輯 ✕ 防破圖一鍵複製</span>
            </div>
          </div>

          {/* Action Center Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Panel Toggle */}
            <button
              type="button"
              onClick={() => setShowQuickPanel(!showQuickPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                showQuickPanel
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">參數面板</span>
            </button>

            {/* Feature 2: One-click Copy HTML */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition"
              title="一鍵檢視與複製 HTML 程式碼"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">一鍵複製 HTML</span>
              <span className="sm:hidden">HTML</span>
            </button>

            {/* Account Migration / Project Export Button */}
            <button
              type="button"
              onClick={() => setIsMigrationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-xs font-semibold rounded-lg transition"
              title="匯出專案並轉移至另一個付費 Vibe Coding 帳號"
            >
              <CloudUpload className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">匯出 / 轉移帳號</span>
              <span className="sm:hidden">轉移</span>
            </button>

            {/* Feature 3: Copy Entire as Image */}
            <button
              type="button"
              onClick={handleQuickCopyImage}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition"
              title="直接複製為超清長圖，貼入 Gmail / LINE"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>複製整張長圖</span>
            </button>

            {/* Feature 3 Primary: Direct Copy for Gmail (Anti-break!) */}
            <button
              type="button"
              onClick={() => setIsGmailModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95 ring-2 ring-blue-400/30"
              title="解決公司郵件貼入 Gmail 破圖問題"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>貼入 Gmail (防破圖)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Word-like Editing Ribbon */}
      <WordToolbar
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onSave={handleManualSave}
        onReset={() => setShowResetConfirm(true)}
        saveStatus={saveStatus}
        isSaving={isSaving}
        onOpenGmailGuide={() => setIsGmailModalOpen(true)}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Editor Area (8 cols if quick panel open, else 12 cols) */}
        <div
          className={`transition-all duration-300 ${
            showQuickPanel ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}
        >
          {/* Helpful banner for first time editors */}
          <div className="mb-3 px-4 py-2 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Word 式直接編輯模式已啟用：</strong> 點選下方任何文字即可直接修改或鍵盤輸入。更換圖片可將滑鼠移至圖片右上角。
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickCopyForGmail}
              className="hidden sm:flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0 pl-2"
            >
              <span>直接複製圖文</span>
              <span>&rarr;</span>
            </button>
          </div>

          {/* Email Editor Canvas */}
          <EmailEditor
            emailData={emailData}
            setEmailData={setEmailData}
            imageMap={imageMap}
            customImageMap={customImageMap}
            onCustomImageUpload={handleCustomImageUpload}
            onResetCustomImage={handleResetCustomImage}
            deviceMode={deviceMode}
            emailContainerRef={emailContainerRef}
            onContentModified={handleContentModified}
          />
        </div>

        {/* Quick Fields Sidebar (Collapsible) */}
        {showQuickPanel && (
          <aside className="lg:col-span-4 sticky top-20 animate-in fade-in slide-in-from-right duration-200">
            <QuickFieldsPanel
              emailData={emailData}
              setEmailData={setEmailData}
              customImageMap={customImageMap}
              onCustomImageUpload={handleCustomImageUpload}
              onResetCustomImage={handleResetCustomImage}
              onContentModified={handleContentModified}
            />
          </aside>
        )}
      </main>

      {/* Floating Bottom Quick Action Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 text-white">
        <button
          type="button"
          onClick={handleQuickCopyForGmail}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition shadow-sm"
          title="複製防破圖圖文，直接 Ctrl+V 貼入 Gmail 撰寫視窗"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>複製圖文 (貼 Gmail)</span>
        </button>

        <button
          type="button"
          onClick={handleQuickCopyHtml}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-200 transition"
          title="複製完整 Base64 HTML"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>複製 HTML</span>
        </button>

        <button
          type="button"
          onClick={handleQuickCopyImage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-200 transition"
          title="複製為單張超清長圖"
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>複製長圖</span>
        </button>

        <div className="w-px h-4 bg-slate-700 mx-0.5" />

        <button
          type="button"
          onClick={() => {
            const html = generateEmailHtml(emailData, imageMap, {
              imageMode: 'base64',
              customImageMap,
            });
            downloadHtmlFile(html, '104-learning-edm.html');
            showToast('已下載防破圖 HTML 檔案！');
          }}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
          title="下載 .html 檔案"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-3 bg-slate-900/95 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 max-w-md backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">確認恢復預設範本？</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              此操作將清除所有您已編輯的文字與替換的圖片，將整份 eDM 還原至 104 學習原始設定。
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
              >
                確認還原
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        emailData={emailData}
        imageMap={imageMap}
        customImageMap={customImageMap}
      />

      {/* Gmail Anti-break Modal */}
      <GmailAntiBreakModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        emailData={emailData}
        imageMap={imageMap}
        customImageMap={customImageMap}
        emailContainerRef={emailContainerRef}
        onShowToast={showToast}
      />

      {/* Project Migration Modal */}
      <ProjectMigrationModal
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        emailData={emailData}
        imageMap={imageMap}
        customImageMap={customImageMap}
        onShowToast={showToast}
      />
    </div>
  );
}
