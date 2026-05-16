function Shimmer({ className }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

export default function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-card overflow-hidden border border-vvva-sand"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Image skeleton */}
      <div className="relative h-[180px] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        {/* Status badge placeholder */}
        <div className="absolute top-3 left-3">
          <Shimmer className="h-5 w-14 rounded-pill" />
        </div>
      </div>

      {/* Body skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
          </div>
          <Shimmer className="h-4 w-4 shrink-0 mt-0.5 rounded" />
        </div>
        <div className="flex gap-1.5 pt-1">
          <Shimmer className="h-5 w-16 rounded-chip" />
          <Shimmer className="h-5 w-16 rounded-chip" />
          <Shimmer className="h-5 w-16 rounded-chip" />
        </div>
      </div>
    </div>
  );
}
