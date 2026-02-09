/**
 * Compresses an image data URL or File object.
 * @param {string|File} source - The source image (base64 or File)
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width of the image (default 800)
 * @param {number} options.maxHeight - Maximum height of the image (default 800)
 * @param {number} options.quality - Quality (0 to 1, default 0.7)
 * @returns {Promise<string>} - Compressed base64 data URL
 */
export const compressImage = (source, { maxWidth = 800, maxHeight = 800, quality = 0.7 } = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Return compressed base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (e) => reject(e);

    // If source is a File, convert to data URL first
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
};
