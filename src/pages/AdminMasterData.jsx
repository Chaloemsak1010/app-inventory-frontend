import React, { useState , useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Settings,
  Plus,
  Edit2,
  EyeOff,
  X,
  Search,
  AlertCircle,
  Filter,
  Copy
} from "lucide-react";

const CONFIG_GROUPS = [
  "Application Status",
  "Environment Types",
  "Risk Levels",
  "User Types",
  "Department Types",
  "System Settings"
];

export default function AdminMasterData() {
  const [groups, setGroups] = useState([]);
  const [masterData, setMasterData] = useState([]);
  // master config data 
  function fetchData() {
    fetch("https://localhost:7187/api/v1/Demo/master-configs")
      .then(res => res.json())
      .then(data => setMasterData(data))
      .catch(err => console.error("Failed to fetch master data:", err));
  }

  useEffect(() => {
    // when mounted, fetch master config groups and data from API
    // master config groups
    fetch("https://localhost:7187/api/v1/Demo/master-configs-groups")
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Failed to fetch groups:", err));
    // master config data 
    fetchData();
    

  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [showAddConfig, setShowAddConfig] = useState(false);
  const [showEditConfig, setShowEditConfig] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const [formData, setFormData] = useState({
    config_group: "",
    config_key: "",
    config_value: "",
    inactive: false
  });

  const filteredData = masterData.filter(config => {
  const matchesSearch =
    (config.config_key?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (config.config_value?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  const matchesGroup = filterGroup === "all" || config.config_group === filterGroup;  
  return matchesSearch && matchesGroup;
});

  const groupedData = groups.map(group => ({
    group,
    items: masterData.filter(config => config.config_group === group)
  }));

  const handleAddConfig = async () => {
    let configGroup = formData.config_group;
    
    // Handle new group creation
    if (formData.config_group === "CREATE_NEW") {
      if (!newGroupName.trim()) return;
      configGroup = newGroupName.trim();
      // Add new group if it doesn't exist
      if (!groups.includes(configGroup)) {
        setGroups([...groups, configGroup]);
      }
    }
    
    if (configGroup && formData.config_key && formData.config_value) {
      try {
        const response = await fetch("https://localhost:7187/api/v1/Demo/master-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            config_group: configGroup,
            config_key: formData.config_key,
            config_value: formData.config_value
          })
        });
        
        if (!response.ok) {
          throw new Error("Failed to add configuration");
        }
        
        const newConfig = await response.json();
        setMasterData([...masterData, newConfig]);
        setFormData({ config_group: "", config_key: "", config_value: "" });
        setNewGroupName("");
        setShowAddConfig(false);
        // master config data refresh
        fetchData();
      } catch (err) {
        console.error("Failed to add config:", err);
        alert("Failed to add configuration. Please try again.");
      }
    }
  };

  const handleUpdateConfig = async () => {
    if (!showEditConfig?.config_id || !formData.config_value) return;

    console.log("Updating config with ID:", showEditConfig.config_id);
    console.log("New value:", formData.config_value);
    console.log("Inactive status:", formData.inactive);
    
    try {
      const response = await fetch(`https://localhost:7187/api/v1/Demo/master-config/${showEditConfig.config_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          config_value: formData.config_value,
          inactive: formData.inactive
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update configuration");
      }
      
      // const updatedConfig = await response.json();
      // setMasterData(
      //   masterData.map(config =>
      //     config.config_id === showEditConfig.config_id ? updatedConfig : config
      //   )
      // );
      fetchData();
      setFormData({ config_group: "", config_key: "", config_value: "", inactive: false });
      setShowEditConfig(null);
    } catch (err) {
      console.error("Failed to update config:", err);
      alert("Failed to update configuration. Please try again.");
    }
  };

  const openEditModal = (config) => {
    setShowEditConfig(config);
    setFormData({
      config_group: config.config_group,
      config_key: config.config_key,
      config_value: config.config_value,
      inactive: config.inactive
    });
  };

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="admin-master-data" />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <header className="flex justify-center lg:justify-between items-center mb-2 lg:mb-8">
          <div className="ml-8 mr-8 lg:mr-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">Master Data Configuration</h2>
            <p className="text-gray-500 text-[10px] lg:text-sm hidden lg:block mt-1">Manage system-wide configuration data</p>
          </div>
          <button
            onClick={() => {
              setShowAddConfig(true);
              setFormData({ config_group: "", config_key: "", config_value: "" });
              setNewGroupName("");
            }}
            className="bg-blue-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Config
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
                placeholder="Search by key or value..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Group Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="flex-1 px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Groups</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 lg:gap-4 mb-3 lg:mb-6">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Total Configs</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{masterData.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Total Groups</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{groups.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Filtered</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{filteredData.length}</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-full lg:min-w-[600px]">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] md:text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                <tr>
                  <th className="p-2 lg:p-4">Group</th>
                  <th className="p-2 lg:p-4">Key</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell">Value</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell" > active </th>
                  <th className="p-2 lg:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[10px] lg:text-sm">
                {filteredData.length > 0 ? (
                  filteredData.map((config) => (
                    <tr key={config.config_id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 lg:p-4">
                        <span className="px-2 lg:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[8px] lg:text-xs font-medium whitespace-nowrap">
                          {config.config_group}
                        </span>
                      </td>
                      <td className="p-2 lg:p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-[8px] lg:text-xs">
                          {config.config_key}
                        </code>
                      </td>
                      <td className="p-2 lg:p-4 hidden sm:table-cell">
                        <span className="text-gray-700">{config.config_value}</span>
                      </td>
                      <td className="p-2 lg:p-4 hidden sm:table-cell">
                        <span className="text-gray-700">{config.inactive ? "Inactive" : "Active"}</span>
                      </td>
                      <td className="p-2 lg:p-4 text-right">
                        <div className="flex items-center justify-end gap-1 lg:gap-2">
                          <button
                            onClick={() => openEditModal(config)}
                            className="p-1.5 lg:p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Edit config"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 lg:p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-[10px] lg:text-sm">No configuration found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-2 lg:p-4 border-t border-gray-100 flex justify-between items-center text-[9px] lg:text-xs text-gray-500">
            <span>Showing {filteredData.length} of {masterData.length} configurations</span>
          </div>
        </div>
      </main>

      {/* Add Config Modal */}
      {showAddConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Add New Configuration</h3>
              <button
                onClick={() => {
                  setShowAddConfig(false);
                  setFormData({ config_group: "", config_key: "", config_value: "" });
                  setNewGroupName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Group</label>
                <select
                  value={formData.config_group}
                  onChange={(e) => {
                    setFormData({ ...formData, config_group: e.target.value });
                    if (e.target.value !== "CREATE_NEW") {
                      setNewGroupName("");
                    }
                  }}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select group</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                  <option value="CREATE_NEW">+ Create new group</option>
                </select>
              </div>

              {formData.config_group === "CREATE_NEW" && (
                <div>
                  <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">New Group Name</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., System Security"
                    className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Key</label>
                <input
                  type="text"
                  value={formData.config_key}
                  onChange={(e) => setFormData({ ...formData, config_key: e.target.value.toUpperCase() })}
                  placeholder="e.g., ACTIVE"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Value</label>
                <input
                  type="text"
                  value={formData.config_value}
                  onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
                  placeholder="e.g., Active"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 lg:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddConfig(false);
                    setFormData({ config_group: "", config_key: "", config_value: "" });
                    setNewGroupName("");
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddConfig}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={
                    !formData.config_key || 
                    !formData.config_value || 
                    (!formData.config_group || 
                     (formData.config_group === "CREATE_NEW" && !newGroupName.trim()))
                  }
                >
                  Add Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Config Modal */}
      {showEditConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Edit Configuration</h3>
              <button
                onClick={() => {
                  setShowEditConfig(null);
                  setFormData({ config_group: "", config_key: "", config_value: "", inactive: false });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Group</label>
                <input
                  type="text"
                  value={formData.config_group}
                  disabled
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Key</label>
                <input
                  type="text"
                  value={formData.config_key}
                  disabled
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm font-mono bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Value</label>
                <input
                  type="text"
                  value={formData.config_value}
                  onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
                  placeholder="e.g., Active"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.inactive ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, inactive: e.target.value === "true" })}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="false">Active</option>
                  <option value="true">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 lg:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditConfig(null);
                    setFormData({ config_group: "", config_key: "", config_value: "", inactive: false });
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateConfig}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={!formData.config_value}
                >
                  Update Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
