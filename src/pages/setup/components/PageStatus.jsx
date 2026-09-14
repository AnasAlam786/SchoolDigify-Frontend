import { BadgeInfo } from 'lucide-react';

function SchoolSetupSkeleton() {
  return (
    <div className="min-h-screen bg-[#111010] p-6">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8 h-8 w-56 rounded-xl bg-zinc-800" />
        <div className="mb-4 h-4 w-80 rounded-lg bg-zinc-800" />
        <div className="rounded-[2rem] border border-white/10 bg-[#181818] p-8 shadow-2xl">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-20 rounded-2xl bg-zinc-900/60" />
                ))}
              </div>
            </div>
            <div className="md:col-span-5 grid gap-4">
              <div className="h-40 rounded-2xl bg-zinc-900/60" />
              <div className="h-40 rounded-2xl bg-zinc-900/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function SchoolSetupError({loadSchoolData, loadError}) {
  console.log(loadError)
  return (
         <div className="bg-[#111010] p-6 text-zinc-100 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-rose-500/20 bg-[#181818] p-8 shadow-2xl backdrop-blur-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <BadgeInfo className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">School Setup</h1>
          <p className="mt-2 text-sm text-zinc-400">{loadError}</p>
          <button
            type="button"
            onClick={loadSchoolData}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
  );
}

export {SchoolSetupSkeleton, SchoolSetupError};