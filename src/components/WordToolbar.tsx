import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  Palette,
  Highlighter,
  Smile,
  Check,
  Smartphone,
  Monitor,
  Save,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface WordToolbarProps {
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  onSave: () => void;
  onReset: () => void;
  saveStatus: string;
  isSaving: boolean;
  onOpenGmailGuide: () => void;
}

const BRAND_TEXT_COLORS = [
  { label: '深藍 (主色)', value: '#0f3179' },
  { label: '企業紅 (強烈)', value: '#ed3439' },
  { label: '標題海軍藍', value: '#123476' },
  { label: '品牌橘', value: '#f26522' },
  { label: '連結水藍', value: '#1984c4' },
  { label: '深灰文字', value: '#142d66' },
  { label: '純黑', value: '#111827' },
  { label: '純白', value: '#ffffff' },
];

const HIGHLIGHT_COLORS = [
  { label: '粉紅底色 (步驟卡)', value: '#fff0f2' },
  { label: '水藍底色 (重點卡)', value: '#c8f0ff' },
  { label: '淺黃標示', value: '#fef3c7' },
  { label: '柔和綠底', value: '#dcfce7' },
  { label: '無背景', value: 'transparent' },
];

const QUICK_SYMBOLS = ['🎁', '💡', '①', '②', '③', '④', '⑤', '↓', '＋', '✕', '〉', '©'];

export const WordToolbar: React.FC<WordToolbarProps> = ({
  deviceMode,
  setDeviceMode,
  onSave,
  onReset,
  saveStatus,
  isSaving,
  onOpenGmailGuide,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');

  const executeCommand = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
  };

  const handleApplyColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleApplyHighlight = (color: string) => {
    if (color === 'transparent') {
      executeCommand('removeFormat');
    } else {
      executeCommand('hiliteColor', color);
    }
    setShowHighlightPicker(false);
  };

  const handleInsertSymbol = (symbol: string) => {
    executeCommand('insertText', symbol);
    setShowSymbolPicker(false);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl && linkUrl !== 'https://') {
      executeCommand('createLink', linkUrl);
    }
    setShowLinkModal(false);
    setLinkUrl('https://');
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Main Toolbar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Word Editing Controls */}
        <div className="flex items-center flex-wrap gap-1">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              title="復原 (Ctrl+Z)"
              className="p-1.5 rounded hover:bg-white text-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              title="重做 (Ctrl+Y)"
              className="p-1.5 rounded hover:bg-white text-slate-700 transition"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Text Style: Bold, Italic, Underline, Strike */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="粗體 (Ctrl+B)"
              className="p-1.5 rounded hover:bg-white text-slate-800 font-bold transition"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="斜體 (Ctrl+I)"
              className="p-1.5 rounded hover:bg-white text-slate-700 italic transition"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="底線 (Ctrl+U)"
              className="p-1.5 rounded hover:bg-white text-slate-700 underline transition"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              title="刪除線"
              className="p-1.5 rounded hover:bg-white text-slate-700 line-through transition"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Color & Highlight */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
                setShowSymbolPicker(false);
              }}
              title="文字顏色"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition"
            >
              <Palette className="w-4 h-4 text-red-500" />
              <span>字色</span>
            </button>

            {showColorPicker && (
              <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 px-1">品牌與標準文字色</div>
                <div className="grid grid-cols-4 gap-1.5 p-1">
                  {BRAND_TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyColor(c.value)}
                      title={c.label}
                      className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center hover:scale-110 transition shadow-2xs"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 px-1">
                  <span className="text-[11px] text-slate-500">自訂：</span>
                  <input
                    type="color"
                    onChange={(e) => handleApplyColor(e.target.value)}
                    className="w-7 h-7 p-0 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
                setShowSymbolPicker(false);
              }}
              title="螢光筆標示 (背景色)"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition"
            >
              <Highlighter className="w-4 h-4 text-amber-500" />
              <span>底色</span>
            </button>

            {showHighlightPicker && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 px-1">螢光背景標記</div>
                <div className="space-y-1">
                  {HIGHLIGHT_COLORS.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => handleApplyHighlight(h.value)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md transition"
                    >
                      <span
                        className="w-4 h-4 rounded border border-slate-300"
                        style={{ backgroundColor: h.value }}
                      />
                      <span>{h.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Alignment */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              title="靠左對齊"
              className="p-1.5 rounded hover:bg-white text-slate-700 transition"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              title="置中對齊"
              className="p-1.5 rounded hover:bg-white text-slate-700 transition"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              title="靠右對齊"
              className="p-1.5 rounded hover:bg-white text-slate-700 transition"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Link */}
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            title="插入或修改超連結"
            className="p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Symbols */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSymbolPicker(!showSymbolPicker);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
              }}
              title="常用符號 (①②③, 🎁, 💡)"
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
            >
              <Smile className="w-4 h-4 text-emerald-600" />
            </button>

            {showSymbolPicker && (
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 px-1">點擊插入常用符號</div>
                <div className="grid grid-cols-4 gap-1.5 p-1 text-base">
                  {QUICK_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertSymbol(sym)}
                      className="h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 font-bold border border-slate-200 transition"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Format */}
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="清除格式"
            className="p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-600 transition"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Device View, Save, Reset, Guide */}
        <div className="flex items-center gap-2">
          {/* Save Status pill */}
          <div className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            {isSaving ? (
              <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
            ) : (
              <Check className="w-3 h-3 text-emerald-600" />
            )}
            <span>{saveStatus || '已自動儲存'}</span>
          </div>

          {/* Desktop / Mobile Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                deviceMode === 'desktop'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="電腦版寬度 (640px 標準 EDM)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>電腦 640px</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
                deviceMode === 'mobile'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="手機版自適應寬度 (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>手機 375px</span>
            </button>
          </div>

          {/* Manual Save Button */}
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 text-xs font-semibold shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>儲存草稿</span>
          </button>

          {/* Reset Template */}
          <button
            type="button"
            onClick={onReset}
            title="恢復為預設範本內容"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Anti-break Help / Guide Button */}
          <button
            type="button"
            onClick={onOpenGmailGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-semibold transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>防破圖秘訣</span>
          </button>
        </div>
      </div>

      {/* Link Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-blue-600" />
              <span>設定選取文字的超連結網址</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              請先用滑鼠反白選取要加上連結的文字，再在此輸入目標網址：
            </p>
            <form onSubmit={handleInsertLink}>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://nabi.104.com.tw/..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  確認套用
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
