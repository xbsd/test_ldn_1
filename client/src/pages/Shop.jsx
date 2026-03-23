import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentBrand = searchParams.get('brand') || '';
  const currentDevice = searchParams.get('device') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    Promise.all([api.get('/brands'), api.get('/products?limit=1')]).then(([b]) => {
      setBrands(b.data);
      const cats = [
        { slug: 'screen-protectors', name: 'Screen Protectors' },
        { slug: 'full-face-protectors', name: 'Full Face Protectors' },
        { slug: 'knob-guards', name: 'Knob Guards' },
        { slug: 'bundles', name: 'Bundles' },
        { slug: 'custom-engraved', name: 'Custom Engraved' },
      ];
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentBrand) params.set('brand', currentBrand);
    if (currentDevice) params.set('device', currentDevice);
    if (currentCategory) params.set('category', currentCategory);
    params.set('sort', currentSort);
    params.set('page', page);
    params.set('limit', 20);

    api.get(`/products?${params.toString()}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }).finally(() => setLoading(false));
  }, [currentBrand, currentDevice, currentCategory, currentSort, page]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Protectors</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-6">
          {/* Brand Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-gray-400 uppercase tracking-wider">Brand</h3>
            <div className="space-y-1">
              <button onClick={() => updateFilter('brand', '')} className={`block w-full text-left px-3 py-1.5 rounded text-sm ${!currentBrand ? 'bg-accent text-white' : 'text-gray-300 hover:text-white'}`}>All Brands</button>
              {brands.map(b => (
                <button key={b.id} onClick={() => updateFilter('brand', b.slug)} className={`block w-full text-left px-3 py-1.5 rounded text-sm ${currentBrand === b.slug ? 'bg-accent text-white' : 'text-gray-300 hover:text-white'}`}>{b.name}</button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-gray-400 uppercase tracking-wider">Category</h3>
            <div className="space-y-1">
              <button onClick={() => updateFilter('category', '')} className={`block w-full text-left px-3 py-1.5 rounded text-sm ${!currentCategory ? 'bg-accent text-white' : 'text-gray-300 hover:text-white'}`}>All Categories</button>
              {categories.map(c => (
                <button key={c.slug} onClick={() => updateFilter('category', c.slug)} className={`block w-full text-left px-3 py-1.5 rounded text-sm ${currentCategory === c.slug ? 'bg-accent text-white' : 'text-gray-300 hover:text-white'}`}>{c.name}</button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-3 text-sm text-gray-400 uppercase tracking-wider">Sort By</h3>
            <select value={currentSort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field text-sm">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">{total} products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? <ProductSkeleton count={12} /> : products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {!loading && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No products found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-accent text-white' : 'bg-surface text-gray-300 hover:bg-accent/50'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
