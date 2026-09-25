import React from 'react';
import {
  Calendar,
  Gift,
  Link2,
  Tag,
  Sliders,
  Mail,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { EmailContentData } from '../data/defaultEmail';
import { EMAIL_ASSETS } from '../data/assets';

interface QuickFieldsPanelProps {
  emailData: EmailContentData;
  setEmailData: React.Dispatch<React.SetStateAction<EmailContentData>>;
  customImageMap: Record<string, string>;
  onCustomImageUpload: (key: string, file: File) => void;
  onResetCustomImage: (key: string) => void;
  onContentModified: () => void;
}

export const QuickFieldsPanel: React.FC<QuickFieldsPanelProps> = ({
  emailData,
  setEmailData,
  customImageMap,
  onCustomImageUpload,
  onResetCustomImage,
  onContentModified,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const selectedKeyRef = React.useRef<string>('');

  const handleInputChange = (field: keyof EmailContentData, value: string) => {
    setEmailData((prev) => ({ ...prev, [field]: value }));
    onContentModified();
  };

  const handlePickFile = (key: string) => {
    selectedKeyRef.current = key;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedKeyRef.current) {
      onCustomImageUpload(selectedKeyRef.current, file);
      onContentModified();
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">快速參數面板</h2>
          <p className="text-[11px] text-slate-400">快速調整活動日期、優惠券代碼與連結</p>
        </div>
      </div>

      {/* 1. Event & Coupon Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Tag className="w-3.5 h-3.5 text-red-500" />
          <span>優惠券與兌換參數</span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              主標題文字
            </label>
            <input
              type="text"
              value={emailData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              STEP 01 兌換標題
            </label>
            <input
              type="text"
              value={emailData.step1Title}
              onChange={(e) => handleInputChange('step1Title', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              優惠步驟標題
            </label>
            <input
              type="text"
              value={emailData.couponBoxTitle}
              onChange={(e) => handleInputChange('couponBoxTitle', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Key Target URLs */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Link2 className="w-3.5 h-3.5 text-blue-600" />
          <span>重點超連結網址</span>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              講座完整回放網址
            </label>
            <input
              type="url"
              value={emailData.headerWatchUrl}
              onChange={(e) => handleInputChange('headerWatchUrl', e.target.value)}
              placeholder="https://nabi.104.com.tw/..."
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              我的優惠券兌換頁
            </label>
            <input
              type="url"
              value={emailData.couponLinkUrl}
              onChange={(e) => handleInputChange('couponLinkUrl', e.target.value)}
              placeholder="https://nabi.104.com.tw/myCoupon"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              客服諮詢 Email
            </label>
            <input
              type="email"
              value={emailData.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              placeholder="nabiservice@104.com.tw"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Image Assets Manager */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>eDM 圖片資產管理 (7張)</span>
          </div>
          <span className="text-[10px] text-slate-400">可個別替換</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {Object.entries(EMAIL_ASSETS).map(([path, asset]) => {
            const isCustom = !!customImageMap[path];
            return (
              <div
                key={path}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 text-xs transition"
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCustom ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  <div className="truncate">
                    <p className="font-semibold text-slate-700 truncate">{asset.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{path}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePickFile(path)}
                    className="px-2 py-1 text-[11px] bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-700 font-medium shadow-2xs"
                  >
                    {isCustom ? '重換' : '更換'}
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => onResetCustomImage(path)}
                      title="還原預設"
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900 leading-relaxed">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">編輯小提示：</strong>
          <p className="text-[11px] text-amber-800 mt-0.5">
            您也可以直接用滑鼠點擊中間畫面的任意文字，像 Word 一樣隨心所欲打字、換行與調整格式！
          </p>
        </div>
      </div>
    </div>
  );
};
