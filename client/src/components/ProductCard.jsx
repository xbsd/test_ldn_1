import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import { getProductImageUrl, handleImageError } from '../utils/productImage';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = getProductImageUrl(product, 400);

  const avgRating = product.reviews?.length
    ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
    : 0;

  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <Link to={`/shop/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        {product.stockQty <= 5 && product.stockQty > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </Link>
      <div className="p-4">
        {product.devices?.length > 0 && (
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.devices.slice(0, 2).map(d => `${d.deviceModel?.brand?.name || ''} ${d.deviceModel?.modelName || ''}`).join(', ')}
          </p>
        )}
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-sm text-gray-900 mb-1.5 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        {avgRating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={avgRating} />
            <span className="text-xs text-gray-400">({product.reviews.length})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product.id, product.variants?.[0]?.id); }}
          className="w-full bg-gray-900 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
