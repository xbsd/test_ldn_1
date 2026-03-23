import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pedalarmor_recently_viewed';
const MAX_ITEMS = 8;

export function addToRecentlyViewed(product) {
  if (!product?.id) return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter(p => p.id !== product.id);
    const item = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      devices: product.devices,
      reviews: product.reviews,
      variants: product.variants,
      stockQty: product.stockQty,
    };
    filtered.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch (e) {
    // ignore storage errors
  }
}

export function useRecentlyViewed(excludeId) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(excludeId ? stored.filter(p => p.id !== excludeId) : stored);
    } catch {
      setItems([]);
    }
  }, [excludeId]);

  return items;
}
