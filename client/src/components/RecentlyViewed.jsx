import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import ProductCard from './ProductCard';

export default function RecentlyViewed({ excludeId }) {
  const items = useRecentlyViewed(excludeId);

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.slice(0, 4).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
