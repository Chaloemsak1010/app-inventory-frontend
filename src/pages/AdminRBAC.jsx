import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertCircle,
  ChevronDown,
  Check
} from "lucide-react";

const ACTIONS = ["View", "Create", "Edit", "Delete", "Manage"];
const MENU_ITEMS = [
  "All Applications",
  "Dashboard",
  "Create Application",
  "Application Details",
  "Module Register",
  "Impact Analysis",
  "Admin & Permissions"
];

export default function AdminRBAC() {
  const [roles, setRoles] = useState([
    {
      role_id: 1,
      role_name: "Viewer",
      permissions: [
        { menu_name: "All Applications", submenu_name: null, action: "View" },
        { menu_name: "Dashboard", submenu_name: null, action: "View" }
      ]
    },
    {
      role_id: 2,
      role_name: "Developer",
      permissions: [
        { menu_name: "All Applications", submenu_name: null, action: "View" },
        { menu_name: "Create Application", submenu_name: null, action: "Create" },
        { menu_name: "Application Details", submenu_name: null, action: "Edit" }
      ]
    },
    {
      role_id: 3,
      role_name: "Administrator",
      permissions: [
        { menu_name: "All Applications", submenu_name: null, action: "Delete" },
        { menu_name: "Admin & Permissions", submenu_name: null, action: "Edit" }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const filteredRoles = roles.filter(role =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        role_id: Math.max(...roles.map(r => r.role_id), 0) + 1,
        role_name: newRoleName,
        permissions: selectedPermissions.map(perm => ({
          menu_name: perm.menu,
          submenu_name: perm.submenu || null,
          action: perm.action
        }))
      };
      setRoles([...roles, newRole]);
      setNewRoleName("");
      setSelectedPermissions([]);
      setShowAddRole(false);
    }
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(r => r.role_id !== roleId));
    setDeleteConfirm(null);
  };

  const handleTogglePermission = (menu, submenu, action) => {
    const key = `${menu}-${submenu}-${action}`;
    setSelectedPermissions(prev => {
      const exists = prev.find(p => `${p.menu}-${p.submenu}-${p.action}` === key);
      
      if (action === "Manage") {
        if (exists) {
          // Deselecting "Manage" removes all permissions for this menu
          return prev.filter(p => p.menu !== menu);
        } else {
          // Selecting "Manage" adds all permissions for this menu
          const allPermissions = ACTIONS.map(act => ({ menu, submenu, action: act }));
          const filtered = prev.filter(p => p.menu !== menu);
          return [...filtered, ...allPermissions];
        }
      } else {
        if (exists) {
          return prev.filter(p => `${p.menu}-${p.submenu}-${p.action}` !== key);
        } else {
          return [...prev, { menu, submenu, action }];
        }
      }
    });
  };

  const isManageSelected = (menu) => {
    return selectedPermissions.some(p => p.menu === menu && p.action === "Manage");
  };

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="admin-rbac" />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <header className="flex justify-center lg:justify-between items-center mb-2 lg:mb-8">
          <div className="ml-8 mr-8 lg:mr-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">RBAC Configuration</h2>
            <p className="text-gray-500 text-[10px] lg:text-sm hidden lg:block mt-1">Create and manage roles with permissions</p>
          </div>
          <button
            onClick={() => setShowAddRole(true)}
            className="bg-blue-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Role
          </button>
        </header>

        {/* Search */}
        <div className="relative max-w-md mt-4 mb-2 lg:mb-4 lg:max-w-5xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-3 lg:gap-4">
          {filteredRoles.map((role) => (
            <div
              key={role.role_id}
              className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl overflow-hidden"
            >
              {/* Role Header */}
              <div className="p-3 lg:p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm lg:text-lg font-bold text-gray-800 truncate">{role.role_name}</h3>
                      <p className="text-[10px] lg:text-sm text-gray-500">{role.permissions.length} permissions</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpandedRole(expandedRole === role.role_id ? null : role.role_id)}
                    className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-600 transition-transform ${expandedRole === role.role_id ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setShowEditRole(role)}
                    className="p-1.5 lg:p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(role)}
                    className="p-1.5 lg:p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>

              {/* Permissions List */}
              {expandedRole === role.role_id && (
                <div className="p-3 lg:p-6 bg-gray-50">
                  {role.permissions.length > 0 ? (
                    <div className="space-y-2">
                      {role.permissions.map((perm, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2 lg:p-3 rounded-lg border border-gray-100"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-sm lg:text-base truncate">{perm.menu_name}</p>
                            {perm.submenu_name && (
                              <p className="text-[10px] lg:text-sm text-gray-500 truncate">{perm.submenu_name}</p>
                            )}
                          </div>
                          <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 text-[8px] lg:text-xs font-medium rounded-full ml-2 flex-shrink-0">
                            {perm.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-[10px] lg:text-sm">No permissions assigned</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl p-6 lg:p-12 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
            <p className="text-gray-500 text-[10px] lg:text-sm">No roles found</p>
          </div>
        )}
      </main>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Create New Role</h3>
              <button
                onClick={() => {
                  setShowAddRole(false);
                  setNewRoleName("");
                  setSelectedPermissions([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Manager, Analyst"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-2 lg:mb-3">Permissions</label>
                <div className="space-y-2 lg:space-y-3 max-h-64 overflow-y-auto">
                  {MENU_ITEMS.map((menu) => (
                    <div key={menu} className="border border-gray-200 rounded-lg p-2 lg:p-4">
                      <p className="font-medium text-gray-800 mb-2 text-[10px] lg:text-sm">{menu}</p>
                      <div className="flex flex-wrap gap-1 lg:gap-2">
                        {ACTIONS.map((action) => (
                          <button
                            key={`${menu}-${action}`}
                            onClick={() => handleTogglePermission(menu, null, action)}
                            className={`px-2 lg:px-3 py-1 rounded-lg text-[8px] lg:text-xs font-medium transition-colors ${
                              selectedPermissions.some(
                                p => p.menu === menu && p.submenu === null && p.action === action
                              )
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 lg:gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddRole(false);
                    setNewRoleName("");
                    setSelectedPermissions([]);
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRole}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={!newRoleName.trim()}
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Delete Role</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2 text-[10px] lg:text-sm">Are you sure you want to delete this role?</p>
              <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                <p className="font-medium text-gray-800 text-sm">{deleteConfirm.role_name}</p>
                <p className="text-[10px] lg:text-sm text-gray-500 mt-1">{deleteConfirm.permissions.length} permissions</p>
              </div>
            </div>

            <div className="flex gap-2 lg:gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRole(deleteConfirm.role_id)}
                className="flex-1 px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-[10px] lg:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
