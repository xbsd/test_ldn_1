import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import RecentlyViewed from '../components/RecentlyViewed';

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
    { text: "Saved my Helix from a beer spill at a bar gig. The full face guard paid for itself instantly.", author: "Mike R.", role: "Touring Guitarist", rating: 5 },
    { text: "The magnetic mount is genius -- snaps on and off in seconds. Crystal clear quality.", author: "Sarah K.", role: "Session Player", rating: 5 },
    { text: "Custom engraving looks incredible on stage. Gets compliments every show.", author: "Jake T.", role: "Band Leader", rating: 5 },
  ];

  const categories = [
    { name: 'Screen Protectors', slug: 'screen-protectors', desc: 'Crystal clear LCD protection', icon: '01' },
    { name: 'Full Face Protectors', slug: 'full-face-protectors', desc: 'Complete surface coverage', icon: '02' },
    { name: 'Knob Guards', slug: 'knob-guards', desc: 'Encoder & knob protection', icon: '03' },
    { name: 'Protection Bundles', slug: 'bundles', desc: 'Save with complete kits', icon: '04' },
    { name: 'Custom Engraved', slug: 'custom-engraved', desc: 'Personalized laser engraving', icon: '05' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-red-500 font-semibold text-sm uppercase tracking-wider mb-4">Premium Guitar Processor Protection</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Protect Your Investment.<br />
              <span className="text-red-500">Play With Confidence.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Precision laser-cut acrylic protectors for Helix, Quad Cortex, Axe-Fx, Kemper and more.
              Designed by guitarists, built for the stage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-8 py-3.5 rounded-lg transition-colors inline-flex items-center justify-center">
                Shop All Protectors
              </Link>
              <Link to="/shop?category=bundles" className="border-2 border-white/30 hover:border-white text-white font-semibold text-lg px-8 py-3.5 rounded-lg transition-colors inline-flex items-center justify-center">
                View Bundles & Save
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-sm font-medium text-gray-700">Free Shipping Over $75</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-sm font-medium text-gray-700">Lifetime Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="text-sm font-medium text-gray-700">30-Day Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500">Find the perfect protection for your setup</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-gray-900 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                <span className="text-sm font-bold text-gray-600 group-hover:text-white transition-colors">{cat.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-white text-sm mb-1 transition-colors">{cat.name}</h3>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Our most popular protectors</p>
            </div>
            <Link to="/shop" className="text-gray-900 hover:text-red-600 font-semibold text-sm flex items-center gap-1 transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? <ProductSkeleton count={8} /> : products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Shop by Brand</h2>
          <p className="text-gray-500">We protect the world's most popular guitar processors</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center hover:border-gray-900 hover:shadow-md transition-all duration-200"
            >
              <div className="h-10 mb-2 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 uppercase tracking-wider transition-colors">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">What Guitarists Say</h2>
            <p className="text-gray-400">Trusted by thousands of musicians worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-4 h-4 ${s <= t.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RecentlyViewed />
      </div>
    </div>
  );
}
