import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { handleImageError } from '../utils/productImage';

export default function DevicePage() {
  const { slug } = useParams();
  const [device, setDevice] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/devices/${slug}`),
      api.get(`/products?device=${slug}&limit=50`),
    ]).then(([devRes, prodRes]) => {
      setDevice(devRes.data);
      setProducts(prodRes.data.products);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><ProductSkeleton count={8} /></div>
    </div>
  );

  if (!device) return (
    <div className="text-center py-20">
      <p className="text-lg font-medium text-gray-900">Device not found</p>
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
            <Link to={`/brands/${device.brand?.slug}`} className="hover:text-gray-900">{device.brand?.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{device.modelName}</span>
          </nav>
        </div>
      </div>

      {/* Device Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-64 h-48 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
              <img
                src={device.imageUrl || undefined}
                alt={device.modelName}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />
            </div>
            <div>
              <Link to={`/brands/${device.brand?.slug}`} className="text-sm text-red-600 font-medium hover:text-red-700">{device.brand?.name}</Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">{device.modelName}</h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium capitalize">{device.formFactor}</span>
                {device.msrp && <span className="text-gray-500 text-sm">Device MSRP: ${Number(device.msrp).toLocaleString()}</span>}
              </div>
              <p className="text-gray-500 mt-3">{products.length} protector{products.length !== 1 ? 's' : ''} available for this device</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Protectors for {device.modelName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No protectors available yet for this device.</p>
            <Link to="/shop" className="text-red-600 hover:underline text-sm mt-2 inline-block">Browse All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}
