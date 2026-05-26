interface SkeletonProps {
    className?: string;
    count?: number;
  }
  
  export default function LoadingSkeleton({
    className = "",
    count = 1,
  }: SkeletonProps) {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}
          />
        ))}
      </>
    );
  }