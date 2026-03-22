import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageId = product.id || Math.floor(Math.random() * 1000);

  return (
    <div className="card group">
      <Link to={`/shop/${product.slug}`}>
        <div className="aspect-square bg-gray-800 overflow-hidden">
          <img
            src={`https://picsum.photos/seed/pa${imageId}/400/400`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        {product.devices?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.devices.slice(0, 2).map((d) => (
              <span key={d.deviceModelId || d.deviceModel?.id} className="badge bg-accent/30 text-blue-300 text-[10px]">
                {d.deviceModel?.brand?.name} {d.deviceModel?.modelName}
              </span>
            ))}
          </div>
        )}
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-white">${Number(product.price).toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">${Number(product.compareAtPrice).toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product.id, product.variants?.[0]?.id)}
          className="w-full btn-primary text-sm py-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
