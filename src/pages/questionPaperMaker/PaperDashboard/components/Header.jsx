import React from 'react'

function Header({ setCreateModalOpen }) {
    return (
        <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Question Papers
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Create, manage, and customize professional question papers with ease
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <i className="fas fa-plus mr-2"></i>
                        Create New Paper
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header
