export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
            <div className="h-5 bg-gray-100 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}
