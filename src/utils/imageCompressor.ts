/**
 * Client-side image compression and resizing utility for PropertyMarkaz.
 * Downscales large smartphone/camera photos (e.g. 5MB - 15MB) into lightweight,
 * high-fidelity WebP/JPEG data URLs (~100-200KB) to ensure fast rendering
 * and prevent exceeding browser localStorage limits.
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
}

export const compressImageFile = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  const { maxDimension = 1280, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error(`File "${file.name}" is not a valid image format.`));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error(`Failed to read image file "${file.name}".`));
    };

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new window.Image();

      img.onerror = () => {
        reject(new Error(`Failed to parse image data for "${file.name}".`));
      };

      img.onload = () => {
        let { width, height } = img;

        // Downscale proportionately if either dimension exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If canvas context unavailable, fallback to original data url
          return resolve(src);
        }

        // High quality bicubic scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        try {
          // Prefer JPEG for universal compatibility and high compression ratio
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compresses multiple files in parallel with concurrency safety
 */
export const compressMultipleImages = async (
  files: File[],
  options?: CompressionOptions
): Promise<string[]> => {
  const promises = files.map((file) => compressImageFile(file, options));
  return Promise.all(promises);
};
