import React from 'react'

function Navbar() {
    return (
        <nav className="bg-navbg/90 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-graduation-cap text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">SchoolDigify</h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Education ERP System</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-105">Features</a>
                        <a href="#about" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-105">About</a>
                        <a href="#contact" className="text-gray-300 hover:text-primary transition-all duration-300 hover:scale-105">Contact</a>
                        <a href="#" className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-all duration-300">
                            <i className="fas fa-play-circle mr-2"></i>Demo
                        </a>
                    </div>
                    <button className="md:hidden text-gray-300">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
