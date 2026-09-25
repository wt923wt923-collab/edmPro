import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  FileCode,
  ShieldCheck,
  Globe,
  FolderOpen,
} from 'lucide-react';
import { EmailContentData, generateEmailHtml, ImageMode } from '../data/defaultEmail';
import { downloadHtmlFile } from '../utils/imageConverter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: EmailContentData;
  imageMap: Record<string, string>;
  customImageMap: Record<string, string>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  emailData,
  imageMap,
  customImageMap,
}) => {
  const [imageMode, setImageMode] = useState<ImageMode>('base64');
  const [cdnPrefix, setCdnPrefix] = useState('https://storage.googleapis.com/your-bucket');
  const [copied, setCopied] = useState(false);

  const exportedHtml = useMemo(() => {
    return generateEmailHtml(emailData, imageMap, {
      imageMode,
      cdnPrefix,
      customImageMap,
    });
  }, [emailData, imageMap, imageMode, cdnPrefix, customImageMap]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy HTML', err);
    }
  };

  const handleDownload = () => {
    downloadHtmlFile(exportedHtml, '104-learning-edm.html');
  };

  const lineCount = exportedHtml.split('\n').length;
  const kbSize = (new Blob([exportedHtml]).size / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">導出與複製 HTML 程式碼</h2>
              <p className="text-xs text-slate-500">
                符合各大郵件客戶端標準，支援零依賴 Base64 防破圖輸出
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

        {/* Mode Selector Tabs */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="text-xs font-bold text-slate-700 mb-2">請選擇圖片載入模式：</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mode 1: Base64 */}
            <button
              type="button"
              onClick={() => setImageMode('base64')}
              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                imageMode === 'base64'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <ShieldCheck
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  imageMode === 'base64' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Base64 內嵌模式</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                    防破圖首選
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  將 7 張圖片全部轉為內嵌 Data URL，無需任何圖片伺服器，單一 HTML 即可完整顯示！
                </p>
              </div>
            </button>

            {/* Mode 2: Relative */}
            <button
              type="button"
              onClick={() => setImageMode('relative')}
              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                imageMode === 'relative'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <FolderOpen
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  imageMode === 'relative' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <div>
                <span className="text-xs font-bold text-slate-800">原始相對路徑模式</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  使用 <code className="font-mono text-[10px]">img/...</code> 相對路徑，完全符合原檔規範，適合打包 zip 歸檔。
                </p>
              </div>
            </button>

            {/* Mode 3: CDN */}
            <button
              type="button"
              onClick={() => setImageMode('cdn')}
              className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                imageMode === 'cdn'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <Globe
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  imageMode === 'cdn' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <div>
                <span className="text-xs font-bold text-slate-800">外部 CDN 網址模式</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  將圖片路徑替換為公司圖床或 CDN 網址，減輕郵件 HTML 體積。
                </p>
              </div>
            </button>
          </div>

          {/* CDN Prefix input if CDN mode */}
          {imageMode === 'cdn' && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 shrink-0">
                圖床網址前綴 (CDN URL):
              </span>
              <input
                type="text"
                value={cdnPrefix}
                onChange={(e) => setCdnPrefix(e.target.value)}
                placeholder="https://your-domain.com/edm"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          )}
        </div>

        {/* Code Preview Area */}
        <div className="flex-1 p-5 overflow-hidden flex flex-col bg-slate-900 text-slate-300">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>HTML 原始碼預覽</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span>{lineCount} 行</span>
              <span>{kbSize} KB</span>
            </div>
          </div>

          <pre className="flex-1 overflow-auto mt-2 text-xs font-mono p-3 bg-black/40 rounded-xl text-slate-200 leading-relaxed select-all">
            <code>{exportedHtml}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {imageMode === 'base64' && (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 圖片已內嵌，可直接複製貼入第三方發信系統
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              <span>下載 .html 檔案</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已複製 HTML 到剪貼簿！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>一鍵複製 HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
