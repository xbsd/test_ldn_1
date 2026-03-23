import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

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
      <div className="skeleton h-10 w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><ProductSkeleton count={8} /></div>
    </div>
  );

  if (!device) return <div className="text-center py-16 text-gray-400">Device not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/brands/${device.brand?.slug}`} className="hover:text-white">{device.brand?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{device.modelName}</span>
      </nav>

      {/* Device Info Strip */}
      <div className="card p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={device.imageUrl || `https://picsum.photos/seed/${device.slug}/400/300`}
          alt={device.modelName}
          className="w-48 h-36 object-cover rounded-lg"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/brands/${device.brand?.slug}`} className="badge bg-accent/30 text-blue-300">{device.brand?.name}</Link>
            <span className="badge bg-surface text-gray-300 capitalize">{device.formFactor}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{device.modelName}</h1>
          {device.msrp && <p className="text-gray-400">Device MSRP: ${Number(device.msrp).toLocaleString()}</p>}
          <p className="text-sm text-gray-400 mt-2">{products.length} protector{products.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Products for this device */}
      <h2 className="text-xl font-semibold mb-4">Protectors for {device.modelName}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && <p className="text-gray-400 py-8">No protectors available yet for this device.</p>}
    </div>
  );
}
