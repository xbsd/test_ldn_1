import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { handleImageError } from '../utils/productImage';

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
      <div className="h-10 w-48 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><ProductSkeleton count={8} /></div>
    </div>
  );

  if (!brand) return (
    <div className="text-center py-20">
      <p className="text-lg font-medium text-gray-900">Brand not found</p>
      <Link to="/shop" className="text-red-600 hover:underline text-sm mt-2 inline-block">Back to Shop</Link>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-gray-900">Brands</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-gray-300">{brand.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{brand.name}</h1>
              <p className="text-gray-400 mt-1">
                {brand.devices?.length || 0} device{brand.devices?.length !== 1 ? 's' : ''} &middot; {products.length} protector{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Devices Grid */}
        {brand.devices?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Compatible Devices</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brand.devices.map(d => (
                <Link
                  key={d.id}
                  to={`/devices/${d.slug}`}
                  className="group p-5 bg-white border border-gray-200 rounded-xl text-center hover:border-gray-900 hover:shadow-lg transition-all"
                >
                  <div className="w-full h-24 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={d.imageUrl || undefined}
                      alt={d.modelName}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={handleImageError}
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">{d.modelName}</h3>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">{d.formFactor}</p>
                  {d.msrp && <p className="text-xs text-gray-400 mt-1">MSRP ${Number(d.msrp).toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">All {brand.name} Protectors</h2>
            <span className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No products found for this brand.</p>
              <Link to="/shop" className="text-red-600 hover:underline text-sm mt-2 inline-block">Browse All Products</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
