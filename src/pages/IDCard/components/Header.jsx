import React from 'react'

const Header = () => {
    return (
        // Header Content
        <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center mb-4">
                <div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                    <i className="fas fa-id-card text-white text-lg"></i>
                </div>
                <h1
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    ID Card Maker
                </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4">
                Create and download professional ID cards for your students. Search by name, filter by class, and
                select multiple cards for batch printing.
            </p>
        </div>
  )
}

export default Header
