export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="aspect-square skeleton" />
          <div className="p-4 space-y-3">
            <div className="flex gap-1">
              <div className="skeleton h-4 w-16 rounded-full" />
              <div className="skeleton h-4 w-20 rounded-full" />
            </div>
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-9 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
