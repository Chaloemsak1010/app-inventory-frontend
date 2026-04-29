import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, X } from "lucide-react";

const API_BASE_URL = "https://localhost:7187/api/v1/Demo";

export default function ServerRegister() {
  const [editingServerId, setEditingServerId] = useState(null);
  const [servers, setServers] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // BUG is date (.NET) should set to null if client didn't send it
  const [form, setForm] = useState({
    server_name: "",
    server_descriptions: "",
    ip_address: "",
    dns: "",
    cluster_name: "",
    cert_cn: "",
    cert_info: "",
    cert_issued_date: null,
    cert_expire_date: null,
    active: true,
    server_type_config_id: null,
    compute_type_config_id: null,
    os_type_config_id: null,
    landing_server_config_id: null,
    provider_config_id: null,
  });

  // Master data states
  const [serverTypes, setServerTypes] = useState([]);
  const [computeTypes, setComputeTypes] = useState([]);
  const [osTypes, setOsTypes] = useState([]);
  const [landingServers, setLandingServers] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);

  const [loading, setLoading] = useState({
    serverTypes: false,
    computeTypes: false,
    osTypes: false,
    landingServers: false,
    providerTypes: false,
  });

  const [error, setError] = useState({
    serverTypes: null,
    computeTypes: null,
    osTypes: null,
    landingServers: null,
    providerTypes: null,
  });

  const findConfigId = (list, value) => {
    console.log("List: ", list, "Value: ", value);
    if (!value) return null;

    const item = list.find((x) => x.config_value === value);
    console.log("Ex. config id", Number(item.config_id));
    return item ? Number(item.config_id) : null;
  };

  const openEdit = (server) => {
    setForm({
      server_name: server.server_name || "",
      server_descriptions: server.server_descriptions || "",
      ip_address: server.ip_address || "",
      dns: server.dns || "",
      cluster_name: server.cluster_name || "",
      cert_cn: server.cert_cn || "",
      cert_info: server.cert_info || "",

      cert_issued_date: server.cert_issued_date
        ? server.cert_issued_date.split("T")[0]
        : null,

      cert_expire_date: server.cert_expire_date
        ? server.cert_expire_date.split("T")[0]
        : null,

      active: server.active ?? true,

      server_type_config_id: findConfigId(serverTypes, server.server_type),
      compute_type_config_id: findConfigId(computeTypes, server.compute_type),
      os_type_config_id: findConfigId(osTypes, server.os_type),
      landing_server_config_id: findConfigId(
        landingServers,
        server.landing_server,
      ),
      provider_config_id: findConfigId(providerTypes, server.provider),
    });

    setEditingServerId(server.server_id);
    setShowForm(true);
  };

  // Helper function to fetch config groups
  const fetchConfigGroup = async (groupName, setStateFunc, loadingKey) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError((prev) => ({ ...prev, [loadingKey]: null }));
    try {
      const response = await fetch(
        `${API_BASE_URL}/master-configs/group/${groupName}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ${groupName}`);
      }
      const data = await response.json();
      
      setStateFunc(data || []);
    } catch (err) {
      console.error(`Error fetching ${groupName}:`, err);
      setError((prev) => ({ ...prev, [loadingKey]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Fetch all master data on component mount
  useEffect(() => {
    fetchConfigGroup("SERVER_TYPE", setServerTypes, "serverTypes");
    fetchConfigGroup("COMPUTE_TYPE", setComputeTypes, "computeTypes");
    fetchConfigGroup("OS_TYPE", setOsTypes, "osTypes");
    fetchConfigGroup("LANDING_SERVER", setLandingServers, "landingServers");
    fetchConfigGroup("PROVIDER_TYPE", setProviderTypes, "providerTypes");
  }, []);

  // -------------------------
  // Fetch server list
  // -------------------------
  const fetchServers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/servers`);
      const data = await res.json();

      const list = data.Data || [];

      // console.log("list: " + list);

      setServers(list);
      setFilteredServers(list);
    } catch (err) {
      console.error("Fetch server error", err);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // -------------------------
  // Search
  // -------------------------
  useEffect(() => {
    const result = servers.filter((s) =>
      s.server_name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredServers(result);
    setPage(1);
  }, [search, servers]);

  // -------------------------
  // Pagination
  // -------------------------
  const totalPages = Math.ceil(filteredServers.length / pageSize);

  const paginatedServers = filteredServers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const numberFields = [
    "server_type_config_id",
    "compute_type_config_id",
    "os_type_config_id",
    "landing_server_config_id",
    "provider_config_id",
  ];

  // -------------------------
  // Form change
  // -------------------------
  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? value === ""
          ? null
          : Number(value)
        : name === "active"
          ? value === "true"
          : value === ""
            ? null
            : value,
    }));
  };

  // -------------------------
  // Submit
  // -------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingServerId
      ? `${API_BASE_URL}/server/${editingServerId}`
      : `${API_BASE_URL}/server`;

    const method = editingServerId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed request");
      }

      setForm({
        server_name: "",
        server_descriptions: "",
        ip_address: "",
        dns: "",
        cluster_name: "",
        cert_cn: "",
        cert_info: "",
        cert_issued_date: null,
        cert_expire_date: null,
        active: true,
        server_type_config_id: null,
        compute_type_config_id: null,
        os_type_config_id: null,
        landing_server_config_id: null,
        provider_config_id: null,
      });

      alert(editingServerId ? "Server Updated" : "Server Created");

      setShowForm(false);
      setEditingServerId(null);

      fetchServers();
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  // Helper funtions for close form
  function closeForm() {
    setForm({
      server_name: "",
      server_descriptions: "",
      ip_address: "",
      dns: "",
      cluster_name: "",
      cert_cn: "",
      cert_info: "",
      cert_issued_date: null,
      cert_expire_date: null,
      active: true,
      server_type_config_id: null,
      compute_type_config_id: null,
      os_type_config_id: null,
      landing_server_config_id: null,
      provider_config_id: null,
    });

    setEditingServerId(null);

    setShowForm(false);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active="server-register" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Servers</h1>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add Server
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search server name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            {/* Header */}
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  Server Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">IP</th>
                <th className="px-6 py-4 text-left font-semibold">OS</th>
                <th className="px-6 py-4 text-left font-semibold">Compute</th>
                <th className="px-6 py-4 text-left font-semibold">Provider</th>
                <th className="px-6 py-4 text-left font-semibold">DNS</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y">
              {paginatedServers.map((s) => (
                <tr key={s.server_id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {s.server_name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{s.ip_address}</td>

                  <td className="px-6 py-4 text-gray-600">{s.os_type}</td>

                  <td className="px-6 py-4 text-gray-600">{s.compute_type}</td>

                  <td className="px-6 py-4 text-gray-600">{s.provider}</td>

                  <td className="px-6 py-4 text-gray-600">{s.dns}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {s.active ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-600 font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* Form Card */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[900px] shadow-lg">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-lg">
                  {editingServerId ? "Edit Server" : "Create Server"}
                </h2>

                {/* here */}
                <button onClick={() => closeForm()}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Server Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Server Name *
                  </label>
                  <input
                    name="server_name"
                    value={form.server_name}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label>Status</label>
                  <select
                    name="active"
                    value={form.active}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Server Descriptions
                  </label>
                  <textarea
                    name="server_descriptions"
                    value={form.server_descriptions}
                    onChange={handleInput}
                    rows={2}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                {/* IP Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    IP Address
                  </label>
                  <input
                    name="ip_address"
                    value={form.ip_address}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Server Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Server Type
                  </label>
                  <select
                    name="server_type_config_id"
                    value={form.server_type_config_id ?? ""}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Server Type</option>
                    {serverTypes.map((t) => (
                      <option key={t.id} value={t.config_id}>
                        {t.config_value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Compute Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Compute Type
                  </label>
                  <select
                    name="compute_type_config_id"
                    value={form.compute_type_config_id ?? ""}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Compute Type</option>
                    {computeTypes.map((t) => (
                      <option key={t.id} value={t.config_id}>
                        {t.config_value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OS Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    OS Type
                  </label>
                  <select
                    name="os_type_config_id"
                    value={form.os_type_config_id ?? ""}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select OS Type</option>
                    {osTypes.map((t) => (
                      <option key={t.id} value={t.config_id}>
                        {t.config_value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Landing Server */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Landing Server
                  </label>
                  <select
                    name="landing_server_config_id"
                    value={form.landing_server_config_id ?? ""}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Landing Type</option>
                    {landingServers.map((t) => (
                      <option key={t.id} value={t.config_id}>
                        {t.config_value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provider
                  </label>
                  <select
                    name="provider_config_id"
                    value={form.provider_config_id ?? ""}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Provider Type</option>
                    {providerTypes.map((t) => (
                      <option key={t.id} value={t.config_id}>
                        {t.config_value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cluster Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cluster Name (If Compute is K8s)
                  </label>
                  <input
                    name="cluster_name"
                    value={form.cluster_name}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* DNS */}
                <div>
                  <label className="block text-sm font-medium mb-1">DNS</label>
                  <input
                    name="dns"
                    value={form.dns}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Certificate CN */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate CN
                  </label>
                  <input
                    name="cert_cn"
                    value={form.cert_cn}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Certificate Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate Info
                  </label>
                  <input
                    name="cert_info"
                    value={form.cert_info}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Issued Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate Issued Date
                  </label>
                  <input
                    type="date"
                    name="cert_issued_date"
                    value={form.cert_issued_date}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Expire Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate Expire Date
                  </label>
                  <input
                    type="date"
                    name="cert_expire_date"
                    value={form.cert_expire_date}
                    onChange={handleInput}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Submit */}
                <div className="col-span-2 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white w-full py-2 rounded-lg"
                  >
                    {editingServerId ? "Update Server" : "Create Server"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
