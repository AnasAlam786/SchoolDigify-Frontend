function TransactionModalSkeletonLoader() {
  return (
    <div className="space-y-4" aria-label="Loading transactions" role="status">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse rounded-xl border border-slate-700/50 bg-[#1a2436] p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-slate-700" />
              <div className="h-7 w-56 rounded bg-slate-700" />
              <div className="h-3 w-64 rounded bg-slate-800" />
            </div>
            <div className="h-9 w-28 rounded-lg bg-slate-700" />
          </div>
          <div className="h-10 w-full rounded-lg bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export default TransactionModalSkeletonLoader;
