import html2canvas from 'html2canvas';
import { EMAIL_ASSETS, rasterizeSvgToPngDataUrl } from '../data/assets';

/**
 * Pre-rasterizes all default assets into high-resolution Base64 PNG data URLs.
 */
export async function initializeBase64ImageMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};

  const promises = Object.entries(EMAIL_ASSETS).map(async ([path, asset]) => {
    try {
      const pngDataUrl = await rasterizeSvgToPngDataUrl(
        asset.svg,
        asset.width,
        asset.height,
        2 // Retina 2x scale
      );
      map[path] = pngDataUrl;
    } catch (e) {
      console.warn(`Failed to rasterize asset ${path}`, e);
    }
  });

  await Promise.all(promises);
  return map;
}

/**
 * Replaces all relative image sources in an HTML string with Base64 data URLs.
 * This makes the HTML completely self-contained for Gmail / Outlook without broken images.
 */
export function embedBase64ImagesInHtml(
  html: string,
  imageMap: Record<string, string>,
  customImageMap: Record<string, string> = {}
): string {
  let result = html;
  
  // Combine custom uploads and default rasterized maps
  const fullMap = { ...imageMap, ...customImageMap };

  for (const [relativePath, dataUrl] of Object.entries(fullMap)) {
    // Replace src="img/logo.png" or src="./img/logo.png" or src="/img/logo.png"
    const escaped = relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`src=["'](\\./|/)?${escaped}["']`, 'g');
    result = result.replace(regex, `src="${dataUrl}"`);
  }

  return result;
}

/**
 * Copies rich text HTML with Base64 embedded images to the system clipboard.
 * When pasted in Gmail compose (Ctrl+V), Gmail receives a complete DOM with inline images!
 */
export async function copyRichTextEmailToClipboard(
  htmlContent: string,
  imageMap: Record<string, string>,
  customImageMap: Record<string, string> = {}
): Promise<{ success: boolean; message: string }> {
  try {
    const standaloneHtml = embedBase64ImagesInHtml(htmlContent, imageMap, customImageMap);

    // Extract text summary for fallback
    const parser = new DOMParser();
    const doc = parser.parseFromString(standaloneHtml, 'text/html');
    const textContent = doc.body.innerText || '104 學習 eDM 內容';

    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([standaloneHtml], { type: 'text/html' });
      const textBlob = new Blob([textContent], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);

      return {
        success: true,
        message: '已成功複製「防破圖圖文郵件」！現在可直接在 Gmail / Outlook 撰寫視窗按 Ctrl+V (或 Cmd+V) 貼上！',
      };
    } else {
      // Fallback: select in a hidden contenteditable div and execCommand('copy')
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.innerHTML = standaloneHtml;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const successful = document.execCommand('copy');
      document.body.removeChild(container);

      if (successful) {
        return {
          success: true,
          message: '已複製防破圖郵件內容至剪貼簿！可直接貼入 Gmail 撰寫視窗。',
        };
      } else {
        throw new Error('瀏覽器不支援剪貼簿寫入');
      }
    }
  } catch (err: any) {
    console.error('Failed to copy rich text email', err);
    return {
      success: false,
      message: `複製失敗：${err.message || '請使用一鍵複製 HTML 程式碼'}`,
    };
  }
}

/**
 * Copies the entire eDM as a high-resolution PNG image directly to clipboard.
 * Users can paste this directly into Gmail / Outlook / Teams / LINE / Slack.
 */
export async function copyEmailAsImageToClipboard(
  domElement: HTMLElement
): Promise<{ success: boolean; message: string }> {
  try {
    const canvas = await html2canvas(domElement, {
      scale: 2, // 2x Retina quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f3f7fb',
      logging: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, message: '無法將畫布轉換為圖片' });
          return;
        }

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            resolve({
              success: true,
              message: '🎉 已將整份 eDM 複製為超清長圖！可直接在 Gmail、LINE 或 Slack 按 Ctrl+V 貼上！',
            });
          } else {
            resolve({
              success: false,
              message: '您的瀏覽器不支援直接複製圖片到剪貼簿，請使用「下載長圖」功能。',
            });
          }
        } catch (e: any) {
          resolve({
            success: false,
            message: `複製圖片至剪貼簿失敗：${e.message || '建議改用下載長圖'}`,
          });
        }
      }, 'image/png');
    });
  } catch (err: any) {
    console.error('html2canvas capture error', err);
    return {
      success: false,
      message: `生成長圖失敗：${err.message || '未知錯誤'}`,
    };
  }
}

/**
 * Downloads the eDM as a high-resolution PNG file.
 */
export async function downloadEmailAsImage(
  domElement: HTMLElement,
  filename: string = '104-learning-edm.png'
): Promise<boolean> {
  try {
    const canvas = await html2canvas(domElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f3f7fb',
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (err) {
    console.error('Download as image error', err);
    return false;
  }
}

/**
 * Downloads the given HTML as an `.html` file.
 */
export function downloadHtmlFile(
  htmlContent: string,
  filename: string = '104-learning-edm.html'
): void {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
