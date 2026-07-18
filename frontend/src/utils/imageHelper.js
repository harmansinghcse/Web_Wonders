/**
 * Processes image URLs (specifically from Cloudinary) to request optimized resolutions.
 * This prevents pixelation of small thumbnails and saves bandwidth for heavy images.
 * 
 * @param {string} url - The original image URL.
 * @param {number} width - The target width in pixels (e.g., 200 for thumbnails, 800 for cards).
 * @returns {string} - The optimized URL or original if not hosted on Cloudinary.
 */
export const getOptimizedImageUrl = (url, width = 800) => {
    if (!url) return "";
    
    // Check if the URL is hosted on Cloudinary
    if (url.includes("cloudinary.com")) {
        // Cloudinary URL format usually is: .../image/upload/v12345/folder/name.jpg
        // We inject width (w_X), auto quality (q_auto), and auto format (f_auto, e.g. webp)
        return url.replace("/image/upload/", `/image/upload/w_${width},q_auto,f_auto/`);
    }
    
    return url;
};
