import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  User,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertCircle,
  Mail,
  Building2,
  Shield
} from "lucide-react";

const ROLES = ["Administrator", "Developer", "Viewer", "Manager", "Analyst"];
const DEPARTMENTS = ["Engineering", "Finance", "HR", "Operations", "Sales", "IT Support"];

export default function AdminUsers() {
  const [users, setUsers] = useState([
    {
      user_id: "1",
      username: "admin_user",
      email: "admin@company.com",
      department_id: 1,
      department_name: "IT Support",
      role_id: 1,
      role_name: "Administrator"
    },
    {
      user_id: "2",
      username: "sarah_johnson",
      email: "sarah.j@company.com",
      department_id: 2,
      department_name: "Engineering",
      role_id: 2,
      role_name: "Developer"
    },
    {
      user_id: "3",
      username: "mike_thompson",
      email: "mike.t@company.com",
      department_id: 1,
      department_name: "IT Support",
      role_id: 3,
      role_name: "Viewer"
    },
    {
      user_id: "4",
      username: "john_davis",
      email: "john.d@company.com",
      department_id: 3,
      department_name: "Finance",
      role_id: 4,
      role_name: "Manager"
    },
    {
      user_id: "5",
      username: "emma_wilson",
      email: "emma.w@company.com",
      department_id: 2,
      department_name: "Engineering",
      role_id: 2,
      role_name: "Developer"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterDept, setFilterDept] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department_id: "",
    role_id: ""
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "all" || user.department_id === parseInt(filterDept);
    const matchesRole = filterRole === "all" || user.role_id === parseInt(filterRole);
    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddUser = () => {
    if (formData.username && formData.email && formData.department_id && formData.role_id) {
      const newUser = {
        user_id: (Math.max(...users.map(u => parseInt(u.user_id)), 0) + 1).toString(),
        username: formData.username,
        email: formData.email,
        department_id: parseInt(formData.department_id),
        department_name: DEPARTMENTS[parseInt(formData.department_id) - 1],
        role_id: parseInt(formData.role_id),
        role_name: ROLES[parseInt(formData.role_id) - 1]
      };
      setUsers([...users, newUser]);
      setFormData({ username: "", email: "", department_id: "", role_id: "" });
      setShowAddUser(false);
    }
  };

  const handleUpdateUser = () => {
    if (formData.username && formData.email && formData.department_id && formData.role_id) {
      setUsers(
        users.map(u =>
          u.user_id === showEditUser.user_id
            ? {
              ...u,
              username: formData.username,
              email: formData.email,
              department_id: parseInt(formData.department_id),
              department_name: DEPARTMENTS[parseInt(formData.department_id) - 1],
              role_id: parseInt(formData.role_id),
              role_name: ROLES[parseInt(formData.role_id) - 1]
            }
            : u
        )
      );
      setFormData({ username: "", email: "", department_id: "", role_id: "" });
      setShowEditUser(null);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.user_id !== userId));
    setDeleteConfirm(null);
  };

  const openEditModal = (user) => {
    setShowEditUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      department_id: user.department_id.toString(),
      role_id: user.role_id.toString()
    });
  };

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="admin-users" />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <header className="flex justify-center lg:justify-between items-center mb-2 lg:mb-8">
          <div className="ml-8 mr-8 lg:mr-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-gray-500 text-[10px] lg:text-sm hidden lg:block mt-1">Manage users, departments, and role assignments</p>
          </div>
          <button
            onClick={() => {
              setShowAddUser(true);
              setFormData({ username: "", email: "", department_id: "", role_id: "" });
            }}
            className="bg-blue-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
          >
            <Plus className="mr-2 w-4 h-4" /> Add User
          </button>
        </header>

        {/* Search & Filters */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl p-3 lg:p-4 mb-2 lg:mb-6">
          <div className="flex flex-col gap-2 lg:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((dept, idx) => (
                  <option key={idx} value={idx + 1}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                {ROLES.map((role, idx) => (
                  <option key={idx} value={idx + 1}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-full lg:min-w-[600px]">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] md:text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                <tr>
                  <th className="p-2 lg:p-4">User</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell">Department</th>
                  <th className="p-2 lg:p-4 hidden md:table-cell">Role</th>
                  <th className="p-2 lg:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[10px] lg:text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                    {/* User Info */}
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[8px] lg:text-xs font-semibold flex-shrink-0">
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate text-[10px] lg:text-sm">{user.username}</p>
                          <p className="text-[8px] lg:text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-2 lg:p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-[10px] lg:text-sm truncate">{user.department_name}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-2 lg:p-4 hidden md:table-cell">
                      <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[8px] lg:text-xs font-medium whitespace-nowrap">
                        {user.role_name}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-2 lg:p-4 text-right">
                      <div className="flex items-center justify-end gap-1 lg:gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 lg:p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-1.5 lg:p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="p-6 lg:p-12 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              <p className="text-gray-500 text-[10px] lg:text-sm">No users found matching your criteria.</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-2 lg:p-4 border-t border-gray-100 flex justify-between items-center text-[9px] lg:text-xs text-gray-500">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
          </div>
        </div>
      </main>

      {/* Add/Edit User Modal */}
      {(showAddUser || showEditUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                {showEditUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => {
                  setShowAddUser(false);
                  setShowEditUser(null);
                  setFormData({ username: "", email: "", department_id: "", role_id: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="john_doe"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept, idx) => (
                    <option key={idx} value={idx + 1}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  {ROLES.map((role, idx) => (
                    <option key={idx} value={idx + 1}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 lg:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUser(false);
                    setShowEditUser(null);
                    setFormData({ username: "", email: "", department_id: "", role_id: "" });
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={showEditUser ? handleUpdateUser : handleAddUser}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={!formData.username || !formData.email || !formData.department_id || !formData.role_id}
                >
                  {showEditUser ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Delete User</h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2 text-[10px] lg:text-sm">Are you sure you want to delete this user?</p>
              <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                <p className="font-medium text-gray-800 text-sm">{deleteConfirm.username}</p>
                <p className="text-[10px] lg:text-sm text-gray-500">{deleteConfirm.email}</p>
                <p className="text-[10px] lg:text-sm text-gray-500 mt-1">{deleteConfirm.department_name}</p>
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
                onClick={() => handleDeleteUser(deleteConfirm.user_id)}
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
