import { useNavigate } from "react-router-dom";
import { NoStaff } from "./PageStatus"
import femaleTeacher from "../../../assets/femaleTeacher.jpg"
import maleTeacher from "../../../assets/maleTeacher.jpg"

const roleBadgeClasses = {
  Teacher: 'badge-teacher',
  Administrator: 'badge-admin',
  Manager: 'badge-admin',
  Principle: 'badge-admin',
  Support: 'badge-support',
  Assistant: 'badge-assistant',
}

function StaffList({ teachers, totalClasses, onResetFilters }) {
  const hasNoResults = teachers.length === 0

  const navigate = useNavigate();

  console.log(teachers)
  console.log(totalClasses)

  const renderStatus = status => {
    const normalized = status?.toString().toLowerCase()
    return normalized === 'active' ? 'Active' : 'Inactive'
  }

  const getImageUrl = teacher => {
    if (teacher.image_id) {
      return `https://lh3.googleusercontent.com/d/${teacher.image}=s100`
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

  return (
    <div className="staff-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">Staff Members</h2>
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
            {teachers.map(teacher => {
              const imageUrl = getImageUrl(teacher)
              const badgeClass = roleBadgeClasses[teacher.role_name] || 'badge-support'
              const accessLevel = getAccessLevel(teacher)
              const statusClass = teacher.status?.toString().toLowerCase() === 'active' ? 'text-success' : 'text-danger'

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
                  {/* <td>
                    <span className={`${statusClass} flex items-center text-sm md:text-base`}>
                      <i className="fas fa-circle text-xs mr-1 md:mr-2" />
                      {renderStatus(teacher.status)}
                    </span>
                  </td> */}
                  <td className="text-right">
                    <div className="flex justify-end space-x-1 md:space-x-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/edit_staff/${teacher.id}`)}
                        className="action-btn bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                      >
                        <i className="fas fa-edit text-xs md:text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => window.alert('Delete staff action not implemented yet.')}
                        className="action-btn bg-red-600 hover:bg-red-700 text-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
                      >
                        <i className="fas fa-trash-alt text-xs md:text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {teachers.map(teacher => {
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
                <button
                  type="button"
                  onClick={() => navigate(`/edit_staff/${teacher.id}`)}
                  className="action-btn bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg flex items-center text-xs"
                >
                  <i className="fas fa-edit mr-1" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.alert('Delete staff action not implemented yet.')}
                  className="action-btn bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center text-xs"
                >
                  <i className="fas fa-trash-alt mr-1" /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

        {hasNoResults && (<NoStaff onResetFilters={onResetFilters}/>)}
    </div>
  )
}

export default StaffList;
