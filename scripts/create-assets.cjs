const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../public/img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// 1. logo.svg
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136 30" width="136" height="30">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a18"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
  </defs>
  <!-- '1' -->
  <path d="M 12 3 L 6 8 L 6 12 L 12 7 L 12 27 L 17 27 L 17 3 Z" fill="#58595b"/>
  <!-- '0' Outer & Inner -->
  <path d="M 33 2 C 24 2 19 8 19 15 C 19 22 24 28 33 28 C 42 28 47 22 47 15 C 47 8 42 2 33 2 Z M 33 7 C 38.5 7 41.5 10.5 41.5 15 C 41.5 19.5 38.5 23 33 23 C 27.5 23 24.5 19.5 24.5 15 C 24.5 10.5 27.5 7 33 7 Z" fill="#58595b"/>
  <!-- '0' Orange Accent Arc on Right -->
  <path d="M 33 28 C 39.5 28 44.5 23.5 46.2 17 C 46.7 15 47 13 46.8 11 C 46.5 11.5 46 12 45 12 C 43 12 41.5 13.5 41.5 15 C 41.5 19.5 38.5 23 33 23 C 30 23 27.5 21.8 26 20 C 27.5 25 30 28 33 28 Z" fill="url(#orangeGrad)"/>
  <path d="M 33 2 C 37 2 40.5 4 43 7.5 C 41.5 9 40 10.5 39 12 C 37.5 8.5 35 7 33 7 C 28 7 24.8 10 24.5 14 C 23.5 14 22 14.5 20.5 15 C 21 7.5 26 2 33 2 Z" fill="#58595b"/>
  <!-- '0' orange right half -->
  <path d="M 33 2 C 40 2 47 7.5 47 15 C 47 22.5 40 28 33 28 L 33 23 C 38 23 41.5 19.5 41.5 15 C 41.5 10.5 38 7 33 7 Z" fill="url(#orangeGrad)" clip-path="url(#rightHalf)" />
  <clipPath id="rightHalf">
    <rect x="33" y="0" width="20" height="30"/>
  </clipPath>
  <!-- '4' -->
  <path d="M 64 21 L 64 27 L 59 27 L 59 21 L 49 21 L 49 16 L 59 2 L 64 2 L 64 16 L 68 16 L 68 21 Z M 59 16 L 59 7.5 L 53 16 Z" fill="#58595b"/>
  <!-- '學習' -->
  <text x="73" y="22" font-family="'Noto Sans TC', 'Microsoft JhengHei', sans-serif" font-weight="900" font-size="21" fill="#58595b" letter-spacing="1">學習</text>
</svg>`;

// 2. header.svg (640 x 220)
const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220">
  <defs>
    <linearGradient id="headerBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffcf7"/>
      <stop offset="100%" stop-color="#fff5e7"/>
    </linearGradient>
    <linearGradient id="redBtn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff473d"/>
      <stop offset="100%" stop-color="#e32924"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background with subtle border -->
  <rect x="0" y="0" width="640" height="220" rx="14" fill="url(#headerBg)" stroke="#f6e7d2" stroke-width="1.5"/>

  <!-- Subtle Quote Marks -->
  <text x="145" y="44" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#dfcbab" opacity="0.6">“</text>
  <text x="480" y="44" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#dfcbab" opacity="0.6">”</text>

  <!-- Left Badges -->
  <g transform="translate(68, 65)">
    <circle cx="0" cy="0" r="23" fill="#ff7c6b" filter="url(#shadow)"/>
    <text x="0" y="4" font-family="'Noto Sans TC', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Cheers</text>
  </g>
  <g transform="translate(102, 130)">
    <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#7dc2e8" filter="url(#shadow)"/>
    <text x="0" y="4" font-family="'Noto Sans TC', sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">成長+</text>
  </g>

  <!-- Right Badges -->
  <g transform="translate(595, 65)">
    <circle cx="0" cy="0" r="16" fill="#ff7c6b" filter="url(#shadow)"/>
    <path d="M -5 0 L -2 4 L 6 -4" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g transform="translate(565, 125)">
    <circle cx="0" cy="0" r="21" fill="#60b1e4" filter="url(#shadow)"/>
    <text x="0" y="4" font-family="'Noto Sans TC', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Hello!</text>
  </g>

  <!-- Left Character Illustration (Business Woman) -->
  <g transform="translate(10, 105)">
    <!-- Hair back -->
    <path d="M 28 15 C 20 25 15 50 18 80 L 75 80 C 78 50 72 25 65 15 Z" fill="#15264b"/>
    <!-- Body / Shirt -->
    <path d="M 22 75 L 20 115 L 75 115 L 72 75 Z" fill="#ffffff"/>
    <path d="M 20 75 Q 48 95 72 75 L 72 115 L 20 115 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
    <path d="M 38 75 L 48 92 L 56 75" fill="#15264b"/>
    <!-- Collar & buttons -->
    <circle cx="48" cy="99" r="2" fill="#15264b"/>
    <circle cx="48" cy="107" r="2" fill="#15264b"/>
    <!-- Neck -->
    <rect x="42" y="58" width="12" height="18" fill="#ffd5be" rx="4"/>
    <!-- Face -->
    <ellipse cx="48" cy="46" rx="20" ry="24" fill="#ffdfcb"/>
    <!-- Hair Front / Bangs -->
    <path d="M 28 36 C 35 22 60 22 68 36 C 65 30 55 28 48 30 C 40 28 32 30 28 36 Z" fill="#15264b"/>
    <path d="M 28 36 C 26 50 30 65 32 68 C 34 60 32 45 35 38 Z" fill="#15264b"/>
    <!-- Smile & Eyes -->
    <path d="M 43 48 Q 48 54 53 48" fill="none" stroke="#15264b" stroke-width="2" stroke-linecap="round"/>
    <circle cx="42" cy="42" r="2.2" fill="#15264b"/>
    <circle cx="54" cy="42" r="2.2" fill="#15264b"/>
    <!-- Raised Right Hand pointing right -->
    <path d="M 70 70 Q 82 55 88 48 Q 92 48 90 54 Q 85 64 76 76 Z" fill="#ffdfcb"/>
    <path d="M 88 48 L 98 42 Q 101 44 98 48 L 89 54 Z" fill="#ffdfcb"/>
    <!-- Sleeve cuff -->
    <path d="M 68 68 L 78 74 L 75 80 L 65 74 Z" fill="#7ba5cb"/>
  </g>

  <!-- Right Character Illustration (Business Man) -->
  <g transform="translate(545, 110)">
    <!-- Body / Shirt -->
    <path d="M 18 70 L 15 110 L 72 110 L 68 70 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <!-- Tie -->
    <path d="M 41 72 L 47 72 L 49 105 L 44 110 L 39 105 Z" fill="#0f2f75"/>
    <polygon points="41,68 47,68 49,74 44,76 39,74" fill="#143e9e"/>
    <!-- Collar -->
    <polygon points="34,65 42,74 42,66" fill="#ffffff" stroke="#cbd5e1"/>
    <polygon points="54,65 46,74 46,66" fill="#ffffff" stroke="#cbd5e1"/>
    <!-- Neck -->
    <rect x="38" y="52" width="12" height="16" fill="#ffcca8" rx="3"/>
    <!-- Face -->
    <ellipse cx="44" cy="40" rx="18" ry="22" fill="#fed6ba"/>
    <!-- Smile & Eyes -->
    <path d="M 39 42 Q 44 47 49 42" fill="none" stroke="#15264b" stroke-width="2" stroke-linecap="round"/>
    <circle cx="38" cy="36" r="2" fill="#15264b"/>
    <circle cx="50" cy="36" r="2" fill="#15264b"/>
    <!-- Hair -->
    <path d="M 26 34 C 26 18 58 16 62 30 C 58 24 50 22 42 24 C 36 24 30 27 26 34 Z" fill="#15264b"/>
    <!-- Hand with OK sign -->
    <g transform="translate(-18, 30)">
      <path d="M 10 50 Q 8 30 18 20 Q 24 15 28 25 Q 30 35 22 55 Z" fill="#ffcca8"/>
      <!-- Fingers: thumb & index circle + 3 fingers -->
      <path d="M 14 15 Q 16 8 20 8 Q 24 8 22 18 Z" fill="#fed6ba"/>
      <path d="M 21 16 Q 24 10 28 10 Q 30 11 27 20 Z" fill="#fed6ba"/>
      <path d="M 26 20 Q 30 15 34 16 Q 35 18 31 25 Z" fill="#fed6ba"/>
      <!-- Sleeve -->
      <rect x="6" y="52" width="16" height="12" rx="4" fill="#7ba5cb"/>
    </g>
  </g>

  <!-- Top Dark Blue Pill Badge -->
  <g transform="translate(210, 12)">
    <rect x="0" y="0" width="220" height="32" rx="16" fill="#0d2e70"/>
    <text x="110" y="21" font-family="'Noto Sans TC', sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle" letter-spacing="1">9/17 HR講座 專屬通知</text>
  </g>

  <!-- Main Headline -->
  <text x="320" y="78" font-family="'Noto Sans TC', 'Microsoft JhengHei', sans-serif" font-weight="900" font-size="30" fill="#0d2e70" text-anchor="middle" letter-spacing="1.5">感謝參與 9/17 講座</text>

  <!-- Sub-headline -->
  <g transform="translate(320, 114)">
    <text x="0" y="0" font-family="'Noto Sans TC', 'Microsoft JhengHei', sans-serif" font-weight="900" font-size="28" text-anchor="middle" letter-spacing="1">
      <tspan fill="#0d2e70">講座回放 ＋ </tspan>
      <tspan fill="#ed3439">5 名免費簡報認證</tspan>
    </text>
  </g>

  <!-- Tagline -->
  <text x="320" y="142" font-family="'Noto Sans TC', 'Microsoft JhengHei', sans-serif" font-weight="700" font-size="16" fill="#0d2e70" text-anchor="middle" letter-spacing="1">台灣簡報認證 - 初級  ✕  企業體驗計畫</text>

  <!-- Two CTA Buttons -->
  <!-- Left Button: Watch Playback -->
  <g transform="translate(112, 162)">
    <rect x="0" y="0" width="202" height="42" rx="12" fill="url(#redBtn)" filter="url(#shadow)"/>
    <!-- Play Icon Circle -->
    <circle cx="28" cy="21" r="13" fill="#ffffff"/>
    <polygon points="25,15 35,21 25,27" fill="#e32924"/>
    <text x="112" y="26" font-family="'Noto Sans TC', sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">觀看講座完整回放 〉</text>
  </g>

  <!-- Right Button: View Steps -->
  <g transform="translate(326, 162)">
    <rect x="0" y="0" width="202" height="42" rx="12" fill="#0d2e70" filter="url(#shadow)"/>
    <!-- Document Icon -->
    <g transform="translate(18, 11)">
      <rect x="0" y="0" width="18" height="20" rx="3" fill="#ffffff"/>
      <line x1="4" y1="5" x2="14" y2="5" stroke="#0d2e70" stroke-width="2" stroke-linecap="round"/>
      <line x1="4" y1="9" x2="14" y2="9" stroke="#0d2e70" stroke-width="2" stroke-linecap="round"/>
      <line x1="4" y1="13" x2="10" y2="13" stroke="#0d2e70" stroke-width="2" stroke-linecap="round"/>
    </g>
    <text x="116" y="26" font-family="'Noto Sans TC', sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">查看認證使用步驟 〉</text>
  </g>
</svg>`;

// 3. gift.svg (36 x 40)
const giftSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 40" width="36" height="40">
  <defs>
    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fff5f5"/>
    </linearGradient>
  </defs>
  <!-- Bow on top -->
  <path d="M 18 10 C 13 4 8 7 11 11 C 13 13 17 12 18 12 C 19 12 23 13 25 11 C 28 7 23 4 18 10 Z" fill="#ffffff"/>
  <ellipse cx="18" cy="11.5" rx="2.5" ry="2" fill="#ff4a48"/>
  <!-- Lid -->
  <rect x="3" y="11" width="30" height="7" rx="2" fill="url(#boxGrad)"/>
  <rect x="16" y="11" width="4" height="7" fill="#ff4a48"/>
  <!-- Box Base -->
  <rect x="5" y="18" width="26" height="19" rx="2" fill="url(#boxGrad)"/>
  <rect x="16" y="18" width="4" height="19" fill="#ff4a48"/>
  <rect x="5" y="25" width="26" height="3" fill="#ff4a48"/>
</svg>`;

// 4. chart.svg (28 x 30)
const chartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 30" width="28" height="30">
  <rect x="2" y="16" width="6.5" height="13" rx="2.5" fill="#093979"/>
  <rect x="10.5" y="9" width="6.5" height="20" rx="2.5" fill="#093979"/>
  <rect x="19" y="2" width="6.5" height="27" rx="2.5" fill="#093979"/>
</svg>`;

// 5. step-bars.svg (22 x 22)
const stepBarsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22">
  <rect x="1.5" y="12" width="5" height="9" rx="1.5" fill="#0f3179"/>
  <rect x="8.5" y="7" width="5" height="14" rx="1.5" fill="#0f3179"/>
  <rect x="15.5" y="2" width="5" height="19" rx="1.5" fill="#0f3179"/>
</svg>`;

// 6. step-document.svg (22 x 22)
const stepDocumentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22">
  <path d="M 4 2 L 13 2 L 18 7 L 18 20 C 18 20.8 17.3 21.5 16.5 21.5 L 4 21.5 C 3.2 21.5 2.5 20.8 2.5 20 L 2.5 3.5 C 2.5 2.7 3.2 2 4 2 Z" fill="#0f3179"/>
  <!-- Fold corner -->
  <path d="M 13 2 L 13 7 L 18 7 Z" fill="#ffffff" opacity="0.3"/>
  <!-- Document Lines -->
  <line x1="6" y1="10" x2="14" y2="10" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="6" y1="13.5" x2="14" y2="13.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="6" y1="17" x2="11" y2="17" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// 7. step-people.svg (22 x 22)
const stepPeopleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22">
  <!-- Center Person -->
  <circle cx="11" cy="7" r="3.2" fill="#0f3179"/>
  <path d="M 6.5 19 C 6.5 15.5 8.5 14 11 14 C 13.5 14 15.5 15.5 15.5 19 Z" fill="#0f3179"/>
  <!-- Left Person -->
  <circle cx="4.5" cy="8.5" r="2.4" fill="#0f3179" opacity="0.85"/>
  <path d="M 1 19 C 1 16.5 2.5 15.2 4.5 15.2 C 5.5 15.2 6.5 15.8 7 16.8" fill="#0f3179" opacity="0.85"/>
  <!-- Right Person -->
  <circle cx="17.5" cy="8.5" r="2.4" fill="#0f3179" opacity="0.85"/>
  <path d="M 21 19 C 21 16.5 19.5 15.2 17.5 15.2 C 16.5 15.2 15.5 15.8 15 16.8" fill="#0f3179" opacity="0.85"/>
</svg>`;

// Write all SVGs
const assets = {
  'logo.svg': logoSvg,
  'header.svg': headerSvg,
  'gift.svg': giftSvg,
  'chart.svg': chartSvg,
  'step-bars.svg': stepBarsSvg,
  'step-document.svg': stepDocumentSvg,
  'step-people.svg': stepPeopleSvg,
};

for (const [filename, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(imgDir, filename), content.trim(), 'utf8');
  console.log('Saved', filename);
}
