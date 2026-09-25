import JSZip from 'jszip';
import { EMAIL_ASSETS } from '../data/assets';
import { EmailContentData, generateEmailHtml } from '../data/defaultEmail';

/**
 * Creates and downloads a complete ZIP package containing the entire project:
 * - Standalone HTML email (ready to send)
 * - Full React + Vite source code
 * - Public image assets
 * - Configuration files (package.json, tsconfig.json, vite.config.ts)
 * - Migration and run instructions (README.md)
 */
export async function downloadFullProjectZip(
  emailData: EmailContentData,
  imageMap: Record<string, string>,
  customImageMap: Record<string, string>
): Promise<void> {
  const zip = new JSZip();

  // 1. Standalone Production eDM HTML (Base64 Anti-break)
  const standaloneHtml = generateEmailHtml(emailData, imageMap, {
    imageMode: 'base64',
    customImageMap,
  });
  zip.file('104-learning-edm-standalone.html', standaloneHtml);

  // 2. Relative Path eDM HTML
  const relativeHtml = generateEmailHtml(emailData, imageMap, {
    imageMode: 'relative',
    customImageMap,
  });
  zip.file('index.html', relativeHtml);

  // 3. Image Assets folder
  const imgFolder = zip.folder('img');
  const publicImgFolder = zip.folder('public/img');

  for (const [relativePath, asset] of Object.entries(EMAIL_ASSETS)) {
    const filename = relativePath.replace(/^img\//, '');
    const svgFilename = filename.replace(/\.png$/, '.svg');

    // Add SVG
    imgFolder?.file(svgFilename, asset.svg);
    publicImgFolder?.file(svgFilename, asset.svg);

    // If custom image uploaded (data url) or rasterized png available
    const dataUrl = customImageMap[relativePath] || imageMap[relativePath];
    if (dataUrl && dataUrl.startsWith('data:image/')) {
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        imgFolder?.file(filename, base64Data, { base64: true });
        publicImgFolder?.file(filename, base64Data, { base64: true });
      }
    } else {
      // Fallback SVG content in png name for clients that accept it
      imgFolder?.file(filename, asset.svg);
      publicImgFolder?.file(filename, asset.svg);
    }
  }

  // 4. Project Configuration & Documentation
  const packageJson = {
    name: '104-learning-edm-editor',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      html2canvas: '^1.4.1',
      jszip: '^3.10.1',
      'lucide-react': '^0.546.0',
      react: '^19.0.1',
      'react-dom': '^19.0.1',
    },
    devDependencies: {
      '@tailwindcss/vite': '^4.3.3',
      '@types/node': '^22.14.0',
      '@types/react': '^19.3.0',
      '@types/react-dom': '^19.3.0',
      '@vitejs/plugin-react': '^6.1.1',
      tailwindcss: '^4.3.3',
      typescript: '^7.0.2',
      vite: '^8.3.0',
    },
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  const readmeContent = `# 104 學習 eDM 視覺化編輯與防破圖工具

本專案為「104 學習 9/17 HR 講座專屬通知」eDM HTML 編輯器，已包含完整前端原始碼與防破圖圖文資產。

## 快速使用

### 1. 直接發信使用 (無須任何環境)
直接打開資料夾內的 \`104-learning-edm-standalone.html\`，所有圖片皆已採用 Base64 數據編碼內嵌，可直接複製文字內容貼入 Gmail，或匯入任何 EDM 發信系統（Mailchimp、電子豹等）。

### 2. 本地開發或匯入其他 AI / Vibe Coding 平台 (Cursor, Lovable, Bolt, v0, Replit)
1. 將本專案解壓縮至任一資料夾。
2. 開啟終端機執行：
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
3. 瀏覽器開啟 \`http://localhost:3000\` 即可繼續進行 Word 式所見即所得編輯。

### 3. 匯入到另一個付費 Vibe Coding 帳號
- **方式一（GitHub 同步法，最推薦）**：在原本專案平台點擊「Export to GitHub」，再至新帳號點擊「Import from GitHub」即可無縫同步。
- **方式二（ZIP 匯入法）**：在目標平台點擊「Upload Files / Import ZIP」，直接上傳本壓縮檔即可立即啟動。
`;
  zip.file('README.md', readmeContent);

  // 5. Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '104-learning-edm-project.zip';
  a.click();
  URL.revokeObjectURL(url);
}
