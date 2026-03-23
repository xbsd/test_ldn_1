import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { addToRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data);
      addToRecentlyViewed(data);
      if (data.variants?.length) setSelectedVariant(data.variants[0]);
      api.get(`/products?category=${data.category?.slug}&limit=5`).then(({ data: rel }) => {
        setRelated(rel.products.filter(p => p.id !== data.id).slice(0, 4));
      });
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse" />
          <div className="h-20 bg-gray-100 rounded w-full animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-lg w-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-lg font-medium text-gray-900">Product not found</p>
      <Link to="/shop" className="text-red-600 hover:underline text-sm mt-2 inline-block">Back to Shop</Link>
    </div>
  );

  const finalPrice = selectedVariant
    ? (Number(product.price) + Number(selectedVariant.priceModifier)).toFixed(2)
    : Number(product.price).toFixed(2);

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  const inStock = product.stockQty > 0;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-gray-900">Shop</Link>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/shop?category=${product.category.slug}`} className="hover:text-gray-900">{product.category.name}</Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div>
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={`https://picsum.photos/seed/pa${product.id}/800/800`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Category */}
            <Link to={`/shop?category=${product.category?.slug}`} className="text-sm text-red-600 font-medium hover:text-red-700">
              {product.category?.name}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>

            {/* Compatibility */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.devices?.map(d => (
                <Link
                  key={d.deviceModelId}
                  to={`/devices/${d.deviceModel?.slug}`}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 font-medium transition-colors"
                >
                  {d.deviceModel?.brand?.name} {d.deviceModel?.modelName}
                </Link>
              ))}
            </div>

            {/* Rating */}
            {product.reviews?.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm font-medium text-gray-900">{avgRating}</span>
                <span className="text-sm text-gray-500">({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">${finalPrice}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    Save ${(Number(product.compareAtPrice) - Number(finalPrice)).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Variant Selector */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Select Option</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-900 text-sm">{v.variantLabel}</span>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {v.material} &middot; {v.thicknessMm}mm &middot; {v.mountType}
                          </div>
                        </div>
                        {Number(v.priceModifier) > 0 && (
                          <span className="text-sm font-semibold text-gray-900">+${Number(v.priceModifier).toFixed(2)}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <span className="px-4 py-2.5 min-w-[2.5rem] text-center font-medium text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <button
                onClick={() => addToCart(product.id, selectedVariant?.id, quantity)}
                disabled={!inStock}
                className={`flex-1 font-semibold text-lg py-3 rounded-lg transition-colors ${
                  inStock ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Stock & SKU */}
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className={`flex items-center gap-1.5 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                {inStock ? `In Stock (${product.stockQty} available)` : 'Out of Stock'}
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">SKU: {product.sku}{selectedVariant ? `-${selectedVariant.skuSuffix}` : ''}</span>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                <span className="text-gray-700"><strong>Free Shipping</strong> on orders over $75</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-gray-700"><strong>30-Day Returns</strong> - hassle-free</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-gray-700"><strong>Lifetime Warranty</strong> on all products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg leading-relaxed">{product.description}</p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        1x {product.name}
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Installation guide
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Cleaning cloth
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Precision laser-cut acrylic
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Scratch & impact resistant
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Crystal clear optical quality
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="py-3 font-medium text-gray-900 w-1/3">Category</td><td className="py-3 text-gray-600">{product.category?.name}</td></tr>
                    {selectedVariant && (
                      <>
                        <tr><td className="py-3 font-medium text-gray-900">Material</td><td className="py-3 text-gray-600">{selectedVariant.material}</td></tr>
                        <tr><td className="py-3 font-medium text-gray-900">Thickness</td><td className="py-3 text-gray-600">{selectedVariant.thicknessMm}mm</td></tr>
                        <tr><td className="py-3 font-medium text-gray-900">Mount Type</td><td className="py-3 text-gray-600">{selectedVariant.mountType}</td></tr>
                      </>
                    )}
                    <tr><td className="py-3 font-medium text-gray-900">Compatible With</td><td className="py-3 text-gray-600">{product.devices?.map(d => `${d.deviceModel?.brand?.name} ${d.deviceModel?.modelName}`).join(', ')}</td></tr>
                    <tr><td className="py-3 font-medium text-gray-900">SKU</td><td className="py-3 text-gray-600">{product.sku}</td></tr>
                    <tr><td className="py-3 font-medium text-gray-900">Warranty</td><td className="py-3 text-gray-600">Lifetime</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
                        <StarRating rating={Math.round(avgRating)} size="lg" />
                        <p className="text-sm text-gray-500 mt-1">{product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {/* Individual Reviews */}
                    {product.reviews.map(r => (
                      <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <StarRating rating={r.rating} />
                          <span className="font-semibold text-gray-900">{r.title}</span>
                          {r.isVerifiedPurchase && (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Verified Purchase</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2 leading-relaxed">{r.body}</p>
                        <p className="text-xs text-gray-400">
                          {r.user?.firstName} {r.user?.lastName?.charAt(0)}. &mdash; {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
