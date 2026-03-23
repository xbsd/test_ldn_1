import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

export default function BrandPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/brands/${slug}`),
      api.get(`/products?brand=${slug}&limit=50`),
    ]).then(([brandRes, prodRes]) => {
      setBrand(brandRes.data);
      setProducts(prodRes.data.products);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="skeleton h-10 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><ProductSkeleton count={8} /></div>
    </div>
  );

  if (!brand) return <div className="text-center py-16 text-gray-400">Brand not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{brand.name}</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <img src={brand.logoUrl} alt={brand.name} className="h-12 object-contain" />
        <div>
          <h1 className="text-3xl font-bold">{brand.name}</h1>
          <p className="text-gray-400">Protectors for {brand.devices?.length || 0} devices</p>
        </div>
      </div>

      {/* Devices */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Compatible Devices</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {brand.devices?.map(d => (
            <Link key={d.id} to={`/devices/${d.slug}`} className="card p-4 text-center hover:bg-surface/80">
              <img src={d.imageUrl || `https://picsum.photos/seed/${d.slug}/200/150`} alt={d.modelName} className="w-full h-24 object-cover rounded mb-2" />
              <h3 className="font-medium text-sm">{d.modelName}</h3>
              <p className="text-xs text-gray-400 capitalize">{d.formFactor}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All {brand.name} Protectors ({products.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length === 0 && <p className="text-gray-400 py-8">No products found for this brand.</p>}
      </section>
    </div>
  );
}
