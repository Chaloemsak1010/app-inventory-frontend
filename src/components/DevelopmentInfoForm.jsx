// At the backend Everything [Dev info , Modules , Shared Modules] link together by APP ID ***Not dev id.

import React, { useEffect, useState } from "react";
import { Server, Plus, Trash, X } from "lucide-react";
import Swal from "sweetalert2";

import TooltipLabel from "@/components/Tooltips.jsx";
import { fieldDescriptions } from "@/components/fieldDescriptions";

import { Combobox } from "@headlessui/react";

const API_BASE = "https://localhost:7187/api/v1/Demo";

function ServerSearch({ server_name, servers, value, onChange }) {
  const [query, setQuery] = useState("");

  const filteredServers =
    query === ""
      ? servers
      : servers.filter((server) =>
          server.server_name.toLowerCase().includes(query.toLowerCase()),
        );

  const selectedServer = servers.find((s) => s.server_id === value);

  return (
    <Combobox value={selectedServer} onChange={(server) => onChange(server)}>
      <div className="relative">
        <Combobox.Input
          className="w-full border rounded-lg px-3 py-2"
          displayValue={(server) => server?.server_name || ""}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={server_name || "Search server..."}
        />

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border shadow-lg">
          {filteredServers.map((server) => (
            <Combobox.Option
              key={server.server_id}
              value={server}
              className={({ active }) =>
                `cursor-pointer px-3 py-2 ${
                  active ? "bg-blue-500 text-white" : ""
                }`
              }
            >
              {server.server_name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

// function DependencyModulesSearch({ modules, value, onChange }) {
//   const [query, setQuery] = useState("");

//   const filtered =
//     query === ""
//       ? modules
//       : modules.filter((m) =>
//           m.module_name.toLowerCase().includes(query.toLowerCase()),
//         );

//   const addModule = (module) => {
//     if (!value.includes(module.module_id)) {
//       onChange([...value, module.module_id]);
//     }
//     setQuery("");
//   };

//   const removeModule = (id) => {
//     onChange(value.filter((m) => m !== id));
//   };

//   return (
//     <div className="w-full">
//       {/* selected tags */}
//       <div className="flex flex-wrap gap-2 mb-2">
//         {value.map((id) => {
//           const mod = modules.find((m) => m.module_id === id);

//           return (
//             <span
//               key={id}
//               className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
//             >
//               {mod?.module_name}

//               <button onClick={() => removeModule(id)}>✕</button>
//             </span>
//           );
//         })}
//       </div>

//       {/* search input */}
//       <input
//         className="w-full border rounded-lg px-3 py-2"
//         placeholder="Search dependency modules..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {/* dropdown */}
//       {query && (
//         <div className="border mt-1 rounded-lg bg-white max-h-40 overflow-auto shadow">
//           {filtered.map((module) => (
//             <div
//               key={module.module_id}
//               onClick={() => addModule(module)}
//               className="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
//             >
//               {module.module_name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default function DevelopmentInfoForm({ appId }) {
  // General DEV info form state
  const [form, setForm] = useState({});

  // product_owner: "",
  //   frontend_stack: "",
  //   backend_stack: "",
  //   frameworks: "",
  //   runtime: "",
  //   auth_provider: "",
  //   auth_method: "",
  //   mfa_enabled: false,
  //   token_policy: "",
  //   pdpa_data: "",
  //   database_system: "",

  // For general dev info
  const [isEditMode, setIsEditMode] = useState(false);

  // Hold modules fetched from API for this app
  const [appModules, setAppModules] = useState([]);

  const [serviceTypes, setServiceTypes] = useState([]);
  const [hostTypes, setHostTypes] = useState([]);
  const [accessTypes, setAccessTypes] = useState([]);

  const [servers, setServers] = useState([]);

  const [allModules, setAllModules] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);

  // Store modules already attached to the selected parent module
  // module <--> module
  const [attachedDependencies, setAttachedDependencies] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7187/api/v1/Demo/modules")
      .then((res) => res.json())
      .then((data) => setAllModules(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch modules attached to the current app
  useEffect(() => {
    if (!appId) {
      setAppModules([]);
      return;
    }

    fetch(`${API_BASE}/impact/${appId}/modules`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched app modules:", data);
        setAppModules(data || []);
      })
      .catch((err) => {
        console.error("Error fetching app modules:", err);
        setAppModules([]);
      });
  }, [appId]);

  const filteredModules = allModules.filter((m) => {

    console.log("Filtering module:", m.module_name);
    // Filter by search term
    const matchesSearch = (m.module_name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    // Exclude already-attached dependencies and already selected modules
    const isNotAttached = !attachedDependencies.find(
      (dep) => dep.module_id === m.module_id,
    );
    const isNotSelected = !selectedModules.find(
      (sel) => sel.module_id === m.module_id,
    );

    return matchesSearch && isNotAttached && isNotSelected;
  });

  const addSharedModule = (module) => {
    if (!selectedModules.find((m) => m.module_id === module.module_id)) {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const removeSharedModule = (id) => {
    setSelectedModules(selectedModules.filter((m) => m.module_id !== id));
  };

  useEffect(() => {
    fetch("https://localhost:7187/api/v1/Demo/servers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Server data :", data.Data);
        setServers(data.Data); // your API response
      });
  }, []);

  useEffect(() => {
    fetchConfig("SERVICE_TYPE", setServiceTypes);
    fetchConfig("HOST_TYPE", setHostTypes);
    fetchConfig("ACCESS_TYPE", setAccessTypes);
  }, []);

  const fetchConfig = async (group, setter) => {
    try {
      const res = await fetch(`${API_BASE}/master-configs/group/${group}`);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDevChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      // If the input is a checkbox, use the boolean 'checked' property
      // otherwise, use the standard 'value' string
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Fetch existing DEV info to pre-fill form when appId changes
  useEffect(() => {
    if (!appId) return;

    fetch(`https://localhost:7187/api/v1/Demo/app/dev/${appId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched dev info:", data);

        if (data.StatusCode === "500") return;

        if (data.dev_id) {
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
        }

        setForm(data);
      })
      .catch((err) => console.error(err));
  }, [appId]);

  const handleSubmitGeneralDevInfo = async () => {
    if (!appId) {
      alert("Please create app overview first.");
      return;
    }

    try {
      const payload = {
        application_id: appId,
        product_owner: form.product_owner,
        auth_provider: form.auth_provider,
        auth_method: form.auth_method,
        mfa_enabled: form.mfa_enabled,
        token_policy: form.token_policy,
        pdpa_data: form.pdpa_data,
        database_system: form.database_system,
        frontend: form.frontend,
        backend: form.backend,
        framework: form.frameworks,
        runtime: form.runtime,
      };

      const method = isEditMode ? "PATCH" : "POST";
      const url = isEditMode
        ? `${API_BASE}/app/dev/${appId}`
        : `${API_BASE}/app/dev`;

      console.log("Mode:", isEditMode ? "UPDATE" : "CREATE");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res);

      // ALWAYS refetch (not only update)
      const fresh = await fetch(`${API_BASE}/app/dev/${appId}`);
      const freshData = await fresh.json();

      setForm({
        product_owner: freshData.product_owner || "",
        frontend: freshData.frontend || "",
        backend: freshData.backend || "",
        frameworks: freshData.framework || "",
        runtime: freshData.runtime || "",
        auth_provider: freshData.auth_provider || "",
        auth_method: freshData.auth_method || "",
        mfa_enabled: freshData.mfa_enabled || false,
        token_policy: freshData.token_policy || "",
        pdpa_data: freshData.pdpa_data || "",
        database_system: freshData.database_system || "",
        dev_id: freshData.dev_id,
      });

      // after create → switch to edit mode
      setIsEditMode(true);

      alert(` ${isEditMode ? "Updated" : "Created"} successfully!`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Save Shared Modules: attach existing modules to app.
  const [parentModuleId, setParentModuleId] = useState("");

  // Fetch already-attached dependencies when parent module is selected
  useEffect(() => {
    if (!parentModuleId) {
      setAttachedDependencies([]);
      return;
    }

    fetch(`https://localhost:7187/api/v1/Dependency/depend-on/${parentModuleId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched attached dependencies:", data);
        // Extract array from the keyed object
        const dependencyArray = data[parentModuleId] || [];
        if (dependencyArray.length === 0) {
          setAttachedDependencies([]);
        } else {
          setAttachedDependencies(dependencyArray);
        }
      })
      .catch((err) => {
        console.error("Error fetching attached dependencies:", err);
        setAttachedDependencies([]);
      });
  }, [parentModuleId]);

  const handleSubmitSharedModules = async () => {
    if (!parentModuleId) {
      alert("Please select a parent module.");
      return;
    }

    if (selectedModules.length === 0) {
      alert("Please select at least one module to attach.");
      return;
    }

    try {
      // Extract module IDs from selected modules
      const moduleIds = selectedModules.map((m) => m.module_id);

      console.log(
        "Attaching modules:",
        moduleIds,
        "to parent module ID:",
        parentModuleId,
      );

      const res = await fetch(
        `https://localhost:7187/api/v1/Dependency/modele-attach/${parentModuleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moduleIds),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to attach modules");
      }

      console.log("Modules attached successfully");

      // Clear selected modules and parent module after successful submission
      setSelectedModules([]);
      setParentModuleId("");
      setSearch("");

      alert("Dependency modules attached successfully!");
    } catch (err) {
      console.error("Error attaching modules:", err);
      alert("Error: " + err.message);
    }
  };

  // Handle SrcCodes array operations
  const addSrcCode = () => {
    setCurrentModule({
      ...currentModule,
      SrcCodes: [...currentModule.SrcCodes, { address_src_code: "" }],
    });
  };

  const removeSrcCode = (index) => {
    setCurrentModule({
      ...currentModule,
      SrcCodes: currentModule.SrcCodes.filter((_, i) => i !== index),
    });
  };

  const updateSrcCode = (index, value) => {
    const updated = [...currentModule.SrcCodes];
    // Preserve src_code_id if it exists (for existing src codes)
    updated[index] = {
      ...updated[index],
      address_src_code: value,
    };
    setCurrentModule({
      ...currentModule,
      SrcCodes: updated,
    });
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // simple & effective
  };

  const [currentModule, setCurrentModule] = useState({
    module_id: "",
    module_name: "",
    service_type_config_id: "",
    host_type_config_id: "",
    access_to_app_config_id: "",
    server_id: "",
    server_name: "",
    host_ip: "",
    dns: "",
    cert_info: "",
    cert_cn: "",
    cert_issued_date: "",
    cert_expire_date: "",
    SrcCodes: [],
  });

  const [selectedServerForAttach, setSelectedServerForAttach] = useState(null);

  const initialModule = {
    module_id: "",
    module_name: "",
    service_type_config_id: "",
    host_type_config_id: "",
    access_to_app_config_id: "",
    server_name: "",
    server_id: "",
    host_ip: "",
    dns: "",
    cert_info: "",
    cert_cn: "",
    cert_issued_date: "",
    cert_expire_date: "",
    SrcCodes: [],
  };

  // Add/Update Module to API
  const handleSubmitModule = async () => {
    // console.log("Submitting module:", currentModule);

    // Validation: Check required fields
    if (!currentModule.module_name || currentModule.module_name.trim() === "") {
      alert("Module name is required");
      return;
    }

    try {
      const isExistingModule = !!currentModule.module_id;

      if (isExistingModule) {
        // UPDATE existing module with PATCH
        // Include SrcCodes with proper structure: existing have src_code_id, new ones don't
        const updatePayload = {
          module_name: currentModule.module_name,
          service_type_config_id: Number(currentModule.service_type_config_id) || null,
          host_ip: currentModule.host_ip,
          host_type_config_id: Number(currentModule.host_type_config_id) || null,
          access_to_app_config_id: Number(currentModule.access_to_app_config_id) || null,
          cert_issued_date: currentModule.cert_issued_date || null,
          cert_expire_date: currentModule.cert_expire_date || null,
          SrcCodes: currentModule.SrcCodes
        };

        const res = await fetch(
          `https://localhost:7187/api/v1/Demo/modules/${currentModule.module_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePayload),
          },
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.MessageStatus || "Failed to update module");
        }

        alert("Module updated successfully!");
      } else {
        // CREATE new module with POST (send as array)
        const createPayload = {
          module_name: currentModule.module_name,
          service_type_config_id: Number(currentModule.service_type_config_id) || null,
          host_ip: currentModule.host_ip,
          host_type_config_id: Number(currentModule.host_type_config_id) || null,
          access_to_app_config_id: Number(currentModule.access_to_app_config_id) || null,
          cert_issued_date: currentModule.cert_issued_date || null,
          cert_expire_date: currentModule.cert_expire_date|| null,
          SrcCodes:
            currentModule.SrcCodes && currentModule.SrcCodes.length > 0
              ? currentModule.SrcCodes
              : []
        };


        console.log("Create module payload:", createPayload);

       

        console.log("Submitting module:", createPayload);

        const res = await fetch(
          `https://localhost:7187/api/v1/Demo/modules?appId=${appId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createPayload),
          },
        );

        console.log("Create module response:", res);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.MessageStatus || "Failed to create module");
        }

        const responseData = await res.json();
        console.log("Module created with IDs:", responseData.Data.module_ids);
        alert("Module created successfully!");
      }

      // Refresh app modules list
      const refreshRes = await fetch(
        `https://localhost:7187/api/v1/Demo/impact/${appId}/modules`,
      );
      const refreshData = await refreshRes.json();
      setAppModules(refreshData || []);

      // Reset form after successful submission
      setCurrentModule(initialModule);
      setSelectedServerForAttach(null);
    } catch (err) {
      console.error("Error submitting module:", err);
      alert("Error: " + err.message);
    }
  };

  // Fetch module details for editing
  const fetchModuleDetails = async (moduleId) => {
    try {
      const res = await fetch(
        `https://localhost:7187/api/v1/Module/details/${moduleId}`,
      );
      const response = await res.json();

      //  console.log("Fetched module details for editing:", response);

      if (response.StatusCode === "200" && response.Data) {
        const data = response.Data;
        setCurrentModule({
          module_id: data.module_id || "",
          module_name: data.module_name || "",
          service_type_config_id: data.service_type_config_id || "",
          host_type_config_id: data.host_type_config_id || "",
          access_to_app_config_id: data.access_to_app_config_id || "",
          server_id: data.server_id || "",
          server_name: data.server_name || "",
          host_ip: data.host_ip || "",
          dns: "",
          cert_info: "",
          cert_cn: "",
          cert_issued_date: formatDateForInput(data.cert_issued_date),
          cert_expire_date: formatDateForInput(data.cert_expire_date),
          SrcCodes: data.SrcCodes || [],
        });

        // Set the selected server for attachment display
        if (data.server_id) {
          const server = servers.find((s) => s.server_id === data.server_id);
          setSelectedServerForAttach(server || null);
        }
      }
    } catch (err) {
      console.error("Error fetching module details:", err);
      alert("Failed to fetch module details");
    }
  };

  // Attach module to server using new API
  const handleAttachServerToModule = async () => {
    if (!currentModule.module_id) {
      alert("Please create/save the module first before attaching a server.");
      return;
    }

    if (!selectedServerForAttach || !selectedServerForAttach.server_id) {
      alert("Please select a server to attach.");
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:7187/api/v1/Demo/server/modules/${currentModule.module_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedServerForAttach.server_id),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to attach server to module",
        );
      }

      // Update currentModule with the attached server info
      setCurrentModule({
        ...currentModule,
        server_id: selectedServerForAttach.server_id,
        server_name: selectedServerForAttach.server_name,
      });

      Swal.fire({
        title: "Success!",
        text: `Server "${selectedServerForAttach.server_name}" attached to module successfully.`,
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (err) {
      console.error("Error attaching server:", err);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Detach module from server using new API
  const handleDetachServerFromModule = async () => {
    if (!currentModule.module_id) {
      alert("No module to detach from.");
      return;
    }

    const result = await Swal.fire({
      title: "Detach Server?",
      text: `Are you sure you want to detach "${currentModule.server_name}" from this module?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Detach",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      // Send null/empty to detach (set server_id to null)
      const res = await fetch(
        `https://localhost:7187/api/v1/Demo/server/modules/${currentModule.module_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(null),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to detach server from module",
        );
      }

      // Clear server info from currentModule
      setCurrentModule({
        ...currentModule,
        server_id: "",
        server_name: "",
      });
      setSelectedServerForAttach(null);

      Swal.fire({
        title: "Detached!",
        text: "Server has been detached successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (err) {
      console.error("Error detaching server:", err);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleEditAppModule = (moduleId) => {
    // Fetch full module details from API for editing
    fetchModuleDetails(moduleId);
  };

  // De-attach dependency module from parent module
  const handleDeattachModule = async (childModuleId, childModuleName) => {
    const result = await Swal.fire({
      title: "De-attach Module?",
      text: `Are you sure you want to remove "${childModuleName}" from dependencies?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Remove it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `https://localhost:7187/api/v1/Dependency/modele-deattach/${parentModuleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ child_id: childModuleId }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.MessageStatus || "Failed to de-attach module",
        );
      }

      // Refresh attached dependencies
      const refreshRes = await fetch(
        `https://localhost:7187/api/v1/Dependency/depend-on/${parentModuleId}`,
      );
      const refreshData = await refreshRes.json();
      const dependencyArray = refreshData[parentModuleId] || [];
      setAttachedDependencies(dependencyArray);

      Swal.fire({
        title: "Removed!",
        text: `"${childModuleName}" has been de-attached successfully.`,
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (err) {
      console.error("Error de-attaching module:", err);
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const inputStyle =
    "w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  return (
    <div className="glass-panel p-4 lg:p-8 rounded-2xl border-l-4 border-green-500">
      <h3 className="flex items-center gap-2 lg:gap-4 text-sm lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
        <Server className="text-green-500 w-4 h-4 lg:w-6 lg:h-6" />
        Development Information {appId ? "For App ID: " + appId : ""}{" "}
        {isEditMode ? "(Edit Mode)" : "(Create Mode)"}
      </h3>

      {/* DEV INFO */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-6">
        <DevInput
          label="Product Owner"
          name="product_owner"
          value={form.product_owner}
          onChange={handleDevChange}
          placeholder={"Gmail"}
        />
        <DevInput
          label="Frontend Stack"
          name="frontend"
          value={form.frontend}
          onChange={handleDevChange}
        />
        <DevInput
          label="Backend Stack"
          name="backend"
          value={form.backend}
          onChange={handleDevChange}
        />
        <DevInput
          label="Frameworks"
          name="frameworks"
          value={form.frameworks}
          onChange={handleDevChange}
        />
        <DevInput
          label="Runtime"
          name="runtime"
          value={form.runtime}
          onChange={handleDevChange}
        />
        <DevInput
          label="Auth Provider"
          name="auth_provider"
          value={form.auth_provider}
          onChange={handleDevChange}
        />
        <DevInput
          label="Auth Method"
          name="auth_method"
          value={form.auth_method}
          onChange={handleDevChange}
          description={fieldDescriptions.authentication_method}
        />
        <DevInput
          label="Token Policy"
          name="token_policy"
          value={form.token_policy}
          onChange={handleDevChange}
        />
        <DevInput
          label="PDPA Data Handling"
          name="pdpa_data"
          value={form.pdpa_data}
          onChange={handleDevChange}
        />
        <DevInput
          label="Database System"
          name="database_system"
          value={form.database_system}
          onChange={handleDevChange}
        />
        <DevInput
          label="MFA Enabled"
          name="mfa_enabled"
          type="checkbox"
          value={form.mfa_enabled}
          onChange={handleDevChange}
        />
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          type="button"
          onClick={handleSubmitGeneralDevInfo}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {/* should depend on dev data */}
          {Object.keys(form).length > 0
            ? "Update General Dev Info"
            : "Save General Dev Info"}
        </button>
      </div>

      {/* MODULE SECTION */}

      <h3 className="text-sm lg:text-lg font-bold mt-6 mb-4">Modules</h3>
      <div className="border rounded-xl p-4 mb-6 bg-white shadow">
        <h4 className="font-semibold mb-3">
          {currentModule.module_id ? "Edit Module" : "Create Module"}
        </h4>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            name="module_name"
            placeholder="Module Name"
            value={currentModule.module_name}
            onChange={(e) =>
              setCurrentModule({
                ...currentModule,
                module_name: e.target.value,
              })
            }
            className={inputStyle}
          />

          <select
            name="service_type_config_id"
            value={currentModule.service_type_config_id}
            onChange={(e) =>
              setCurrentModule({
                ...currentModule,
                service_type_config_id: e.target.value,
              })
            }
            className={inputStyle}
          >
            <option value="">Service Type</option>
            {serviceTypes.map((s) => (
              <option key={s.config_id} value={s.config_id}>
                {s.config_value}
              </option>
            ))}
          </select>

          <select
            name="host_type_config_id"
            value={currentModule.host_type_config_id}
            onChange={(e) =>
              setCurrentModule({
                ...currentModule,
                host_type_config_id: e.target.value,
              })
            }
            className={inputStyle}
          >
            <option value="">Host Type</option>
            {hostTypes.map((h) => (
              <option key={h.config_id} value={h.config_id}>
                {h.config_value}
              </option>
            ))}
          </select>

          <select
            name="access_to_app_config_id"
            value={currentModule.access_to_app_config_id}
            onChange={(e) =>
              setCurrentModule({
                ...currentModule,
                access_to_app_config_id: e.target.value,
              })
            }
            className={inputStyle}
          >
            <option value="">Access Type</option>
            {accessTypes.map((a) => (
              <option key={a.config_id} value={a.config_id}>
                {a.config_value}
              </option>
            ))}
          </select>

          <input
            placeholder="Host IP"
            value={currentModule.host_ip}
            onChange={(e) =>
              setCurrentModule({ ...currentModule, host_ip: e.target.value })
            }
            className={inputStyle}
          />
          <input
            placeholder="DNS"
            value={currentModule.dns}
            onChange={(e) =>
              setCurrentModule({ ...currentModule, dns: e.target.value })
            }
            className={inputStyle}
          />

          <input
            placeholder="Cert Info"
            value={currentModule.cert_info}
            onChange={(e) =>
              setCurrentModule({ ...currentModule, cert_info: e.target.value })
            }
            className={inputStyle}
          />

          <input
            placeholder="Cert CN"
            value={currentModule.cert_cn}
            onChange={(e) =>
              setCurrentModule({ ...currentModule, cert_cn: e.target.value })
            }
            className={inputStyle}
          />
          <div></div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cert-issued-date">Cert Issued Date</label>
            <input
              type="date"
              id="cert-issued-date"
              value={currentModule.cert_issued_date}
              onChange={(e) =>
                setCurrentModule({
                  ...currentModule,
                  cert_issued_date: e.target.value,
                })
              }
              className={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="cert-expire-date">Cert Expire Date</label>
            <input
              id="cert-expire-date"
              type="date"
              value={currentModule.cert_expire_date}
              onChange={(e) =>
                setCurrentModule({
                  ...currentModule,
                  cert_expire_date: e.target.value,
                })
              }
              className={inputStyle}
            />
          </div>
        </div>

        {/* SOURCE CODE SECTION */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold text-gray-700">
              Source Code Addresses
            </h5>
            <button
              type="button"
              onClick={addSrcCode}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Source Code
            </button>
          </div>

          {currentModule.SrcCodes.length === 0 && (
            <p className="text-gray-400 text-sm mb-4">
              No source codes added yet
            </p>
          )}

          {currentModule.SrcCodes.map((src, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="e.g., /uat/module.git or /Production.net"
                value={src.address_src_code || ""}
                onChange={(e) => updateSrcCode(index, e.target.value)}
                className={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeSrcCode(index)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* SERVER ATTACHMENT SECTION */}
        {
          <div className="mt-6 pt-4 border-t">
            <h5 className="font-semibold text-gray-700 mb-3">
              Server Assignment
            </h5>

            {!currentModule.server_id ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <ServerSearch
                    server_name=""
                    servers={servers}
                    value={selectedServerForAttach?.server_id || ""}
                    onChange={(server) => setSelectedServerForAttach(server)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAttachServerToModule}
                  disabled={!selectedServerForAttach}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm disabled:bg-gray-400"
                >
                  Attach
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {currentModule.server_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentModule.server_id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDetachServerFromModule}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Detach
                </button>
              </div>
            )}
          </div>
        }

        <div className="flex justify-end gap-2 mt-4">
          {currentModule.module_id && (
            <button
              onClick={() => {
                setCurrentModule(initialModule);
                setSelectedServerForAttach(null);
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Clear Form
            </button>
          )}

          <button
            onClick={handleSubmitModule}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentModule.module_id ? "Update Module" : "Create Module"}
          </button>
        </div>

        {/* No preview card needed - form directly submits to API */}
      </div>

      {/* APP MODULES TABLE */}
      <div>
        <h1 className="text-lg font-bold">
          Modules that own by this app{" "}
          {appId ? "For App ID: " + appId : ""}{" "}
        </h1>
      </div>
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Module Name</th>
            <th className="p-2 text-left">Module ID</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appModules.length > 0 ? (
            appModules.map((m) => (
              <tr key={m.module_id} className="border-t">
                <td className="p-2">{m.module_name}</td>
                <td className="p-2 text-xs text-gray-500 font-mono">
                  {m.module_id}
                </td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditAppModule(m.module_id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit module"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No modules attached yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DEPENDENCY/SHARED MODULES SECTION */}
      <h3 className="text-sm lg:text-lg font-bold mt-8 mb-4">
        Attach Dependency Modules
      </h3>

      <div className="border rounded-xl p-4 bg-white shadow">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Parent Module
          </label>
          <select
            value={parentModuleId}
            onChange={(e) => setParentModuleId(e.target.value)}
            className={inputStyle}
          >
            <option value="">--Choose a module--</option>
            {appModules.map((m) => (
              <option key={`parent-${m.module_id}`} value={m.module_id}>
                {m.module_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Note: Select a module from this app to attach dependency modules.
            Already attached modules will be shown and automatically excluded
            from selection.
          </p>
        </div>

        {/* ALREADY ATTACHED DEPENDENCIES */}
        {parentModuleId && attachedDependencies.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">
              Already Attached Dependencies ({attachedDependencies.length})
            </h4>
            <div className="space-y-2">
              {attachedDependencies.map((dep) => (
                <div
                  key={`attached-${dep.module_id}`}
                  className="flex items-center gap-2 justify-between bg-white p-2 rounded border border-blue-100"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-green-600">✓</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {dep.module_name}
                        {dep.parent_app_id && dep.parent_app_name
                          ? ` From App ID: ${dep.parent_app_id} , App Name: ${dep.parent_app_name}`
                          : ""}
                      </p>
                      <p className="text-xs text-gray-500">{dep.module_id}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeattachModule(dep.module_id, dep.module_name)
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center gap-1 whitespace-nowrap"
                    title="De-attach this module"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search and Add Available Modules
          </label>
          <input
            type="text"
            placeholder="Search module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          />

          {/* SEARCH RESULTS */}
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            {filteredModules.length > 0 ? (
              filteredModules.map((module, index) => (
                <div
                  key={`filtered-${module.module_id}-${index}`}
                  className="flex justify-between items-center p-2 border-b hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {module.module_name}{" "}
                      {module.parent_app_id && module.parent_app_name
                        ? ` From App ID: ${module.parent_app_id} , App Name: ${module.parent_app_name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {module.module_type} • {module.host_type}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addSharedModule(module)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500">No available modules</p>
            )}
          </div>
        </div>

        {/* SELECTED MODULES */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">
            Modules to Attach as Dependencies
          </h4>

          {selectedModules.length === 0 && (
            <p className="text-gray-400 text-sm">No modules selected</p>
          )}

          {selectedModules.map((module) => (
            <div
              key={`selected-${module.module_id}`}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
            >
              <span>{module.module_name}</span>

              <button
                type="button"
                onClick={() => removeSharedModule(module.module_id)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleSubmitSharedModules}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            disabled={!parentModuleId || selectedModules.length === 0}
          >
            Attach Dependencies
          </button>
        </div>
      </div>
    </div>
  );
}

/* DEV INPUT COMPONENT */

function DevInput({
  label,
  name,
  value,
  onChange,
  description,
  placeholder,
  type = "text",
}) {
  const isCheckbox = type === "checkbox";

  return (
    <div className={isCheckbox ? "flex items-center gap-2" : ""}>
      {description ? (
        <TooltipLabel label={label} description={description} />
      ) : (
        <label
          className={`block font-semibold text-gray-700 ${isCheckbox ? "order-2 mb-0 text-sm" : "text-[10px] lg:text-sm mb-1"}`}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder || ""}
        // Checkboxes use 'checked', others use 'value'
        {...(isCheckbox ? { checked: !!value } : { value: value || "" })}
        onChange={onChange}
        className={
          isCheckbox
            ? "w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            : "w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        }
      />
    </div>
  );
}
