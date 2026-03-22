import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=8'),
      api.get('/brands'),
    ]).then(([prodRes, brandRes]) => {
      setProducts(prodRes.data.products);
      setBrands(brandRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const testimonials = [
    { text: "Saved my Helix from a beer spill at a bar gig. Paid for itself instantly.", author: "Mike R., Touring Guitarist" },
    { text: "The magnetic mount is genius — snaps on and off in seconds. Crystal clear.", author: "Sarah K., Session Player" },
    { text: "Custom engraving looks incredible on stage. Gets compliments every show.", author: "Jake T., Band Leader" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Protect Your Investment.<br />
            <span className="text-highlight">Play With Confidence.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium laser-cut acrylic protectors for the world's finest guitar processors.
            Designed by guitarists, built for the stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-highlight text-lg px-8 py-3">Shop All Protectors</Link>
            <Link to="/shop?category=bundles" className="btn-outline text-lg px-8 py-3">View Bundles</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Protectors</h2>
          <Link to="/shop" className="text-accent hover:text-blue-400 font-medium">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? <ProductSkeleton count={8} /> : products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map(brand => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="card p-4 flex flex-col items-center justify-center text-center hover:bg-surface/80 group"
              >
                <img
                  src={brand.logoUrl || `https://picsum.photos/seed/${brand.slug}/100/40`}
                  alt={brand.name}
                  className="h-8 mb-2 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xs text-gray-400 group-hover:text-white font-medium">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Device Type */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Device</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Floor Units', 'Compact Pedals', 'Rack Units', 'Desktop'].map((type, i) => (
            <Link
              key={type}
              to={`/shop`}
              className="card p-8 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">{type}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Guitarists Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-3 italic">"{t.text}"</p>
                <p className="text-sm text-gray-500">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
