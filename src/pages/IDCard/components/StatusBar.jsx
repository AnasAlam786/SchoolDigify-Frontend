import React from 'react'

function StatusBar({totalSelected = 0, totalOverall=0}) {
    return (
        <>
            {/* <!-- Status Bar --> */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6 border border-gray-700 m-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-400">
                        <i className="fas fa-check-circle"></i>
                        <span className="font-semibold">Selected: {totalSelected}</span> 
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                        <i className="fas fa-users"></i>
                        Total : <span className="font-semibold">{totalOverall}</span>
                    </div>
                </div>
            </div>

        </>
    )
}

export default StatusBar
