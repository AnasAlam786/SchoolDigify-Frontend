import { Printer } from 'lucide-react'

function Header({ onPrintFront, canPrintFront }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            View Marksheet
          </h1>
          <p className="mt-3 text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Search, filter, and download student marksheets efficiently.
          </p>
        </div>
        {canPrintFront && (
          <button
            type="button"
            onClick={onPrintFront}
            className="inline-flex w-fit items-center gap-3 rounded-md border border-amber-200/50 bg-[#9b1d31] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#811729] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10">
              <Printer className="h-4 w-4" aria-hidden="true" />
            </span>
            Print front page
          </button>
        )}
      </div>
    </div>
  )
}

export default Header
