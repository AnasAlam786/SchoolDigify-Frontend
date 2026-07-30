const Skeleton = ({ className = "" }) => (
    <div
        className={`
      relative overflow-hidden rounded-xl
      bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800
      bg-[length:250%_100%]
      animate-[shimmer_1.8s_infinite]
      ${className}
    `}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shine_1.8s_infinite]" />
    </div>
);

const SkeletonInput = () => (
    <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-11 w-full rounded-xl" />
    </div>
);

const SkeletonCard = ({ children }) => (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-6 shadow-xl">
        {children}
    </div>
);


function LoadingSkeleton() {
    return (
        <div className="space-y-6 mt-6">



            {/* Basic Information */}
            <SkeletonCard>
                <Skeleton className="h-6 w-56 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonInput key={i} />
                    ))}
                </div>
            </SkeletonCard>

            {/* Parent Details */}
            <SkeletonCard>
                <Skeleton className="h-6 w-44 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonInput key={i} />
                    ))}
                </div>
            </SkeletonCard>

            {/* Address */}
            <SkeletonCard>
                <Skeleton className="h-6 w-36 mb-6" />

                <div className="space-y-6">
                    <SkeletonInput />
                    <SkeletonInput />

                    <div className="grid md:grid-cols-3 gap-6">
                        <SkeletonInput />
                        <SkeletonInput />
                        <SkeletonInput />
                    </div>
                </div>
            </SkeletonCard>

            {/* Student Image */}
            <SkeletonCard>
                <div className="flex flex-col items-center">
                    <Skeleton className="h-36 w-36 rounded-full" />
                    <Skeleton className="h-4 w-40 mt-5" />
                </div>
            </SkeletonCard>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
                <Skeleton className="h-11 w-32 rounded-xl" />
                <Skeleton className="h-11 w-44 rounded-xl" />
            </div>

        </div>
    );
}

export { LoadingSkeleton }