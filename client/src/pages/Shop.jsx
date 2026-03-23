import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const hasFilters = currentBrand || currentDevice || currentCategory;

  const FilterSection = ({ title, children }) => (
    <div className="pb-4 border-b border-gray-200 last:border-0">
      <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
            {currentCategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium capitalize">{currentCategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentCategory ? currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}
            </h1>
            <p className="text-gray-500 mt-1">{total} product{total !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden btn-ghost text-sm border border-gray-300"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </button>
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-60 shrink-0 space-y-4 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Clear All Filters
              </button>
            )}

            <FilterSection title="Brand">
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('brand', '')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentBrand ? 'bg-gray-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Brands
                </button>
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => updateFilter('brand', b.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentBrand === b.slug ? 'bg-gray-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Category">
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? 'bg-gray-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => updateFilter('category', c.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === c.slug ? 'bg-gray-900 text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Sort By">
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </FilterSection>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {loading ? <ProductSkeleton count={12} /> : products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {!loading && products.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-gray-900 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
