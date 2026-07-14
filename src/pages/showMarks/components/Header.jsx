import React from 'react'

function Header() {
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
      </div>
    </div>
  )
}

export default Header
