import { useState } from "react";
import ManageExamModal from "./ManageExamModal";
import usePermission from "../../../hooks/usePermission";

function Header() {

    const [open, setOpen] = useState(false)
    const {hasPermission, PERMISSIONS} = usePermission()

    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/*  Left side: icon + title */}
                <div className="flex items-center gap-4">
                    <div
                        className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 shadow-xl">
                        <i className="fas fa-edit text-2xl text-indigo-400"></i>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            <span className="gradient-text">Marks Update</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base mt-1 max-w-2xl">
                            Select class, subject & exam – then enter marks seamlessly.
                        </p>
                    </div>
                </div>

                {/* Manage Exams button (if permitted) */}
                {/* {% if has_permission('lock_marks') %} */}
                {hasPermission(PERMISSIONS.LOCK_MARKS) && 
                    (<button type="button" id="manageExamsBtn" onClick={() => setOpen(true)}
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-gray-200 font-medium backdrop-blur-sm">
                        <i className="fas fa-cog text-indigo-400 group-hover:rotate-90 transition-transform duration-500"></i>
                        <span>Manage Exams</span>
                    </button>)
                }


            </div>

            <ManageExamModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </div>
    )
}

export default Header