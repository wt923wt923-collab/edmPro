import React, { useRef } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { EmailContentData } from '../data/defaultEmail';

interface EmailEditorProps {
  emailData: EmailContentData;
  setEmailData: React.Dispatch<React.SetStateAction<EmailContentData>>;
  imageMap: Record<string, string>;
  customImageMap: Record<string, string>;
  onCustomImageUpload: (key: string, file: File) => void;
  onResetCustomImage: (key: string) => void;
  deviceMode: 'desktop' | 'mobile';
  emailContainerRef: React.RefObject<HTMLDivElement | null>;
  onContentModified: () => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  emailData,
  setEmailData,
  imageMap,
  customImageMap,
  onCustomImageUpload,
  onResetCustomImage,
  deviceMode,
  emailContainerRef,
  onContentModified,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImageKeyRef = useRef<string>('');

  const getImageSrc = (path: string): string => {
    return customImageMap[path] || imageMap[path] || path;
  };

  const handleImageClick = (key: string) => {
    activeImageKeyRef.current = key;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageKeyRef.current) {
      onCustomImageUpload(activeImageKeyRef.current, file);
      onContentModified();
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  const handleBlur = (field: keyof EmailContentData, e: React.FocusEvent<HTMLElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    if (newHtml !== emailData[field]) {
      setEmailData((prev) => ({ ...prev, [field]: newHtml }));
      onContentModified();
    }
  };

  return (
    <div className="py-6 px-2 flex justify-center items-start min-h-[calc(100vh-140px)]">
      {/* Hidden file input for replacing images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Outer Shell Preview Wrapper */}
      <div
        className={`transition-all duration-300 mx-auto ${
          deviceMode === 'desktop'
            ? 'w-[680px]'
            : 'w-[400px] border-[10px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden bg-slate-900 pb-4'
        }`}
      >
        {/* Mobile Mockup Header if in mobile mode */}
        {deviceMode === 'mobile' && (
          <div className="bg-slate-900 pt-2 pb-2 px-6 flex items-center justify-between text-white text-xs select-none">
            <span className="font-semibold">09:41</span>
            <div className="w-16 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* The Actual Email Container to be captured/copied */}
        <div
          ref={emailContainerRef}
          className="bg-[#f3f7fb] p-0 md:p-3 selection:bg-blue-100 selection:text-blue-900 shadow-lg rounded-sm"
          style={{
            fontFamily: "Arial, 'Microsoft JhengHei', 'PingFang TC', sans-serif",
            color: '#142d66',
          }}
        >
          {/* Email Preheader Hidden */}
          <div
            style={{
              display: 'none !important',
              visibility: 'hidden',
              opacity: 0,
              height: 0,
              width: 0,
              overflow: 'hidden',
              color: 'transparent',
            }}
          >
            {emailData.preheader}
          </div>

          {/* Email Shell Table */}
          <table
            role="presentation"
            border={0}
            cellPadding={0}
            cellSpacing={0}
            width="100%"
            style={{ borderCollapse: 'collapse', background: '#f3f7fb' }}
          >
            <tbody>
              <tr>
                <td align="center">
                  <table
                    role="presentation"
                    className="email-shell"
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    width={deviceMode === 'desktop' ? 640 : '100%'}
                    style={{
                      width: deviceMode === 'desktop' ? '640px' : '100%',
                      maxWidth: '640px',
                      borderCollapse: 'collapse',
                      background: '#ffffff',
                    }}
                  >
                    <tbody>
                      {/* 1. Header: Logo & Web link */}
                      <tr>
                        <td style={{ padding: '7px 20px 7px', background: '#ffffff' }}>
                          <table
                            role="presentation"
                            width="100%"
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            style={{ borderCollapse: 'collapse' }}
                          >
                            <tbody>
                              <tr>
                                <td align="left" valign="middle" style={{ lineHeight: 0 }}>
                                  <div className="relative group inline-block">
                                    <img
                                      src={getImageSrc('img/logo.png')}
                                      width={136}
                                      height={30}
                                      alt="104 學習"
                                      style={{
                                        display: 'block',
                                        width: '136px',
                                        height: '30px',
                                        border: 0,
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition gap-1 cursor-pointer">
                                      <button
                                        type="button"
                                        onClick={() => handleImageClick('img/logo.png')}
                                        title="更換 Logo 圖片"
                                        className="p-1 bg-white rounded text-xs text-slate-800 shadow-sm hover:bg-slate-100"
                                      >
                                        <Camera className="w-3.5 h-3.5" />
                                      </button>
                                      {customImageMap['img/logo.png'] && (
                                        <button
                                          type="button"
                                          onClick={() => onResetCustomImage('img/logo.png')}
                                          title="還原預設 Logo"
                                          className="p-1 bg-red-600 text-white rounded text-xs shadow-sm hover:bg-red-700"
                                        >
                                          <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td
                                  align="right"
                                  valign="middle"
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: 1.4,
                                    color: '#222222',
                                  }}
                                >
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('webVersionUrl', e)}
                                    className="outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-300 rounded px-1 transition"
                                  >
                                    無法閱讀
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* 2. Big Banner Image */}
                      <tr>
                        <td style={{ padding: 0, lineHeight: 0 }}>
                          <div className="relative group block">
                            <img
                              src={getImageSrc('img/header.png')}
                              width={640}
                              alt={emailData.preheader}
                              style={{
                                display: 'block',
                                width: '100%',
                                height: 'auto',
                                border: 0,
                              }}
                            />
                            {/* Hover overlay to change banner */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg shadow-lg">
                              <button
                                type="button"
                                onClick={() => handleImageClick('img/header.png')}
                                className="flex items-center gap-1 px-2.5 py-1 bg-white text-slate-800 text-xs font-semibold rounded hover:bg-slate-100 transition"
                              >
                                <Camera className="w-3.5 h-3.5 text-blue-600" />
                                <span>更換頂部橫幅</span>
                              </button>
                              {customImageMap['img/header.png'] && (
                                <button
                                  type="button"
                                  onClick={() => onResetCustomImage('img/header.png')}
                                  title="還原為原廠橫幅"
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* 3. Section Title Bar: "您的企業專屬權益 & 使用方式" */}
                      <tr>
                        <td
                          className="mobile-pad"
                          style={{
                            padding: deviceMode === 'mobile' ? '14px 14px 10px' : '19px 25px 12px',
                          }}
                        >
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            style={{ borderCollapse: 'collapse' }}
                          >
                            <tbody>
                              <tr>
                                <td width="20%" valign="middle" style={{ width: '20%' }}>
                                  <table
                                    role="presentation"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          height="2"
                                          style={{
                                            backgroundColor: '#56a9d4',
                                            height: '2px',
                                            fontSize: '1px',
                                            lineHeight: '2px',
                                          }}
                                        >
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td
                                  width="12"
                                  valign="middle"
                                  style={{ width: '12px', paddingLeft: '9px' }}
                                >
                                  <table
                                    role="presentation"
                                    width="9"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          width="9"
                                          height="9"
                                          style={{
                                            backgroundColor: '#56a9d4',
                                            width: '9px',
                                            height: '9px',
                                            fontSize: '1px',
                                            lineHeight: '9px',
                                          }}
                                        >
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td
                                  className="headline"
                                  align="center"
                                  style={{
                                    padding: '0 14px',
                                    whiteSpace: deviceMode === 'mobile' ? 'normal' : 'nowrap',
                                    color: '#123476',
                                    fontSize: deviceMode === 'mobile' ? '18px' : '24px',
                                    lineHeight: 1.45,
                                    fontWeight: 800,
                                  }}
                                >
                                  <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('headline', e)}
                                    className="outline-none hover:ring-1 hover:ring-blue-300 focus:bg-blue-50 focus:ring-2 focus:ring-blue-400 rounded px-1.5 py-0.5 transition"
                                  >
                                    {emailData.headline}
                                  </span>
                                </td>
                                <td
                                  width="12"
                                  valign="middle"
                                  style={{ width: '12px', paddingRight: '9px' }}
                                >
                                  <table
                                    role="presentation"
                                    width="9"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          width="9"
                                          height="9"
                                          style={{
                                            backgroundColor: '#56a9d4',
                                            width: '9px',
                                            height: '9px',
                                            fontSize: '1px',
                                            lineHeight: '9px',
                                          }}
                                        >
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td width="20%" valign="middle" style={{ width: '20%' }}>
                                  <table
                                    role="presentation"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          height="2"
                                          style={{
                                            backgroundColor: '#56a9d4',
                                            height: '2px',
                                            fontSize: '1px',
                                            lineHeight: '2px',
                                          }}
                                        >
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* 4. Steps Section with Left Vertical Rails */}
                      <tr>
                        <td
                          className="mobile-pad"
                          style={{
                            padding: deviceMode === 'mobile' ? '0 12px 14px' : '0 16px 17px',
                          }}
                        >
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            style={{ borderCollapse: 'separate', borderSpacing: '0 9px' }}
                          >
                            <tbody>
                              {/* STEP 01 ROW */}
                              <tr>
                                {/* Red Left Rail (Desktop only or hidden on mobile) */}
                                {deviceMode === 'desktop' && (
                                  <td
                                    className="rail"
                                    width="54"
                                    rowSpan={3}
                                    align="center"
                                    valign="middle"
                                    style={{
                                      width: '54px',
                                      borderRadius: '7px',
                                      background: '#ff6664',
                                      color: '#ffffff',
                                    }}
                                  >
                                    <table
                                      role="presentation"
                                      width="54"
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      style={{ borderCollapse: 'collapse', width: '54px' }}
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            colSpan={2}
                                            align="center"
                                            style={{ padding: '6px 0 13px', lineHeight: 0 }}
                                          >
                                            <div className="relative group inline-block">
                                              <img
                                                src={getImageSrc('img/gift.png')}
                                                width={36}
                                                height={40}
                                                alt="禮物"
                                                style={{
                                                  display: 'block',
                                                  width: '36px',
                                                  height: '40px',
                                                  border: 0,
                                                  margin: '0 auto',
                                                }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleImageClick('img/gift.png')}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded text-white"
                                              >
                                                <Camera className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            colSpan={2}
                                            align="center"
                                            valign="top"
                                            style={{
                                              color: '#ffffff',
                                              fontSize: '18px',
                                              lineHeight: 1.3,
                                              fontWeight: 700,
                                            }}
                                          >
                                            <div
                                              contentEditable
                                              suppressContentEditableWarning
                                              onBlur={(e) => handleBlur('rail1Top', e)}
                                              dangerouslySetInnerHTML={{ __html: emailData.rail1Top }}
                                              className="outline-none hover:bg-white/10 rounded"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            width="27"
                                            align="center"
                                            valign="top"
                                            style={{
                                              width: '27px',
                                              paddingTop: '24px',
                                              color: '#ffffff',
                                              fontSize: '15px',
                                              lineHeight: 1.28,
                                              fontWeight: 700,
                                            }}
                                          >
                                            <div
                                              contentEditable
                                              suppressContentEditableWarning
                                              onBlur={(e) => handleBlur('rail1Left', e)}
                                              dangerouslySetInnerHTML={{ __html: emailData.rail1Left }}
                                              className="outline-none hover:bg-white/10 rounded"
                                            />
                                          </td>
                                          <td
                                            width="27"
                                            align="center"
                                            valign="top"
                                            style={{
                                              width: '27px',
                                              paddingTop: '24px',
                                              color: '#ffffff',
                                              fontSize: '15px',
                                              lineHeight: 1.28,
                                              fontWeight: 700,
                                            }}
                                          >
                                            <div
                                              contentEditable
                                              suppressContentEditableWarning
                                              onBlur={(e) => handleBlur('rail1Right', e)}
                                              dangerouslySetInnerHTML={{ __html: emailData.rail1Right }}
                                              className="outline-none hover:bg-white/10 rounded"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                )}

                                {deviceMode === 'desktop' && (
                                  <td width="9" rowSpan={3} style={{ width: '9px' }}>
                                    &nbsp;
                                  </td>
                                )}

                                {/* STEP 01 Badge */}
                                <td
                                  className="step-cell"
                                  width={deviceMode === 'mobile' ? 76 : 94}
                                  align="center"
                                  valign="middle"
                                  style={{
                                    width: deviceMode === 'mobile' ? '76px' : '94px',
                                    borderRadius: '7px 0 0 7px',
                                    background: '#c3ecf5',
                                    color: '#0d2b70',
                                  }}
                                >
                                  <div style={{ fontSize: '14px', letterSpacing: '2px' }}>STEP</div>
                                  <div style={{ fontSize: '36px', lineHeight: 1.1, fontWeight: 800 }}>
                                    01
                                  </div>
                                </td>

                                {/* STEP 01 Content */}
                                <td
                                  className="step-content"
                                  valign="top"
                                  style={{
                                    padding: deviceMode === 'mobile' ? '14px 12px' : '17px 18px',
                                    border: '1px solid #c9d8e9',
                                    borderLeft: 0,
                                    borderRadius: '0 7px 7px 0',
                                  }}
                                >
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('step1Title', e)}
                                    style={{
                                      fontSize: '18px',
                                      lineHeight: 1.5,
                                      fontWeight: 800,
                                      color: '#0f3179',
                                    }}
                                    className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                  >
                                    {emailData.step1Title}
                                  </div>

                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('step1Desc', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.step1Desc }}
                                    style={{
                                      fontSize: deviceMode === 'mobile' ? '15px' : '16px',
                                      lineHeight: 1.7,
                                      paddingTop: '7px',
                                    }}
                                    className="body-copy outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                  />

                                  {/* Coupon Box */}
                                  <table
                                    role="presentation"
                                    width="100%"
                                    cellPadding={0}
                                    cellSpacing={0}
                                    className="coupon"
                                    style={{
                                      marginTop: '9px',
                                      borderCollapse: 'separate',
                                      borderSpacing: 0,
                                      borderRadius: '6px',
                                      background: '#fff0f2',
                                    }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td style={{ padding: '12px' }}>
                                          <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleBlur('couponBoxTitle', e)}
                                            style={{
                                              color: '#e93438',
                                              fontWeight: 800,
                                              fontSize: '16px',
                                              lineHeight: 1.5,
                                            }}
                                            className="outline-none hover:ring-1 hover:ring-red-300 rounded px-1 transition"
                                          >
                                            {emailData.couponBoxTitle}
                                          </div>
                                          <div
                                            className="body-copy"
                                            style={{
                                              fontSize: deviceMode === 'mobile' ? '14px' : '15px',
                                              lineHeight: 1.8,
                                            }}
                                          >
                                            <div>
                                              <strong
                                                style={{
                                                  color: '#e93438',
                                                  fontSize: '19px',
                                                  fontWeight: 800,
                                                }}
                                              >
                                                ①
                                              </strong>{' '}
                                              <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleBlur('step1Item1', e)}
                                                dangerouslySetInnerHTML={{ __html: emailData.step1Item1 }}
                                                className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-0.5"
                                              />
                                            </div>
                                            <div>
                                              <strong
                                                style={{
                                                  color: '#e93438',
                                                  fontSize: '19px',
                                                  fontWeight: 800,
                                                }}
                                              >
                                                ②
                                              </strong>{' '}
                                              <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleBlur('step1Item2', e)}
                                                dangerouslySetInnerHTML={{ __html: emailData.step1Item2 }}
                                                className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-0.5"
                                              />
                                            </div>
                                            <div>
                                              <strong
                                                style={{
                                                  color: '#e93438',
                                                  fontSize: '19px',
                                                  fontWeight: 800,
                                                }}
                                              >
                                                ③
                                              </strong>{' '}
                                              <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleBlur('step1Item3', e)}
                                                dangerouslySetInnerHTML={{ __html: emailData.step1Item3 }}
                                                className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-0.5"
                                              />
                                            </div>
                                            <div>
                                              <strong
                                                style={{
                                                  color: '#e93438',
                                                  fontSize: '19px',
                                                  fontWeight: 800,
                                                }}
                                              >
                                                ④
                                              </strong>{' '}
                                              <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleBlur('step1Item4', e)}
                                                dangerouslySetInnerHTML={{ __html: emailData.step1Item4 }}
                                                className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-0.5"
                                              />
                                            </div>
                                            <div>
                                              <strong
                                                style={{
                                                  color: '#e93438',
                                                  fontSize: '19px',
                                                  fontWeight: 800,
                                                }}
                                              >
                                                ⑤
                                              </strong>{' '}
                                              <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleBlur('step1Item5', e)}
                                                dangerouslySetInnerHTML={{ __html: emailData.step1Item5 }}
                                                className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-0.5"
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>

                              {/* Down arrow row */}
                              <tr>
                                <td
                                  colSpan={2}
                                  align="center"
                                  style={{
                                    color: '#399fe0',
                                    fontSize: '27px',
                                    lineHeight: '22px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  ↓
                                </td>
                              </tr>

                              {/* STEP 02 ROW */}
                              <tr>
                                <td
                                  className="step-cell"
                                  width={deviceMode === 'mobile' ? 76 : 94}
                                  align="center"
                                  valign="middle"
                                  style={{
                                    width: deviceMode === 'mobile' ? '76px' : '94px',
                                    borderRadius: '7px 0 0 7px',
                                    background: '#c3ecf5',
                                    color: '#0d2b70',
                                  }}
                                >
                                  <div style={{ fontSize: '14px', letterSpacing: '2px' }}>STEP</div>
                                  <div style={{ fontSize: '36px', lineHeight: 1.1, fontWeight: 800 }}>
                                    02
                                  </div>
                                </td>
                                <td
                                  className="step-content"
                                  valign="top"
                                  style={{
                                    padding: deviceMode === 'mobile' ? '14px 12px' : '17px 18px',
                                    border: '1px solid #c9d8e9',
                                    borderLeft: 0,
                                    borderRadius: '0 7px 7px 0',
                                  }}
                                >
                                  <table
                                    role="presentation"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="26" valign="middle" style={{ width: '26px', lineHeight: 0 }}>
                                          <div className="relative group inline-block">
                                            <img
                                              src={getImageSrc('img/step-people.png')}
                                              width={22}
                                              height={22}
                                              alt=""
                                              style={{
                                                display: 'block',
                                                width: '22px',
                                                height: '22px',
                                                border: 0,
                                              }}
                                            />
                                          </div>
                                        </td>
                                        <td
                                          valign="middle"
                                          style={{
                                            fontSize: '18px',
                                            lineHeight: 1.5,
                                            fontWeight: 800,
                                            color: '#0f3179',
                                          }}
                                        >
                                          <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleBlur('step2Title', e)}
                                            className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                          >
                                            {emailData.step2Title}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('step2Desc', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.step2Desc }}
                                    style={{
                                      fontSize: deviceMode === 'mobile' ? '15px' : '16px',
                                      lineHeight: 1.7,
                                      paddingTop: '7px',
                                      paddingLeft: '26px',
                                    }}
                                    className="body-copy outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                  />
                                </td>
                              </tr>

                              {/* Rail separator & Arrow row */}
                              <tr>
                                {deviceMode === 'desktop' && (
                                  <td
                                    className="rail"
                                    width="54"
                                    style={{ width: '54px', fontSize: '1px', lineHeight: '1px' }}
                                  >
                                    &nbsp;
                                  </td>
                                )}
                                {deviceMode === 'desktop' && (
                                  <td
                                    className="rail"
                                    width="9"
                                    style={{ width: '9px', fontSize: '1px', lineHeight: '1px' }}
                                  >
                                    &nbsp;
                                  </td>
                                )}
                                <td
                                  colSpan={2}
                                  align="center"
                                  style={{
                                    color: '#399fe0',
                                    fontSize: '27px',
                                    lineHeight: '22px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  ↓
                                </td>
                              </tr>

                              {/* STEP 03 ROW */}
                              <tr>
                                {/* Cyan Left Rail */}
                                {deviceMode === 'desktop' && (
                                  <td
                                    className="rail"
                                    width="54"
                                    rowSpan={3}
                                    align="center"
                                    valign="middle"
                                    style={{
                                      width: '54px',
                                      borderRadius: '7px',
                                      background: '#46b0e7',
                                      color: '#093979',
                                    }}
                                  >
                                    <table
                                      role="presentation"
                                      width="54"
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      style={{ borderCollapse: 'collapse', width: '54px' }}
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            align="center"
                                            style={{ padding: '0 0 12px', lineHeight: 0 }}
                                          >
                                            <div className="relative group inline-block">
                                              <img
                                                src={getImageSrc('img/chart.png')}
                                                width={28}
                                                height={30}
                                                alt="成效圖示"
                                                style={{
                                                  display: 'block',
                                                  width: '28px',
                                                  height: '30px',
                                                  border: 0,
                                                  margin: '0 auto',
                                                }}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleImageClick('img/chart.png')}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded text-white"
                                              >
                                                <Camera className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            align="center"
                                            style={{
                                              color: '#093979',
                                              fontSize: '18px',
                                              lineHeight: 1.3,
                                              fontWeight: 700,
                                            }}
                                          >
                                            <div
                                              contentEditable
                                              suppressContentEditableWarning
                                              onBlur={(e) => handleBlur('rail2Text', e)}
                                              dangerouslySetInnerHTML={{ __html: emailData.rail2Text }}
                                              className="outline-none hover:bg-white/10 rounded"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                )}

                                {deviceMode === 'desktop' && (
                                  <td width="9" rowSpan={3} style={{ width: '9px' }}>
                                    &nbsp;
                                  </td>
                                )}

                                {/* STEP 03 Badge */}
                                <td
                                  className="step-cell"
                                  width={deviceMode === 'mobile' ? 76 : 94}
                                  align="center"
                                  valign="middle"
                                  style={{
                                    width: deviceMode === 'mobile' ? '76px' : '94px',
                                    borderRadius: '7px 0 0 7px',
                                    background: '#c3ecf5',
                                    color: '#0d2b70',
                                  }}
                                >
                                  <div style={{ fontSize: '14px', letterSpacing: '2px' }}>STEP</div>
                                  <div style={{ fontSize: '36px', lineHeight: 1.1, fontWeight: 800 }}>
                                    03
                                  </div>
                                </td>

                                {/* STEP 03 Content */}
                                <td
                                  className="step-content"
                                  valign="top"
                                  style={{
                                    padding: deviceMode === 'mobile' ? '14px 12px' : '17px 18px',
                                    border: '1px solid #c9d8e9',
                                    borderLeft: 0,
                                    borderRadius: '0 7px 7px 0',
                                  }}
                                >
                                  <table
                                    role="presentation"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="26" valign="middle" style={{ width: '26px', lineHeight: 0 }}>
                                          <img
                                            src={getImageSrc('img/step-bars.png')}
                                            width={22}
                                            height={22}
                                            alt=""
                                            style={{
                                              display: 'block',
                                              width: '22px',
                                              height: '22px',
                                              border: 0,
                                            }}
                                          />
                                        </td>
                                        <td
                                          valign="middle"
                                          style={{
                                            fontSize: '18px',
                                            lineHeight: 1.5,
                                            fontWeight: 800,
                                            color: '#0f3179',
                                          }}
                                        >
                                          <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleBlur('step3Title', e)}
                                            className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                          >
                                            {emailData.step3Title}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('step3Desc', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.step3Desc }}
                                    style={{
                                      fontSize: deviceMode === 'mobile' ? '15px' : '16px',
                                      lineHeight: 1.7,
                                      paddingTop: '7px',
                                      paddingLeft: '26px',
                                    }}
                                    className="body-copy outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                  />
                                </td>
                              </tr>

                              {/* Down arrow row */}
                              <tr>
                                <td
                                  colSpan={2}
                                  align="center"
                                  style={{
                                    color: '#399fe0',
                                    fontSize: '27px',
                                    lineHeight: '22px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  ↓
                                </td>
                              </tr>

                              {/* STEP 04 ROW */}
                              <tr>
                                <td
                                  className="step-cell"
                                  width={deviceMode === 'mobile' ? 76 : 94}
                                  align="center"
                                  valign="middle"
                                  style={{
                                    width: deviceMode === 'mobile' ? '76px' : '94px',
                                    borderRadius: '7px 0 0 7px',
                                    background: '#c3ecf5',
                                    color: '#0d2b70',
                                  }}
                                >
                                  <div style={{ fontSize: '14px', letterSpacing: '2px' }}>STEP</div>
                                  <div style={{ fontSize: '36px', lineHeight: 1.1, fontWeight: 800 }}>
                                    04
                                  </div>
                                </td>
                                <td
                                  className="step-content"
                                  valign="top"
                                  style={{
                                    padding: deviceMode === 'mobile' ? '14px 12px' : '17px 18px',
                                    border: '1px solid #c9d8e9',
                                    borderLeft: 0,
                                    borderRadius: '0 7px 7px 0',
                                  }}
                                >
                                  <table
                                    role="presentation"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    style={{ borderCollapse: 'collapse' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="26" valign="middle" style={{ width: '26px', lineHeight: 0 }}>
                                          <img
                                            src={getImageSrc('img/step-document.png')}
                                            width={22}
                                            height={22}
                                            alt=""
                                            style={{
                                              display: 'block',
                                              width: '22px',
                                              height: '22px',
                                              border: 0,
                                            }}
                                          />
                                        </td>
                                        <td
                                          valign="middle"
                                          style={{
                                            fontSize: '18px',
                                            lineHeight: 1.5,
                                            fontWeight: 800,
                                            color: '#0f3179',
                                          }}
                                        >
                                          <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleBlur('step4Title', e)}
                                            className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                          >
                                            {emailData.step4Title}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('step4Desc', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.step4Desc }}
                                    style={{
                                      fontSize: deviceMode === 'mobile' ? '15px' : '16px',
                                      lineHeight: 1.7,
                                      paddingTop: '7px',
                                      paddingLeft: '26px',
                                    }}
                                    className="body-copy outline-none hover:ring-1 hover:ring-blue-300 rounded px-1 transition"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* 5. Bottom Rounded Callout Banner */}
                      <tr>
                        <td
                          className="mobile-pad"
                          align="center"
                          style={{
                            padding: deviceMode === 'mobile' ? '0 14px 20px' : '0 23px 25px',
                          }}
                        >
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding={0}
                            cellSpacing={0}
                            style={{
                              borderCollapse: 'separate',
                              borderRadius: '30px',
                              background: '#c8f0ff',
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  style={{
                                    padding: '15px 12px',
                                    color: '#123476',
                                    fontSize: deviceMode === 'mobile' ? '16px' : '18px',
                                    lineHeight: 1.5,
                                    fontWeight: 800,
                                  }}
                                >
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('calloutText', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.calloutText }}
                                    className="outline-none hover:ring-1 hover:ring-blue-400 rounded px-2 transition"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {/* 6. Footer Table */}
                      <tr>
                        <td
                          style={{
                            padding: deviceMode === 'mobile' ? '0 10px 0' : '0 13px 0',
                            background: '#ffffff',
                          }}
                        >
                          <table
                            role="presentation"
                            width="100%"
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            style={{
                              borderCollapse: 'collapse',
                              background: '#f5f6f8',
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  style={{
                                    padding: '18px 12px 15px',
                                    color: '#142d66',
                                    fontSize: '13px',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('footerContact', e)}
                                    dangerouslySetInnerHTML={{ __html: emailData.footerContact }}
                                    className="outline-none hover:ring-1 hover:ring-blue-300 rounded px-1"
                                  />
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleBlur('footerCopyright', e)}
                                    style={{ paddingTop: '12px', color: '#848994' }}
                                    className="outline-none hover:ring-1 hover:ring-slate-300 rounded px-1 inline-block"
                                  >
                                    {emailData.footerCopyright}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
