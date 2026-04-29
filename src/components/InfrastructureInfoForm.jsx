import React, { useState, useEffect } from "react";
import { Server } from "lucide-react";

const API_BASE_URL = "https://localhost:7187/api/v1/Demo";

export default function InfrastructureInfoForm({ form, onChange }) {
  const [deploymentTypes, setDeploymentTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);

  const [loading, setLoading] = useState({
    deploymentTypes: false,
    accessTypes: false
  });

  const [error, setError] = useState({
    deploymentTypes: null,
    accessTypes: null
  });

  // Helper function to fetch config groups
  const fetchConfigGroup = async (groupName, setStateFunc, loadingKey) => {
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setError(prev => ({ ...prev, [loadingKey]: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/master-configs/group/${groupName}`, {
        headers: { "accept": "*/*" }
      });
      if (!response.ok) throw new Error(`Failed to fetch ${groupName}`);
      const data = await response.json();
      setStateFunc(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(prev => ({ ...prev, [loadingKey]: err.message }));
      console.error(`Error fetching ${groupName}:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Fetch config groups on component mount
  useEffect(() => {
    fetchConfigGroup("DEPLOYMENT_TYPE", setDeploymentTypes, "deploymentTypes");
    fetchConfigGroup("ACCESS_TYPE", setAccessTypes, "accessTypes");
  }, []);

  return (
    <div className="glass-panel p-4 lg:p-8 rounded-2xl border-l-4 border-purple-500">
      <h3 className="flex items-center gap-2 lg:gap-3 text-sm lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
        <Server className="text-purple-500 w-4 h-4 lg:w-6 lg:h-6" /> Infrastructure & Network Information
      </h3>
      <p className="text-[10px] lg:text-sm text-gray-600 mb-4 lg:mb-6">
        Infrastructure team can fill this section
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-6">
        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Operating System
          </label>
          <input
            type="text"
            name="operating_system"
            value={form.operating_system}
            onChange={onChange}
            placeholder="e.g., Windows Server 2019, Ubuntu 20.04"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Compute Platform
          </label>
          <input
            type="text"
            name="compute_platform"
            value={form.compute_platform}
            onChange={onChange}
            placeholder="e.g., Docker, Kubernetes, EC2"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Service Organization
          </label>
          <input
            type="text"
            name="service_organization"
            value={form.service_organization}
            onChange={onChange}
            placeholder="Internal or External provider"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Deployment Type *
          </label>
          <select
            name="deployment_type"
            value={form.deployment_type}
            onChange={onChange}
            required
            disabled={loading.deploymentTypes}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.deploymentTypes ? "Loading..." : "Select deployment type"}
            </option>
            {deploymentTypes.map((type) => (
              <option key={type.config_id} value={type.config_id}>
                {type.config_value}
              </option>
            ))}
          </select>
          {error.deploymentTypes && <p className="text-[10px] text-red-500 mt-1">{error.deploymentTypes}</p>}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Cloud Provider
          </label>
          <input
            type="text"
            name="cloud_provider"
            value={form.cloud_provider}
            onChange={onChange}
            placeholder="e.g., AWS, Azure, GCP"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Physical Location
          </label>
          <input
            type="text"
            name="physical_location"
            value={form.physical_location}
            onChange={onChange}
            placeholder="Data center location"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Host/IP Production
          </label>
          <input
            type="text"
            name="host_ip_production"
            value={form.host_ip_production}
            onChange={onChange}
            placeholder="192.168.x.x"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Host/IP Non-Production
          </label>
          <input
            type="text"
            name="host_ip_non_production"
            value={form.host_ip_non_production}
            onChange={onChange}
            placeholder="10.0.x.x"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Production Link
          </label>
          <input
            type="url"
            name="production_link"
            value={form.production_link}
            onChange={onChange}
            placeholder="https://app.company.com"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            SharePoint Link
          </label>
          <input
            type="url"
            name="sharepoint_link"
            value={form.sharepoint_link}
            onChange={onChange}
            placeholder="https://company.sharepoint.com/..."
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Access to App *
          </label>
          <select
            name="access_to_app"
            value={form.access_to_app}
            onChange={onChange}
            required
            disabled={loading.accessTypes}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.accessTypes ? "Loading..." : "Select access type"}
            </option>
            {accessTypes.map((type) => (
              <option key={type.config_id} value={type.config_id}>
                {type.config_value}
              </option>
            ))}
          </select>
          {error.accessTypes && <p className="text-[10px] text-red-500 mt-1">{error.accessTypes}</p>}
        </div>
      </div>
    </div>
  );
}
