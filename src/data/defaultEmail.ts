export interface EmailContentData {
  title: string;
  preheader: string;
  webVersionUrl: string;
  headline: string;
  // Rail 1
  rail1Top: string;
  rail1Left: string;
  rail1Right: string;
  // Step 1
  step1Title: string;
  step1Desc: string;
  couponBoxTitle: string;
  step1Item1: string;
  step1Item2: string;
  step1Item3: string;
  step1Item4: string;
  step1Item5: string;
  // Step 2
  step2Title: string;
  step2Desc: string;
  // Rail 2
  rail2Text: string;
  // Step 3
  step3Title: string;
  step3Desc: string;
  // Step 4
  step4Title: string;
  step4Desc: string;
  // Bottom Callout
  calloutText: string;
  // Footer
  footerContact: string;
  footerCopyright: string;

  // Custom links
  headerWatchUrl: string;
  headerStepsUrl: string;
  couponLinkUrl: string;
  supportEmail: string;
}

export const INITIAL_EMAIL_DATA: EmailContentData = {
  title: '9/17 HR 講座｜企業專屬權益與使用方式',
  preheader: '感謝參與 9/17 HR 講座｜講座回放、5 名免費簡報認證與企業體驗方式',
  webVersionUrl: '#',
  headline: '您的企業專屬權益 &amp; 使用方式',
  
  rail1Top: '十<br>月<br>中<br>完<br>成',
  rail1Left: '＋<br>職<br>缺<br>條<br>件<br>設<br>定',
  rail1Right: '免<br>費<br>5<br>個<br>名<br>額<br>兌<br>換',

  step1Title: '🎁 兌換 5 名免費認證名額',
  step1Desc: '本次參與企業可獲得 <strong style="color:#ed3439;">5 名</strong>「台灣簡報認證－初級」免費體驗名額，可提供公司同仁實際體驗認證。<br><strong style="color:#ed3439;">請於 10/9 前完成使用</strong>，逾期名額將失效。',
  couponBoxTitle: '免費名額怎麼用？',
  step1Item1: '前往「<a href="https://nabi.104.com.tw/myCoupon" target="_blank" style="color:#1984c4;text-decoration:underline;">我的優惠券</a>」輸入 <strong style="color:#ed3439;">Co1</strong> 兌換',
  step1Item2: '點選「台灣簡報認證－初級」HR 體驗活動優惠券',
  step1Item3: '點選優惠券裡頭的「適用課程」',
  step1Item4: '進入頁面按下「立即購買」',
  step1Item5: '確認結帳金額為 <strong style="color:#ed3439;">0 元</strong>，即可完成兌換',

  step2Title: '輕鬆導入職缺',
  step2Desc: '於 <strong>2026 年 10 月 15 日前</strong>，將「台灣簡報認證－初級」加入至少 1 個線上招募職缺的人才具備證照條件，即可啟用體驗。<br>建議套用於業務、PM、行銷企劃、顧問、商務開發等簡報剛需職缺，效果更佳！',

  rail2Text: '維<br>持<br>認<br>證<br>在<br>招<br>募<br>條<br>件<br>一<br>個<br>月',

  step3Title: '體驗實際選才效果 1 個月',
  step3Desc: '維持招募職缺人才認證條件至少 1 個月，親眼看見簡報力如何幫你篩出「說得清楚、能說服人」的人才。',

  step4Title: '成效回報 ＋ 專訪機會',
  step4Desc: '104 學習將協助您的職缺觸及具備簡報認證的人才，提升精準招募機會；<strong style="color:#ed3439;">並於 2027 年 3 月 3 日提供一份招募成效小報告</strong>，讓您了解認證職缺收到多少份「具簡報認證」的履歷。此外，我們也將<strong style="color:#ed3439;">邀請部分參與企業進行雇主品牌專訪</strong>，分享選才經驗。',

  calloutText: '💡 讓看不見的溝通力，變成看得見的選才標準<br>一起打造更具競爭力的人才團隊！',

  footerContact: '如有任何問題，歡迎來信聯繫104學習：<a href="mailto:nabiservice@104.com.tw" style="color:#0756a0;text-decoration:none;">nabiservice@104.com.tw</a>',
  footerCopyright: '© 104 Corporation All Rights Reserved.',

  headerWatchUrl: 'https://nabi.104.com.tw',
  headerStepsUrl: '#step01',
  couponLinkUrl: 'https://nabi.104.com.tw/myCoupon',
  supportEmail: 'nabiservice@104.com.tw',
};

export type ImageMode = 'base64' | 'relative' | 'cdn';

export interface GenerateHtmlOptions {
  imageMode?: ImageMode;
  cdnPrefix?: string;
  customImageMap?: Record<string, string>;
}

/**
 * Builds the complete, email-client compliant HTML document matching the user specification.
 */
export function generateEmailHtml(
  data: EmailContentData,
  imageMap: Record<string, string>,
  options: GenerateHtmlOptions = {}
): string {
  const mode = options.imageMode || 'relative';
  const cdnPrefix = (options.cdnPrefix || '').replace(/\/$/, '');

  const getImageSrc = (originalPath: string): string => {
    // If a custom image was uploaded by user
    if (options.customImageMap && options.customImageMap[originalPath]) {
      return options.customImageMap[originalPath];
    }
    if (mode === 'base64') {
      return imageMap[originalPath] || originalPath;
    }
    if (mode === 'cdn' && cdnPrefix) {
      return `${cdnPrefix}/${originalPath}`;
    }
    return originalPath;
  };

  return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${data.title}</title>
  <meta name="description" content="${data.preheader}">
  <style>
    @media screen and (max-width: 480px) {
      .email-shell { width: 100% !important; }
      .mobile-pad { padding-left: 14px !important; padding-right: 14px !important; }
      .rail { display: none !important; width: 0 !important; }
      .step-cell { width: 76px !important; }
      .step-content { padding: 15px 12px !important; }
      .headline { font-size: 17px !important; white-space: normal !important; }
      .body-copy { font-size: 15px !important; }
      .coupon { padding: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f3f7fb;color:#142d66;font-family:Arial,'Microsoft JhengHei','PingFang TC',sans-serif;">
  <div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;color:transparent;">${data.preheader}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f3f7fb;">
    <tr><td align="center">
      <table role="presentation" class="email-shell" border="0" cellpadding="0" cellspacing="0" width="640" style="width:640px;max-width:640px;border-collapse:collapse;background:#ffffff;">
        <tr><td style="padding:7px 20px 7px;background:#ffffff;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
            <td align="left" valign="middle" style="line-height:0;"><img src="${getImageSrc('img/logo.png')}" width="136" height="30" alt="104 學習" style="display:block;width:136px;height:30px;border:0;" /></td>
            <td align="right" valign="middle" style="font-size:12px;line-height:1.4;color:#222222;"><a href="${data.webVersionUrl}" target="_blank" style="color:#222222;text-decoration:none;">無法閱讀</a></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0;line-height:0;">
          <a href="${data.headerWatchUrl}" target="_blank" style="text-decoration:none;display:block;">
            <img src="${getImageSrc('img/header.png')}" width="640" alt="${data.preheader}" style="display:block;width:100%;height:auto;border:0;" />
          </a>
        </td></tr>
        <tr><td class="mobile-pad" style="padding:19px 25px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
            <td width="20%" valign="middle" style="width:20%;"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td bgcolor="#56a9d4" height="2" style="height:2px;font-size:1px;line-height:2px;">&nbsp;</td></tr></table></td>
            <td width="12" valign="middle" style="width:12px;padding-left:9px;"><table role="presentation" width="9" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td bgcolor="#56a9d4" width="9" height="9" style="width:9px;height:9px;font-size:1px;line-height:9px;">&nbsp;</td></tr></table></td>
            <td class="headline" align="center" style="padding:0 14px;white-space:nowrap;color:#123476;font-size:24px;line-height:1.45;font-weight:800;">${data.headline}</td>
            <td width="12" valign="middle" style="width:12px;padding-right:9px;"><table role="presentation" width="9" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td bgcolor="#56a9d4" width="9" height="9" style="width:9px;height:9px;font-size:1px;line-height:9px;">&nbsp;</td></tr></table></td>
            <td width="20%" valign="middle" style="width:20%;"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td bgcolor="#56a9d4" height="2" style="height:2px;font-size:1px;line-height:2px;">&nbsp;</td></tr></table></td>
          </tr></table>
        </td></tr>
        <tr><td class="mobile-pad" style="padding:0 16px 17px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 9px;">
            <tr>
              <td class="rail" width="54" rowspan="3" align="center" valign="middle" style="width:54px;border-radius:7px;background:#ff6664;color:#ffffff;">
                <table role="presentation" width="54" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:54px;">
                  <tr><td colspan="2" align="center" style="padding:6px 0 13px;line-height:0;"><img src="${getImageSrc('img/gift.png')}" width="36" height="40" alt="禮物" style="display:block;width:36px;height:40px;border:0;margin:0 auto;" /></td></tr>
                  <tr><td colspan="2" align="center" valign="top" style="color:#ffffff;font-size:18px;line-height:1.3;font-weight:700;">${data.rail1Top}</td></tr>
                  <tr>
                    <td width="27" align="center" valign="top" style="width:27px;padding-top:24px;color:#ffffff;font-size:15px;line-height:1.28;font-weight:700;">${data.rail1Left}</td>
                    <td width="27" align="center" valign="top" style="width:27px;padding-top:24px;color:#ffffff;font-size:15px;line-height:1.28;font-weight:700;">${data.rail1Right}</td>
                  </tr>
                </table>
              </td>
              <td width="9" rowspan="3" style="width:9px;">&nbsp;</td>
              <td class="step-cell" width="94" align="center" valign="middle" style="width:94px;border-radius:7px 0 0 7px;background:#c3ecf5;color:#0d2b70;"><div style="font-size:14px;letter-spacing:2px;">STEP</div><div style="font-size:36px;line-height:1.1;font-weight:800;">01</div></td>
              <td class="step-content" valign="top" style="padding:17px 18px;border:1px solid #c9d8e9;border-left:0;border-radius:0 7px 7px 0;">
                <div style="font-size:18px;line-height:1.5;font-weight:800;color:#0f3179;">${data.step1Title}</div>
                <div class="body-copy" style="font-size:16px;line-height:1.7;padding-top:7px;">${data.step1Desc}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="coupon" style="margin-top:9px;border-collapse:separate;border-spacing:0;border-radius:6px;background:#fff0f2;"><tr><td style="padding:12px;">
                  <div style="color:#e93438;font-weight:800;font-size:16px;line-height:1.5;">${data.couponBoxTitle}</div>
                  <div class="body-copy" style="font-size:15px;line-height:1.8;">
                    <strong style="color:#e93438;font-size:19px;font-weight:800;">①</strong> ${data.step1Item1}<br>
                    <strong style="color:#e93438;font-size:19px;font-weight:800;">②</strong> ${data.step1Item2}<br>
                    <strong style="color:#e93438;font-size:19px;font-weight:800;">③</strong> ${data.step1Item3}<br>
                    <strong style="color:#e93438;font-size:19px;font-weight:800;">④</strong> ${data.step1Item4}<br>
                    <strong style="color:#e93438;font-size:19px;font-weight:800;">⑤</strong> ${data.step1Item5}
                  </div>
                </td></tr></table>
              </td>
            </tr>
            <tr><td colspan="2" align="center" style="color:#399fe0;font-size:27px;line-height:22px;font-weight:bold;">↓</td></tr>
            <tr>
              <td class="step-cell" width="94" align="center" valign="middle" style="width:94px;border-radius:7px 0 0 7px;background:#c3ecf5;color:#0d2b70;"><div style="font-size:14px;letter-spacing:2px;">STEP</div><div style="font-size:36px;line-height:1.1;font-weight:800;">02</div></td>
              <td class="step-content" valign="top" style="padding:17px 18px;border:1px solid #c9d8e9;border-left:0;border-radius:0 7px 7px 0;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td width="26" valign="middle" style="width:26px;line-height:0;"><img src="${getImageSrc('img/step-people.png')}" width="22" height="22" alt="" style="display:block;width:22px;height:22px;border:0;" /></td><td valign="middle" style="font-size:18px;line-height:1.5;font-weight:800;color:#0f3179;">${data.step2Title}</td></tr></table>
                <div class="body-copy" style="font-size:16px;line-height:1.7;padding-top:7px;padding-left:26px;">${data.step2Desc}</div>
              </td>
            </tr>
            <tr><td class="rail" width="54" style="width:54px;font-size:1px;line-height:1px;">&nbsp;</td><td class="rail" width="9" style="width:9px;font-size:1px;line-height:1px;">&nbsp;</td><td colspan="2" align="center" style="color:#399fe0;font-size:27px;line-height:22px;font-weight:bold;">↓</td></tr>
            <tr>
              <td class="rail" width="54" rowspan="3" align="center" valign="middle" style="width:54px;border-radius:7px;background:#46b0e7;color:#093979;">
                <table role="presentation" width="54" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:54px;">
                  <tr><td align="center" style="padding:0 0 12px;line-height:0;"><img src="${getImageSrc('img/chart.png')}" width="28" height="30" alt="成效圖示" style="display:block;width:28px;height:30px;border:0;margin:0 auto;" /></td></tr>
                  <tr><td align="center" style="color:#093979;font-size:18px;line-height:1.3;font-weight:700;">${data.rail2Text}</td></tr>
                </table>
              </td>
              <td width="9" rowspan="3" style="width:9px;">&nbsp;</td>
              <td class="step-cell" width="94" align="center" valign="middle" style="width:94px;border-radius:7px 0 0 7px;background:#c3ecf5;color:#0d2b70;"><div style="font-size:14px;letter-spacing:2px;">STEP</div><div style="font-size:36px;line-height:1.1;font-weight:800;">03</div></td>
              <td class="step-content" valign="top" style="padding:17px 18px;border:1px solid #c9d8e9;border-left:0;border-radius:0 7px 7px 0;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td width="26" valign="middle" style="width:26px;line-height:0;"><img src="${getImageSrc('img/step-bars.png')}" width="22" height="22" alt="" style="display:block;width:22px;height:22px;border:0;" /></td><td valign="middle" style="font-size:18px;line-height:1.5;font-weight:800;color:#0f3179;">${data.step3Title}</td></tr></table>
                <div class="body-copy" style="font-size:16px;line-height:1.7;padding-top:7px;padding-left:26px;">${data.step3Desc}</div>
              </td>
            </tr>
            <tr><td colspan="2" align="center" style="color:#399fe0;font-size:27px;line-height:22px;font-weight:bold;">↓</td></tr>
            <tr>
              <td class="step-cell" width="94" align="center" valign="middle" style="width:94px;border-radius:7px 0 0 7px;background:#c3ecf5;color:#0d2b70;"><div style="font-size:14px;letter-spacing:2px;">STEP</div><div style="font-size:36px;line-height:1.1;font-weight:800;">04</div></td>
              <td class="step-content" valign="top" style="padding:17px 18px;border:1px solid #c9d8e9;border-left:0;border-radius:0 7px 7px 0;">
                <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td width="26" valign="middle" style="width:26px;line-height:0;"><img src="${getImageSrc('img/step-document.png')}" width="22" height="22" alt="" style="display:block;width:22px;height:22px;border:0;" /></td><td valign="middle" style="font-size:18px;line-height:1.5;font-weight:800;color:#0f3179;">${data.step4Title}</td></tr></table>
                <div class="body-copy" style="font-size:16px;line-height:1.7;padding-top:7px;padding-left:26px;">${data.step4Desc}</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td class="mobile-pad" align="center" style="padding:0 23px 25px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-radius:30px;background:#c8f0ff;"><tr><td align="center" style="padding:15px 12px;color:#123476;font-size:18px;line-height:1.5;font-weight:800;">${data.calloutText}</td></tr></table>
        </td></tr>
        <tr><td style="padding:0 13px 0;background:#ffffff;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f5f6f8;"><tr><td align="center" style="padding:18px 12px 15px;color:#142d66;font-size:13px;line-height:1.5;">
            <div>${data.footerContact}</div>
            <div style="padding-top:12px;color:#848994;">${data.footerCopyright}</div>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
