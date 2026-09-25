import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ClipboardCheck,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  copyRichTextEmailToClipboard,
  copyEmailAsImageToClipboard,
  downloadEmailAsImage,
} from '../utils/imageConverter';
import { EmailContentData, generateEmailHtml } from '../data/defaultEmail';

interface GmailAntiBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: EmailContentData;
  imageMap: Record<string, string>;
  customImageMap: Record<string, string>;
  emailContainerRef: React.RefObject<HTMLDivElement | null>;
  onShowToast: (msg: string) => void;
}

export const GmailAntiBreakModal: React.FC<GmailAntiBreakModalProps> = ({
  isOpen,
  onClose,
  emailData,
  imageMap,
  customImageMap,
  emailContainerRef,
  onShowToast,
}) => {
  const [copyingRichText, setCopyingRichText] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  if (!isOpen) return null;

  // Method 1: Copy Rich Text with Base64 embedded images
  const handleCopyRichText = async () => {
    setCopyingRichText(true);
    try {
      const fullHtml = generateEmailHtml(emailData, imageMap, {
        imageMode: 'base64',
        customImageMap,
      });

      const res = await copyRichTextEmailToClipboard(fullHtml, imageMap, customImageMap);
      onShowToast(res.message);
      if (res.success) {
        onClose();
      }
    } finally {
      setCopyingRichText(false);
    }
  };

  // Method 2: Copy whole eDM as Retina image
  const handleCopyAsImage = async () => {
    if (!emailContainerRef.current) return;
    setCopyingImage(true);
    try {
      const res = await copyEmailAsImageToClipboard(emailContainerRef.current);
      onShowToast(res.message);
      if (res.success) {
        onClose();
      }
    } finally {
      setCopyingImage(false);
    }
  };

  // Method 3: Download as image
  const handleDownloadImage = async () => {
    if (!emailContainerRef.current) return;
    setDownloadingImage(true);
    try {
      const ok = await downloadEmailAsImage(
        emailContainerRef.current,
        '104-learning-edm-retina.png'
      );
      if (ok) {
        onShowToast('🎉 已成功下載超清郵件長圖！');
      }
    } finally {
      setDownloadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">
                  Gmail / 郵件客戶端 防破圖解決中心
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                  解決破圖問題
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                為什麼會破圖？如何做到一鍵貼入 Gmail 依然保有完整圖文？
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Explanation Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>為什麼公司郵件貼入 Gmail 經常會破圖？</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              一般從網頁複製或傳送的 HTML 郵件，圖片多為<strong>相對路徑</strong> (例如{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">img/logo.png</code>)
              或受到公司內部內網限制。當您直接貼進 Gmail 撰寫視窗時，Gmail
              伺服器無法找到該圖片檔案，便會顯示<strong>破圖圖示</strong>。
            </p>
          </div>

          {/* Solution 1: Rich Text Base64 */}
          <div className="border-2 border-blue-500/40 hover:border-blue-500 bg-blue-50/30 rounded-2xl p-4.5 transition relative shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md">
                    推薦方案 1
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    一鍵複製「防破圖圖文郵件」(文字＋圖片完整貼上)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  系統將 7 張圖文資產全數轉換為<strong>高畫質 Base64 數據編碼</strong>內嵌。
                  複製後直接在 Gmail 撰寫區按 <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold">Ctrl+V</kbd>，排版、按鈕連結與圖片<strong>全部正常顯示</strong>！
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={handleCopyRichText}
                disabled={copyingRichText}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                {copyingRichText ? (
                  <span>正在打包 Base64 圖片...</span>
                ) : (
                  <>
                    <ClipboardCheck className="w-4 h-4" />
                    <span>一鍵複製防破圖圖文 (貼入 Gmail)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Solution 2: Copy as Retina PNG Image */}
          <div className="border border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-2xl p-4.5 transition shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-md">
                    極致穩妥 方案 2
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    一鍵複製為「超清郵件長圖」(直接複製圖片)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  透過 Retina 2x 高解析度將整份 eDM 轉為<strong>單張長圖</strong>複製到剪貼簿。
                  貼入 Gmail、Outlook、LINE 或 Slack 視窗時<strong>絕對 100% 不破圖</strong>，任何手機或電腦皆能完美閱覽！
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={downloadingImage}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下載長圖 (PNG)</span>
              </button>
              <button
                type="button"
                onClick={handleCopyAsImage}
                disabled={copyingImage}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                {copyingImage ? (
                  <span>正在渲染高畫質長圖...</span>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>複製超清長圖至剪貼簿</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Steps Guide */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>快速貼入 Gmail 實戰 3 步驟</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                <div className="font-bold text-blue-600 mb-1">步驟 1. 複製內容</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  點擊上方「一鍵複製防破圖圖文」或「複製超清長圖」。
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                <div className="font-bold text-blue-600 mb-1">步驟 2. 開啟 Gmail 撰寫</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  打開 Gmail 點擊左上方「撰寫」，輸入收件人與主旨。
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                <div className="font-bold text-blue-600 mb-1">步驟 3. 直接貼上 (Ctrl+V)</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  在信件內文處點一下，按鍵盤 Ctrl+V (Mac 按 Cmd+V) 即刻呈現！
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            已為您最佳化 Gmail、Outlook、Yahoo、Apple Mail 相容性
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-semibold"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
