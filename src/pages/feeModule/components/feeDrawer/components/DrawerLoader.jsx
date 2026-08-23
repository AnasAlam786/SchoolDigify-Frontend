import React from 'react'

function DrawerLoader() {
    return (
        <aside className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="relative flex h-full w-full flex-col bg-gray-900 shadow-2xl md:w-[800px] animate-pulse">

                <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900 p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="h-7 w-28 rounded-lg bg-slate-800"></div>
                        <div className="h-8 w-8 rounded-full bg-slate-800"></div>
                    </div>
                    <div className="mb-2 flex rounded-[16px] bg-slate-800/80 p-[6px]">
                        <div className="h-9 w-full rounded-xl bg-slate-700/60"></div>
                    </div>
                </div>

                <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto space-y-4">

                    <div className="border-b border-slate-800/60 bg-slate-900/60">
                        <div className="border border-red-900/20 bg-red-950/10 p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-800"></div>
                                    <div className="space-y-2">
                                        <div className="h-5 w-36 rounded bg-slate-800"></div>
                                        <div className="h-3 w-24 rounded bg-slate-800/70"></div>
                                    </div>
                                </div>
                                <div className="h-9 w-24 rounded-lg bg-slate-800"></div>
                            </div>
                            <div className="mt-4 flex justify-between pt-3 border-t border-slate-800">
                                <div className="h-4 w-28 rounded bg-slate-800"></div>
                                <div className="h-4 w-32 rounded bg-slate-800"></div>
                            </div>
                        </div>

                        <div className="m-4 rounded-2xl bg-slate-800/60 p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1 mr-4">
                                    <div className="h-6 w-40 rounded bg-slate-700"></div>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="h-6 w-32 rounded-lg bg-slate-700/60"></div>
                                        <div className="h-6 w-20 rounded-lg bg-slate-700/60"></div>
                                        <div className="h-6 w-24 rounded-lg bg-slate-700/60"></div>
                                        <div className="h-6 w-28 rounded-lg bg-slate-700/60"></div>
                                    </div>
                                </div>
                                <div className="h-16 w-16 shrink-0 rounded-full bg-slate-700 border-2 border-slate-600"></div>
                            </div>
                        </div>
                    </div>

                    <div className="m-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-32 rounded bg-slate-800"></div>
                            <div className="h-5 w-20 rounded-full bg-slate-800"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                            <div className="h-28 rounded-2xl border border-slate-800 bg-slate-800/40 p-3 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                    <div className="h-4 w-16 rounded bg-slate-700"></div>
                                    <div className="h-4 w-10 rounded bg-slate-700"></div>
                                </div>
                                <div className="h-8 w-full rounded bg-slate-700/50"></div>
                            </div>
                        </div>
                    </div>

                    <div className="m-4 rounded-2xl border border-slate-800 bg-slate-800/20 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-24 rounded bg-slate-800"></div>
                            <div className="h-5 w-16 rounded-full bg-slate-800"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="h-24 rounded-2xl border border-slate-800 bg-slate-800/40 p-3"></div>
                            <div className="h-24 rounded-2xl border border-slate-800 bg-slate-800/40 p-3"></div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-800 space-y-4">
                        <div className="space-y-3">
                            <div className="h-5 w-36 rounded bg-slate-800"></div>
                            <div className="flex justify-between"><div className="h-4 w-32 rounded bg-slate-800/60"></div><div className="h-4 w-12 rounded bg-slate-800/60"></div></div>
                            <div className="flex justify-between"><div className="h-4 w-28 rounded bg-slate-800/60"></div><div className="h-4 w-12 rounded bg-slate-800/60"></div></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-28 rounded bg-slate-800"></div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="h-16 rounded-xl bg-slate-800/60 border border-slate-700/50"></div>
                                <div className="h-16 rounded-xl bg-slate-800/60 border border-slate-700/50"></div>
                                <div className="h-16 rounded-xl bg-slate-800/60 border border-slate-700/50"></div>
                                <div className="h-16 rounded-xl bg-slate-800/60 border border-slate-700/50"></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 bg-gray-900 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="h-12 flex-1 rounded-xl bg-slate-800"></div>
                        <div className="h-12 flex-1 rounded-xl bg-blue-900/40 border border-blue-700/30"></div>
                    </div>
                </div>

            </div>
        </aside>
  )
}

export default DrawerLoader
