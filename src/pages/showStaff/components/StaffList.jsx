import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NoStaff } from "./PageStatus"
import femaleTeacher from "../../../assets/femaleTeacher.jpg"
import maleTeacher from "../../../assets/maleTeacher.jpg"
import { apiPostFormData } from "../../../api/api";

const roleBadgeClasses = {
  Teacher: 'badge-teacher',
  Administrator: 'badge-admin',
  Manager: 'badge-admin',
  Principle: 'badge-admin',
  Support: 'badge-support',
  Assistant: 'badge-assistant',
}

function StaffList({ teachers, totalClasses, onResetFilters, onDeleteSuccess, onRestoreSuccess }) {
  const [staffStatus, setStaffStatus] = useState('active')
  const [staffToDelete, setStaffToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState('')

  const visibleTeachers = teachers.filter(teacher => {
    const isDeleted = teacher.status?.toString().toLowerCase() === 'deleted'
    return staffStatus === 'deleted' ? isDeleted : !isDeleted
  })
  const hasNoResults = visibleTeachers.length === 0

  const navigate = useNavigate();

  const renderStatus = status => {
    const normalized = status?.toString().toLowerCase()
    return normalized === 'active' ? 'Active' : 'Inactive'
  }

  const getImageUrl = teacher => {
    if (teacher.image) {
      return teacher.image
    }

    return teacher.gender === 'Male' ? maleTeacher : femaleTeacher
  }

  const getAccessLevel = teacher => {
    if (teacher.total_accessible_classes >= totalClasses) {
      return 'High'
    }

    if (teacher.total_accessible_classes > 1) {
      return 'Medium'
    }

    return 'Low'
  }

  const renderAccessDisplay = teacher => {
    if (teacher.total_accessible_classes === 0) {
      return <span className="priority-warning">No Class Assign</span>
    }

    if (teacher.total_accessible_classes >= totalClasses) {
      return <span className="priority-high">All Classes</span>
    }

    return (
      <span className="priority-low">
        {teacher.accessible_classes?.join(', ') || 'Unassigned'}
      </span>
    )
  }

  const handleDelete = async () => {
    if (!staffToDelete) return

    setIsDeleting(true)
    setDeleteError('')

    try {
      const formData = new FormData()
      formData.append('staff_id', staffToDelete.id)

      const response = await apiPostFormData('/api/delete_staff_api', formData)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete staff.')
      }

      setStaffToDelete(null)
      onDeleteSuccess(staffToDelete.id)
      showAlert(200, "Staff deleted!")
    } catch (error) {
      setDeleteError(error.message)
      showAlert(400, error.message)
    } finally {
      setIsDeleting(false)
    }
  };

  const handleRestore = async (teacher) => {
    setIsRestoring(true)
    setRestoreError('')

    try {
      const formData = new FormData()
      formData.append('staff_id', teacher.id)

      const response = await apiPostFormData('/api/revoke_deleted_staff_api', formData)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to restore staff.')
      }
      showAlert(200, "Staff deleted!")
      onRestoreSuccess(teacher.id)
    } catch (error) {
      showAlert(400, error.message)
      setRestoreError(error.message)
    } finally {
      setIsRestoring(false)
    }
  };

  return (
    <>
      <div className="staff-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white">Staff Members</h2>
        </div>

        <div className="flex gap-2 mb-5 border-b border-gray-700" role="tablist" aria-label="Staff status">
          {[
            { value: 'active', label: 'Active Staff' },
            { value: 'deleted', label: 'Deleted Staff' },
          ].map(tab => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={staffStatus === tab.value}
              onClick={() => setStaffStatus(tab.value)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${staffStatus === tab.value
                ? 'text-white border-blue-500'
                : 'text-gray-400 border-transparent hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-4 text-left text-gray-400 font-medium">Staff Member</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Role</th>
                <th className="pb-4 text-left text-gray-400 font-medium">Classes</th>
                {/* <th className="pb-4 text-left text-gray-400 font-medium">Qualification</th> */}
                <th className="pb-4 text-left text-gray-400 font-medium">Access</th>
                {/* <th className="pb-4 text-left text-gray-400 font-medium">Status</th> */}
                <th className="pb-4 text-right text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {visibleTeachers.map(teacher => {
                const imageUrl = getImageUrl(teacher)
                const badgeClass = roleBadgeClasses[teacher.role_name] || 'badge-support'
                const accessLevel = getAccessLevel(teacher)

                return (
                  <tr className="hover:bg-gray-800 transition-colors" key={teacher.id}>
                    <td className="py-4 md:py-5">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cover bg-center mr-3 md:mr-4"
                          style={{ backgroundImage: `url('${imageUrl}')` }}
                        />
                        <div>
                          <div className="font-medium text-white text-sm md:text-base">{teacher.name}</div>
                          <div className="text-gray-400 text-xs md:text-sm">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${badgeClass} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium`}>
                        {teacher.role_name}
                      </span>
                    </td>
                    <td>
                      <div className="text-white text-sm md:text-base">{renderAccessDisplay(teacher)}</div>
                    </td>
                    {/* <td>
                    <div className="text-white text-sm md:text-base">
                      {teacher.qualification || <span className="priority-warning">Empty</span>}
                    </div>
                  </td> */}
                    <td>
                      <span className={`priority-${accessLevel.toLowerCase()} text-sm md:text-base`}>
                        {accessLevel}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-1 md:space-x-2">
                        {staffStatus === 'active' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => navigate(`/edit_staff/${teacher.id}`)}
                              className="action-btn bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                            >
                              <i className="fas fa-edit text-xs md:text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError('')
                                setStaffToDelete(teacher)
                              }}
                              className="action-btn bg-red-600 hover:bg-red-700 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                              aria-label={`Delete ${teacher.name}`}
                            >
                              <i className="fas fa-trash-alt text-xs md:text-sm" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(teacher)}
                            disabled={isRestoring}
                            className="action-btn bg-green-600 hover:bg-green-700 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label={`Restore ${teacher.name}`}
                          >
                            <i className="fas fa-undo text-xs md:text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {visibleTeachers.map(teacher => {
            const imageUrl = getImageUrl(teacher)
            const badgeClass = roleBadgeClasses[teacher.role_name] || 'badge-support'
            const accessLevel = getAccessLevel(teacher)
            const statusClass = teacher.status?.toString().toLowerCase() === 'active' ? 'text-success' : 'text-danger'
            return (
              <div className="mobile-staff-card" key={teacher.id}>
                <div className="mobile-staff-header">
                  <div className="mobile-staff-info">
                    <div
                      className="w-10 h-10 rounded-full bg-cover bg-center mr-3"
                      style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                    <div>
                      <div className="font-medium text-white">{teacher.name}</div>
                      <div className="text-gray-400 text-xs">{teacher.email}</div>
                    </div>
                  </div>
                  <span className={`${badgeClass} px-2 py-1 rounded-full text-xs font-medium`}>
                    {teacher.role_name}
                  </span>
                </div>
                <div className="mobile-staff-details">
                  <div className="mobile-detail-item">
                    <div className="text-gray-400 text-xs">Classes</div>
                    <div className="text-white text-sm">{renderAccessDisplay(teacher)}</div>
                  </div>
                  <div className="mobile-detail-item">
                    <div className="text-gray-400 text-xs">Qualification</div>
                    <div className="text-white text-sm">
                      {teacher.qualification || <span className="priority-warning">Empty</span>}
                    </div>
                  </div>
                  <div className="mobile-detail-item">
                    <div className="text-gray-400 text-xs">Access Level</div>
                    <div className={`priority-${accessLevel.toLowerCase()} text-sm`}>
                      {accessLevel}
                    </div>
                  </div>
                  <div className="mobile-detail-item">
                    <div className="text-gray-400 text-xs">Status</div>
                    <div className={`${statusClass} text-sm flex items-center`}>
                      <i className="fas fa-circle text-xs mr-1" /> {renderStatus(teacher.status)}
                    </div>
                  </div>
                </div>
                <div className="mobile-actions">
                  {staffStatus === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate(`/edit_staff/${teacher.id}`)}
                        className="action-btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center text-xs"
                      >
                        <i className="fas fa-edit mr-1" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError('')
                          setStaffToDelete(teacher)
                        }}
                        className="action-btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center text-xs"
                      >
                        <i className="fas fa-trash-alt mr-1" /> Delete
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRestore(teacher)}
                      disabled={isRestoring}
                      className="action-btn bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center text-xs disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <i className="fas fa-undo mr-1" /> Restore
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {hasNoResults && (<NoStaff onResetFilters={onResetFilters} />)}

        {restoreError && (
          <p className="mt-4 text-center text-sm text-red-400">{restoreError}</p>
        )}


      </div>

      {
        staffToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-staff-title">
            <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
              <h3 id="delete-staff-title" className="text-lg font-semibold text-white">Delete staff member?</h3>
              <p className="mt-2 text-sm text-gray-400">
                {staffToDelete.name} will move to the Deleted Staff tab.
              </p>
              {deleteError && <p className="mt-3 text-sm text-red-400">{deleteError}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStaffToDelete(null)}
                  disabled={isDeleting}
                  className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )
      }

    </>
  )
}

export default StaffList;
