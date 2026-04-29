import React, { useState, useEffect } from "react";
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

export default function BusinessProcessData() {
  const [domains, setDomains] = useState([]);
  const [processes, setProcesses] = useState({});
  const [subProcesses, setSubProcesses] = useState({});
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedSubProcess, setSelectedSubProcess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    config_id: null,
    config_value: "",
    inactive: false
  });
  const [formData, setFormData] = useState({
    type: "domain",
    domainId: "",
    processId: "",
    key: "",
    value: ""
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = () => {
    fetch("https://localhost:7187/api/v1/Demo/business-domain/true")
      .then(res => res.json())
      .then(data => setDomains(data))
      .catch(err => console.error("Failed to fetch domains:", err));
  };

  const fetchProcesses = (domainId) => {
    if (!processes[domainId]) {
      fetch(`https://localhost:7187/api/v1/Demo/business-process/${domainId}/true`)
        .then(res => res.json())
        .then(data => setProcesses(prev => ({ ...prev, [domainId]: data })))
        .catch(err => console.error("Failed to fetch processes:", err));
    }
  };

  const fetchSubProcesses = (processId) => {
    if (!subProcesses[processId]) {
      fetch(`https://localhost:7187/api/v1/Demo/business-sub-process/${processId}/true`)
        .then(res => res.json())
        .then(data => setSubProcesses(prev => ({ ...prev, [processId]: data })))
        .catch(err => console.error("Failed to fetch sub-processes:", err));
    }
  };

  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
    setSelectedProcess("");
    setSelectedSubProcess("");
    if (domainId) {
      fetchProcesses(domainId);
    }
  };

  const handleProcessChange = (processId) => {
    setSelectedProcess(processId);
    setSelectedSubProcess("");
    if (processId) {
      fetchSubProcesses(processId);
    }
  };

  const handleAddConfig = async () => {
    let config_group, parent_id;
    if (formData.type === "domain") {
      config_group = "BUSINESS_DOMAIN";
      parent_id = 0;
    } else if (formData.type === "process") {
      config_group = "BUSINESS_PROCESS";
      parent_id = parseInt(formData.domainId);
    } else {
      config_group = "BUSINESS_SUB_PROCESS";
      parent_id = parseInt(formData.processId);
    }

    if (formData.key && formData.value) {
      try {
        const response = await fetch("https://localhost:7187/api/v1/Demo/business-master-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            config_group,
            config_key: formData.key.toUpperCase(),
            config_value: formData.value,
            parent_id
          })
        });

        if (!response.ok) {
          throw new Error("Failed to add configuration");
        }

        // Refresh data
        setDomains([]);
        setProcesses({});
        setSubProcesses({});
        fetchDomains();
        setFormData({ type: "domain", domainId: "", processId: "", key: "", value: "" });
        setShowAddModal(false);
      } catch (err) {
        console.error("Failed to add config:", err);
        alert("Failed to add configuration. Please try again.");
      }
    }
  };

  const handleEditConfig = async () => {
    if (!editFormData.config_id || !editFormData.config_value) return;

    try {
      const response = await fetch(`https://localhost:7187/api/v1/Demo/business-master-config/${editFormData.config_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          config_value: editFormData.config_value,
          inactive: editFormData.inactive
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update configuration");
      }

      // Refresh data
      setDomains([]);
      setProcesses({});
      setSubProcesses({});
      fetchDomains();
      setEditFormData({ config_id: null, config_value: "", inactive: false });
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update config:", err);
      alert("Failed to update configuration. Please try again.");
    }
  };

  const openEditModal = (item) => {
    setEditFormData({
      config_id: item.config_id,
      config_value: item.config_value,
      inactive: item.inactive || false
    });
    setShowEditModal(true);
  };

  // Collect all items for display with full parent tracking
  const allItems = [];
  const domainMap = {};
  
  domains.forEach(domain => {
    domainMap[domain.config_id] = domain;
    allItems.push({ ...domain, level: "Domain", parent: "", domainId: domain.config_id, processId: null });
    const procs = processes[domain.config_id] || [];
    procs.forEach(proc => {
      allItems.push({ ...proc, level: "Process", parent: domain.config_value, domainId: domain.config_id, processId: proc.config_id });
      const subs = subProcesses[proc.config_id] || [];
      subs.forEach(sub => {
        allItems.push({ ...sub, level: "Sub-Process", parent: proc.config_value, domainId: domain.config_id, processId: proc.config_id });
      });
    });
  });

  // Filter items based on selection
  const filteredItems = allItems.filter(item => {
    // If a process is selected, show only that process and its sub-processes
    if (selectedProcess) {
      return item.processId === parseInt(selectedProcess) || (item.level === "Sub-Process" && item.processId === parseInt(selectedProcess));
    }
    
    // If a domain is selected, show only that domain, its processes, and their sub-processes
    if (selectedDomain) {
      return item.domainId === parseInt(selectedDomain);
    }
    
    // Otherwise show everything
    return true;
  });

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="business-process-data" />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header */}
        <header className="flex justify-center lg:justify-between items-center mb-2 lg:mb-8">
          <div className="ml-8 mr-8 lg:mr-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">Business Process Master Data</h2>
            <p className="text-gray-500 text-[10px] lg:text-sm hidden lg:block mt-1">Manage business domains, processes, and sub-processes</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
          >
            <Plus className="mr-2 w-4 h-4" /> Add Config
          </button>
        </header>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl p-3 lg:p-4 mb-2 lg:mb-6">
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="flex-1 px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain.config_id} value={domain.config_id}>
                    {domain.config_value}
                  </option>
                ))}
              </select>
            </div>
            {selectedDomain && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedProcess}
                  onChange={(e) => handleProcessChange(e.target.value)}
                  className="flex-1 px-3 lg:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Processes</option>
                  {(processes[selectedDomain] || []).map((proc) => (
                    <option key={proc.config_id} value={proc.config_id}>
                      {proc.config_value}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 lg:gap-4 mb-3 lg:mb-6">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Total Domains</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{domains.length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Total Processes</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{Object.values(processes).flat().length}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-lg p-2 lg:p-6">
            <p className="text-gray-500 text-[8px] lg:text-sm">Total Sub-Processes</p>
            <p className="text-base lg:text-3xl font-bold text-gray-800 mt-0.5 lg:mt-2">{Object.values(subProcesses).flat().length}</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-full lg:min-w-[600px]">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] md:text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0">
                <tr>
                  <th className="p-2 lg:p-4">Level</th>
                  <th className="p-2 lg:p-4">Parent</th>
                  <th className="p-2 lg:p-4">Key</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell">Value</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell">Active</th>
                  <th className="p-2 lg:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[10px] lg:text-sm">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.config_id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 lg:p-4">
                        <span className="px-2 lg:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[8px] lg:text-xs font-medium whitespace-nowrap">
                          {item.level}
                        </span>
                      </td>
                      <td className="p-2 lg:p-4">
                        <span className="text-gray-700">{item.parent}</span>
                      </td>
                      <td className="p-2 lg:p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-[8px] lg:text-xs">
                          {item.config_key}
                        </code>
                      </td>
                      <td className="p-2 lg:p-4 hidden sm:table-cell">
                        <span className="text-gray-700">{item.config_value}</span>
                      </td>
                      <td className="p-2 lg:p-4 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-[8px] lg:text-xs font-medium ${
                          item.inactive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.inactive ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="p-2 lg:p-4 text-right">
                        <div className="flex items-center justify-end gap-1 lg:gap-2">
                          <button
                            onClick={() => openEditModal(item)}
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
                    <td colSpan="6" className="p-6 lg:p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-[10px] lg:text-sm">No data found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Config Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Add New Business Config</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ type: "domain", domainId: "", processId: "", key: "", value: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, domainId: "", processId: "" })}
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="domain">Domain</option>
                  <option value="process">Process</option>
                  <option value="sub-process">Sub-Process</option>
                </select>
              </div>

              {(formData.type === "process" || formData.type === "sub-process") && (
                <div>
                  <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <select
                    value={formData.domainId}
                    onChange={(e) => {
                      setFormData({ ...formData, domainId: e.target.value, processId: "" });
                      if (e.target.value) fetchProcesses(e.target.value);
                    }}
                    className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Domain</option>
                    {domains.map((domain) => (
                      <option key={domain.config_id} value={domain.config_id}>
                        {domain.config_value}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === "sub-process" && (
                <div>
                  <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Process</label>
                  <select
                    value={formData.processId}
                    onChange={(e) => {
                      setFormData({ ...formData, processId: e.target.value });
                      if (e.target.value) fetchSubProcesses(e.target.value);
                    }}
                    className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Process</option>
                    {(processes[formData.domainId] || []).map((proc) => (
                      <option key={proc.config_id} value={proc.config_id}>
                        {proc.config_value}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                  placeholder="e.g., ACTIVE"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., Active"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 lg:gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ type: "domain", domainId: "", processId: "", key: "", value: "" });
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddConfig}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={!formData.key || !formData.value || (formData.type !== "domain" && !formData.domainId) || (formData.type === "sub-process" && !formData.processId)}
                >
                  Add Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Config Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">Edit Business Config</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({ config_id: null, config_value: "", inactive: false });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Configuration Value</label>
                <input
                  type="text"
                  value={editFormData.config_value}
                  onChange={(e) => setEditFormData({ ...editFormData, config_value: e.target.value })}
                  placeholder="e.g., Active"
                  className="w-full px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editFormData.inactive ? "true" : "false"}
                  onChange={(e) => setEditFormData({ ...editFormData, inactive: e.target.value === "true" })}
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
                    setShowEditModal(false);
                    setEditFormData({ config_id: null, config_value: "", inactive: false });
                  }}
                  className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-[10px] lg:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditConfig}
                  className="flex-1 px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-[10px] lg:text-sm"
                  disabled={!editFormData.config_value}
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