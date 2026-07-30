import { apiGet, apiPost } from "../../../api/api";

const fallbackRoles = [
  { id: "1", role_name: "Teacher", icon: "fas fa-chalkboard-teacher", color: "text-blue-400" },
  { id: "2", role_name: "Accountant", icon: "fas fa-calculator", color: "text-green-400" },
  { id: "3", role_name: "Receptionist", icon: "fas fa-phone", color: "text-pink-400" },
  { id: "4", role_name: "Admin", icon: "fas fa-user-shield", color: "text-amber-400" },
];

const roleIconMap = {
  teacher: { icon: "fas fa-chalkboard-teacher", color: "text-blue-400" },
  accountant: { icon: "fas fa-calculator", color: "text-green-400" },
  receptionist: { icon: "fas fa-phone", color: "text-pink-400" },
  admin: { icon: "fas fa-user-shield", color: "text-amber-400" },
  manager: { icon: "fas fa-user-cog", color: "text-cyan-400" },
};

function normalizeRoles(payload) {
  if (!Array.isArray(payload)) return fallbackRoles;
  return payload.map((role) => {
    const roleName = role.role_name || role.name || role.label || "Unknown";
    const normalizedRole = {
      id: String(role.id ?? role.value ?? roleName),
      role_name: roleName,
      icon: role.icon || roleIconMap[roleName.toLowerCase()]?.icon || "fas fa-user",
      color: role.color || roleIconMap[roleName.toLowerCase()]?.color || "text-slate-300",
    };
    return normalizedRole;
  });
}

export async function fetchStaffRoles() {
  try {
    const response = await apiGet("/api/get_roles");
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to load roles.");
    }

    return normalizeRoles(data.roles || data.roles_list || data || []);
  } catch (error) {
    console.error("fetchStaffRoles error", error);
    return fallbackRoles;
  }
}

export async function fetchPermissions() {
  try {
    const response = await apiGet("/api/get_permissions");
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to load permissions.");
    }
    const permissionList = data.permissions_list || data.permissions || data || [];
    if (!Array.isArray(permissionList)) return [];
    return permissionList.map((permission) => ({
      id: String(permission.id ?? permission.value ?? permission.title),
      title: permission.title || permission.name || "Unknown permission",
      description: permission.description || permission.summary || "No description available.",
      action: permission.action || permission.category || "General",
      selected: !!permission.selected,
      icon: permission.icon || "fas fa-shield-alt",
    }));
  } catch (error) {
    console.error("fetchPermissions error", error);
    return [];
  }
}

export async function fetchRolePermissions(roleId) {
  try {
    if (!roleId) return [];
    const response = await apiGet(`/api/get_role_permissions?role_id=${encodeURIComponent(roleId)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to load role permissions.");
    }
    const rolePermIds = data.permissions_list || data.permission_ids || data.permissions || [];
    if (Array.isArray(rolePermIds)) {
      return rolePermIds.map((id) => String(id));
    }
    return [];
  } catch (error) {
    console.error("fetchRolePermissions error", error);
    return [];
  }
}

export async function createStaff(payload) {
  return apiPost("/api/add_staff", payload);
}
