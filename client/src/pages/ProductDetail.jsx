import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data);
      if (data.variants?.length) setSelectedVariant(data.variants[0]);
      // Fetch related products from same category
      api.get(`/products?category=${data.category?.slug}&limit=4`).then(({ data: rel }) => {
        setRelated(rel.products.filter(p => p.id !== data.id).slice(0, 4));
      });
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square skeleton rounded-xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-6 w-1/4" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-16 text-gray-400">Product not found</div>;

  const finalPrice = selectedVariant
    ? (Number(product.price) + Number(selectedVariant.priceModifier)).toFixed(2)
    : Number(product.price).toFixed(2);

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square bg-surface rounded-xl overflow-hidden">
          <img
            src={`https://picsum.photos/seed/pa${product.id}/800/800`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <div className="mb-2">
            <span className="badge bg-accent/30 text-blue-300">{product.category?.name}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

          {/* Compatibility Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.devices?.map(d => (
              <Link
                key={d.deviceModelId}
                to={`/devices/${d.deviceModel?.slug}`}
                className="badge bg-surface border border-gray-600 text-gray-300 hover:border-accent"
              >
                {d.deviceModel?.brand?.name} {d.deviceModel?.modelName}
              </Link>
            ))}
          </div>

          {/* Rating */}
          {product.reviews?.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-gray-400">({product.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">${finalPrice}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-400 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-300 mb-6">{product.description}</p>

          {/* Variant Selector */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Select Option</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{v.variantLabel}</span>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {v.material} • {v.thicknessMm}mm • {v.mountType}
                        </div>
                      </div>
                      {Number(v.priceModifier) > 0 && (
                        <span className="text-sm text-accent">+${Number(v.priceModifier).toFixed(2)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center border border-gray-600 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-400 hover:text-white">-</button>
              <span className="px-3 py-2 min-w-[2rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-400 hover:text-white">+</button>
            </div>
            <button
              onClick={() => addToCart(product.id, selectedVariant?.id, quantity)}
              className="flex-1 btn-highlight text-lg"
            >
              Add to Cart
            </button>
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p>SKU: {product.sku}{selectedVariant ? `-${selectedVariant.skuSuffix}` : ''}</p>
            <p>Stock: {product.stockQty > 0 ? `${product.stockQty} available` : 'Out of stock'}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <StarRating rating={r.rating} />
                  <span className="font-semibold">{r.title}</span>
                  {r.isVerifiedPurchase && (
                    <span className="badge bg-green-500/20 text-green-400 text-[10px]">Verified Purchase</span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-1">{r.body}</p>
                <p className="text-xs text-gray-500">{r.user?.firstName} {r.user?.lastName?.charAt(0)}. — {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
