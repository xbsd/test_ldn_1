/**
 * Get the best image URL for a product.
 * Products are protectors for specific devices, so we show the device image.
 * Falls back to a "coming soon" placeholder if no device image is available.
 */

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='200' y='185' text-anchor='middle' font-family='Inter,system-ui,sans-serif' font-size='14' font-weight='600' fill='%239ca3af'%3EImage%3C/text%3E%3Ctext x='200' y='210' text-anchor='middle' font-family='Inter,system-ui,sans-serif' font-size='14' font-weight='600' fill='%239ca3af'%3EComing Soon%3C/text%3E%3C/svg%3E";

export function getProductImageUrl(product) {
  // Use the first compatible device's image if it exists and is non-empty
  const deviceImage = product?.devices?.[0]?.deviceModel?.imageUrl;
  if (deviceImage && deviceImage.length > 0) return deviceImage;

  return PLACEHOLDER;
}

/**
 * onError handler for <img> tags — swaps to "Image Coming Soon" placeholder.
 * Usage: <img onError={handleImageError} ... />
 */
export function handleImageError(e) {
  e.target.onerror = null; // prevent infinite loop
  e.target.src = PLACEHOLDER;
}
