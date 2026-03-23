/**
 * Get the best image URL for a product.
 * Products are protectors for specific devices, so we show the device image.
 * Falls back to a category-based placeholder if no device image is available.
 */
export function getProductImageUrl(product, size = 400) {
  // Use the first compatible device's image
  const deviceImage = product?.devices?.[0]?.deviceModel?.imageUrl;
  if (deviceImage) return deviceImage;

  // Fallback: use product ID-based placeholder with a neutral tone
  const id = product?.id || 1;
  return `https://placehold.co/${size}x${size}/f8f9fa/374151?text=PA-${String(id).padStart(4, '0')}`;
}
