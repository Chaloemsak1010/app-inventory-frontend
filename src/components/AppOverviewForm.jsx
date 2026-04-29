import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";

// for tooltips
//  <TooltipLabel
//   label=""
//   description={fieldDescriptions.}
// />
import TooltipLabel from "@/components/Tooltips.jsx";
import { fieldDescriptions } from "@/components/fieldDescriptions";

const API_BASE_URL = "https://localhost:7187/api/v1/Demo";

export default function AppOverviewForm({ appId, setAppId }) {
  const isEditMode = Boolean(appId);


  // Set Form for create App Overview
  const [form, setForm] = useState({
    application_id: appId || "",
    business_domain_id: "",
    business_process_id: "",
    sub_business_process_id: "",

    application_name: "",
    application_description: "",
    application_category: "",

    business_owner: "",
    data_owner: "",
    system_owner: "",

    core_application: false,
    criticality_level: "",
    year_start: "",
    status: "Active",
    end_year: "",
    application_platform: "",
    interface_system: false,
    interface_application_list: "",
    software_product_name: "",
    software_type: "",
    vendor_support: "",
    vendor_contact: "",
    end_of_support: "",

    number_of_users: "",
    _note: "",
    impact_S4HANA: "",
    after_use_S4HANA: "",
    to_be_system: "",
  });

  // Cascading selects state
  const [businessDomains, setBusinessDomains] = useState([]);
  const [businessProcesses, setBusinessProcesses] = useState([]);
  const [businessSubProcesses, setBusinessSubProcesses] = useState([]);

  const [selectedDomain, setSelectedDomain] = useState(
    form.business_domain_id || "",
  );
  const [selectedProcess, setSelectedProcess] = useState(
    form.business_process_id || "",
  );
  const [selectedSubProcess, setSelectedSubProcess] = useState(
    form.sub_business_process_id || "",
  );

  // Config groups state
  const [applicationCategories, setApplicationCategories] = useState([]);
  const [criticalityLevels, setCriticalityLevels] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [softwareTypes, setSoftwareTypes] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [afterUseS4HANAOptions, setAfterUseS4HANAOptions] = useState([]);

  const [loading, setLoading] = useState({
    domains: false,
    processes: false,
    subProcesses: false,
    applicationCategories: false,
    criticalityLevels: false,
    statusOptions: false,
    softwareTypes: false,
    impactOptions: false,
    afterUseS4HANAOptions: false,
  });

  const [error, setError] = useState({
    domains: null,
    processes: null,
    subProcesses: null,
    applicationCategories: null,
    criticalityLevels: null,
    statusOptions: null,
    softwareTypes: null,
    impactOptions: null,
    afterUseS4HANAOptions: null,
  });

  // Helper function to fetch config groups
  const fetchConfigGroup = async (groupName, setStateFunc, loadingKey) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError((prev) => ({ ...prev, [loadingKey]: null }));
    try {
      const response = await fetch(
        `${API_BASE_URL}/master-configs/group/${groupName}`,
        {
          headers: { accept: "*/*" },
        },
      );
      if (!response.ok) throw new Error(`Failed to fetch ${groupName}`);
      const data = await response.json();
      setStateFunc(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((prev) => ({ ...prev, [loadingKey]: err.message }));
      console.error(`Error fetching ${groupName}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Fetch Business Domains on component mount
  useEffect(() => {
    const fetchBusinessDomains = async () => {
      setLoading((prev) => ({ ...prev, domains: true }));
      setError((prev) => ({ ...prev, domains: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/business-domain`, {
          headers: { accept: "*/*" },
        });
        if (!response.ok) throw new Error("Failed to fetch business domains");
        const data = await response.json();
        setBusinessDomains(Array.isArray(data) ? data : []);
      } catch (err) {
        setError((prev) => ({ ...prev, domains: err.message }));
        console.error("Error fetching business domains:", err);
      } finally {
        setLoading((prev) => ({ ...prev, domains: false }));
      }
    };

    // Fetch all config groups
    fetchConfigGroup(
      "APPLICATION_CATEGORY",
      setApplicationCategories,
      "applicationCategories",
    );
    fetchConfigGroup(
      "CRITICALITY_LEVEL",
      setCriticalityLevels,
      "criticalityLevels",
    );
    fetchConfigGroup("STATUS", setStatusOptions, "statusOptions");
    fetchConfigGroup("SOFTWARE_TYPE", setSoftwareTypes, "softwareTypes");
    fetchConfigGroup("IMPACT_S4HANA", setImpactOptions, "impactOptions");
    fetchConfigGroup(
      "AFTER_USE_S4HANA",
      setAfterUseS4HANAOptions,
      "afterUseS4HANAOptions",
    );

    fetchBusinessDomains();
  }, []);

  // Fetch Business Processes when domain is selected
  useEffect(() => {
    if (!selectedDomain) {
      setBusinessProcesses([]);
      setBusinessSubProcesses([]);
      setSelectedProcess("");
      setSelectedSubProcess("");
      return;
    }

    const fetchBusinessProcesses = async () => {
      setLoading((prev) => ({ ...prev, processes: true }));
      setError((prev) => ({ ...prev, processes: null }));
      try {
        const response = await fetch(
          `${API_BASE_URL}/business-process/${selectedDomain}`,
          {
            headers: { accept: "*/*" },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch business processes");
        const data = await response.json();
        setBusinessProcesses(Array.isArray(data) ? data : []);
        setBusinessSubProcesses([]);
        setSelectedProcess("");
        setSelectedSubProcess("");
      } catch (err) {
        setError((prev) => ({ ...prev, processes: err.message }));
        console.error("Error fetching business processes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, processes: false }));
      }
    };

    fetchBusinessProcesses();
  }, [selectedDomain]);

  // Fetch Business Sub-Processes when process is selected
  useEffect(() => {
    if (!selectedProcess) {
      setBusinessSubProcesses([]);
      setSelectedSubProcess("");
      return;
    }

    const fetchBusinessSubProcesses = async () => {
      setLoading((prev) => ({ ...prev, subProcesses: true }));
      setError((prev) => ({ ...prev, subProcesses: null }));
      try {
        const response = await fetch(
          `${API_BASE_URL}/business-sub-process/${selectedProcess}`,
          {
            headers: { accept: "*/*" },
          },
        );
        if (!response.ok)
          throw new Error("Failed to fetch business sub-processes");
        const data = await response.json();
        setBusinessSubProcesses(Array.isArray(data) ? data : []);
        setSelectedSubProcess("");
      } catch (err) {
        setError((prev) => ({ ...prev, subProcesses: err.message }));
        console.error("Error fetching business sub-processes:", err);
      } finally {
        setLoading((prev) => ({ ...prev, subProcesses: false }));
      }
    };

    fetchBusinessSubProcesses();
  }, [selectedProcess]);

  // Handle domain change
  const handleDomainChange = (e) => {
    const value = e.target.value;
    // console.log("Domain: ", value);
    setSelectedDomain(value);

    // Update parent form with domain ID
    setForm((prev) => ({
      ...prev,
      business_domain_id: value,

      // reset dependent fields (IMPORTANT)
      business_process_id: "",
      sub_business_process_id: "",
    }));
  };

  // Handle process change
  const handleProcessChange = (e) => {
    const value = e.target.value;
    setSelectedProcess(value);

    // Update parent form with process ID
    setForm((prev) => ({
      ...prev,
      business_process_id: value,

      // reset sub-process
      sub_business_process_id: "",
    }));
  };

  // Handle sub-process change
  const handleSubProcessChange = (e) => {
    const value = e.target.value;
    setSelectedSubProcess(value);

    // Update parent form with sub-process ID
    setForm((prev) => ({
      ...prev,
      sub_business_process_id: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    onChange(e);
  };

  const toNullableNumber = (value) => {
    return value ? Number(value) : null;
  };

  // Let Post
  const buildPayload = () => {
    return {
      app_overview: {
        business_domain_config_id: toNullableNumber(form.business_domain_id),
        business_process_config_id: toNullableNumber(form.business_process_id),
        sub_business_process_config_id: toNullableNumber(
          form.sub_business_process_id,
        ),

        business_owner: form.business_owner,
        data_owner: form.data_owner,
        system_owner: form.system_owner,

        application_name: form.application_name,
        application_description: form.application_description,

        application_category_config_id: toNullableNumber(
          form.application_category,
        ),
        status_config_id: toNullableNumber(form.status),
        criticality_level_config_id: toNullableNumber(form.criticality_level),

        application_platform: form.application_platform,

        software_type_config_id: toNullableNumber(form.software_type),

        impact_s4hana_config_id: toNullableNumber(form.impact_S4HANA),
        after_use_s4hana_config_id: toNullableNumber(form.after_use_S4HANA),

        to_be_system: form.to_be_system,

        core_application: Boolean(form.core_application),

        year_start: form.year_start ? Number(form.year_start) : null,
        end_year: form.end_year ? Number(form.end_year) : null,

        interface_system: Boolean(form.interface_system),
        interface_application_list: form.interface_application_list,

        software_product_name: form.software_product_name,

        number_of_users: form.number_of_users
          ? Number(form.number_of_users)
          : null,

        _note: form._note,
      },
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    const appName = payload.app_overview.application_name || "";
    if (appName == "") {
      // application name is required
      console.log("application name is required");
      return;
    }

    const url = isEditMode
      ? `${API_BASE_URL}/app/overview/${appId}` // update
      : `${API_BASE_URL}/app/overview`; // create

    const method = isEditMode ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Request failed");
      }

      const data = await res.json();

      // ONLY set appId when creating
      if (!isEditMode && data?.Data?.application_id) {
        console.log("App created", data.Data.application_id);
        setAppId(data.Data.application_id);
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };


    // Try to fetch data first if we already app id.
    useEffect(() => {
    // Console.log("ATTemppppppppppppppp")
    if (isEditMode && appId) {
      const fetchAppData = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/app/overview/${appId}`);
          if (!res.ok) throw new Error("Failed to fetch app data");

          const data = await res.json();
          

          if (data) {
            // Update the main form state
            console.log("Update the main form state" , data);
            setForm({
              application_id: data.application_id || appId,
              business_domain_id:
                data.business_domain_config_id?.toString() || "",
              business_process_id:
                data.business_process_config_id?.toString() || "",
              sub_business_process_id:
                data.sub_business_process_id?.toString() || "",

              application_name: data.application_name || "",
              application_description: data.application_description || "",
              application_category:
                data.application_category_config_id?.toString() || "",

              business_owner: data.business_owner || "",
              data_owner: data.data_owner || "",
              system_owner: data.system_owner || "",

              core_application: Boolean(data.core_application),
              criticality_level:
                data.criticality_level_config_id?.toString() || "",
              year_start: data.year_start?.toString() || "",
              status: data.status_config_id?.toString() || "",
              end_year: data.end_year?.toString() || "",
              application_platform: data.application_platform || "",
              interface_system: Boolean(data.interface_system),
              interface_application_list: data.interface_application_list || "",
              software_product_name: data.software_product_name || "",
              software_type: data.software_type_config_id?.toString() || "",
              vendor_support: data.vendor_support || "",
              vendor_contact: data.vendor_contact || "",
              end_of_support: data.end_of_support || "",

              number_of_users: data.number_of_users?.toString() || "",
              _note: data._note || "",
              impact_S4HANA: data.impact_s4hana_config_id?.toString() || "",
              after_use_S4HANA:
                data.after_use_s4hana_config_id?.toString() || "",
              to_be_system: data.to_be_system || "",
            });

            // Update the specific cascading states to trigger the dependent UseEffects
            setSelectedDomain(data.business_domain_config_id?.toString() || "");

            // Note: We use a timeout or separate logic if the process/sub-process options
            // haven't loaded yet. Since your other useEffects watch these values,
            // they will trigger the API calls for processes and sub-processes.
            setTimeout(() => {
              setSelectedProcess(
                data.business_process_config_id?.toString() || "",
              );
              setSelectedSubProcess(
                data.sub_business_process_id?.toString() || "",
              );
            }, 500);
          }
        } catch (err) {
          console.error("Failed to load application data:", err);
        }
      };
      fetchAppData();
    }
  }, [appId, isEditMode]);

  // const [appOverview, setAppOverview] = useState(form);
  // const handleClick = () => {
  //   // Call the parent's function with the data
  //   sendDataToParent("Hello from the Child!");
  // };
  return (
    <div className="glass-panel p-4 lg:p-8 rounded-2xl border-l-4 border-blue-500">
      <h3 className="flex items-center gap-2 lg:gap-3 text-sm lg:text-xl font-bold text-gray-800 mb-2 lg:mb-6">
        <Info className="text-blue-500 w-4 h-4 lg:w-6 lg:h-6" /> Application
        Overview   {appId ? "For App ID: " + appId : ""}
      </h3>
      <p className="text-[10px] lg:text-sm text-gray-600 mb-2 lg:mb-6">
        All users can fill this section
      </p>
      {/* div02 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-6 ">
        <div className="lg:col-span-1">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Application ID
          </label>
          <input
            type="text"
            name="application_id"
            value={form.application_id}
            onChange={handleChange}
            placeholder={!appId ? "Auto-generated (e.g., APP-UUID)" : appId}
            disabled
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm text-gray-500"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Application Name *
          </label>
          <input
            type="text"
            name="application_name"
            value={form.application_name}
            onChange={handleChange}
            required
            placeholder="Enter application name"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Business Domain
          </label>
          <select
            value={selectedDomain}
            onChange={handleDomainChange}
            disabled={loading.domains}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.domains ? "Loading..." : "Select Business Domain"}
            </option>
            {businessDomains.map((domain) => (
              <option key={domain.config_id} value={domain.config_id}>
                {domain.config_value}
              </option>
            ))}
          </select>
          {error.domains && (
            <p className="text-[10px] text-red-500 mt-1">{error.domains}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Business Process
          </label>
          <select
            value={selectedProcess}
            onChange={handleProcessChange}
            disabled={!selectedDomain || loading.processes}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {!selectedDomain
                ? "Select Domain First"
                : loading.processes
                  ? "Loading..."
                  : "Select Business Process"}
            </option>
            {businessProcesses.map((process) => (
              <option key={process.config_id} value={process.config_id}>
                {process.config_value}
              </option>
            ))}
          </select>
          {error.processes && (
            <p className="text-[10px] text-red-500 mt-1">{error.processes}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Business Sub-Process
          </label>
          <select
            value={selectedSubProcess}
            onChange={handleSubProcessChange}
            disabled={!selectedProcess || loading.subProcesses}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {!selectedProcess
                ? "Select Process First"
                : loading.subProcesses
                  ? "Loading..."
                  : "Select Business Sub-Process"}
            </option>
            {businessSubProcesses.map((subProcess) => (
              <option key={subProcess.config_id} value={subProcess.config_id}>
                {subProcess.config_value}
              </option>
            ))}
          </select>
          {error.subProcesses && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.subProcesses}
            </p>
          )}
        </div>

        <div className="lg:col-span-3">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Application Description
          </label>
          <textarea
            name="application_description"
            value={form.application_description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of the application's purpose"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <TooltipLabel
            label="Application Category"
            description={fieldDescriptions.application_category}
          />
          <select
            name="application_category"
            value={form.application_category}
            onChange={handleChange}
            disabled={loading.applicationCategories}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.applicationCategories ? "Loading..." : "Select category"}
            </option>
            {applicationCategories.map((cat) => (
              <option key={cat.config_id} value={cat.config_id}>
                {cat.config_value}
              </option>
            ))}
          </select>
          {error.applicationCategories && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.applicationCategories}
            </p>
          )}
        </div>

        <div>
          <TooltipLabel
            label="Criticality Level"
            description={fieldDescriptions.criticality_level}
          />
          <select
            name="criticality_level"
            value={form.criticality_level}
            onChange={handleChange}
            disabled={loading.criticalityLevels}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.criticalityLevels ? "Loading..." : "Select criticality"}
            </option>
            {criticalityLevels.map((level) => (
              <option key={level.config_id} value={level.config_id}>
                {level.config_value}
              </option>
            ))}
          </select>
          {error.criticalityLevels && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.criticalityLevels}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading.statusOptions}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.statusOptions ? "Loading..." : "Select status"}
            </option>
            {statusOptions.map((st) => (
              <option key={st.config_id} value={st.config_id}>
                {st.config_value}
              </option>
            ))}
          </select>
          {error.statusOptions && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.statusOptions}
            </p>
          )}
        </div>

        <div>
          <TooltipLabel
            label="Core Application"
            description={fieldDescriptions.core_application}
          />
          <select
            name="core_application"
            value={form.core_application ? "true" : "false"}
            onChange={(e) => {
              const value = e.target.value === "true";

              setForm((prev) => ({
                ...prev,
                core_application: value,
              }));

              onChange({
                target: {
                  name: "core_application",
                  value,
                },
              });
            }}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Start Year
          </label>
          <input
            type="number"
            name="year_start"
            value={form.year_start}
            onChange={handleChange}
            placeholder="e.g., 2020"
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            End Year
          </label>
          <input
            type="number"
            name="end_year"
            value={form.end_year}
            onChange={handleChange}
            placeholder="e.g., 2025"
            min="1900"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Application Platform
          </label>
          <input
            type="text"
            name="application_platform"
            value={form.application_platform}
            onChange={handleChange}
            placeholder="e.g., Web, Mobile, Desktop"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Software Type *
          </label>
          <select
            name="software_type"
            value={form.software_type}
            onChange={handleChange}
            disabled={loading.softwareTypes}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.softwareTypes ? "Loading..." : "Select type"}
            </option>
            {softwareTypes.map((type) => (
              <option key={type.config_id} value={type.config_id}>
                {type.config_value}
              </option>
            ))}
          </select>
          {error.softwareTypes && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.softwareTypes}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Software Product Name
          </label>
          <input
            type="text"
            name="software_product_name"
            value={form.software_product_name}
            onChange={handleChange}
            placeholder="e.g., SAP, Salesforce"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Vendor Support
          </label>
          <input
            type="text"
            name="vendor_support"
            value={form.vendor_support}
            onChange={handleChange}
            placeholder="Vendor name"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Vendor Contact
          </label>
          <input
            type="text"
            name="vendor_support"
            value={form.vendor_support}
            onChange={handleChange}
            placeholder="Vendor name"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            End of Support
          </label>
          <input
            type="text"
            name="end_of_support"
            value={form.end_of_support}
            onChange={handleChange}
            placeholder="e.g., 2025-12-31"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <TooltipLabel
            label="Business owner"
            description={fieldDescriptions.business_owner}
          />

          <input
            type="text"
            name="business_owner"
            value={form.business_owner}
            onChange={handleChange}
            placeholder="Gmail"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <TooltipLabel
            label="Data owner"
            description={fieldDescriptions.data_owner}
          />
          <input
            type="text"
            name="data_owner"
            value={form.data_owner}
            onChange={handleChange}
            placeholder="Gmail"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <TooltipLabel
            label="System owner"
            description={fieldDescriptions.system_owner}
          />
          <input
            type="text"
            name="system_owner"
            value={form.system_owner}
            onChange={handleChange}
            placeholder="Gmail"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Number of Users
          </label>
          <input
            type="number"
            name="number_of_users"
            value={form.number_of_users}
            onChange={handleChange}
            placeholder="e.g., 100"
            min="0"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Interface System
          </label>
          <select
            name="interface_system"
            value={form.interface_system ? "true" : "false"}
            onChange={(e) => {
              const value = e.target.value === "true";

              setForm((prev) => ({
                ...prev,
                core_application: value,
              }));

              onChange({
                target: {
                  name: "core_application",
                  value,
                },
              });
            }}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Interface Application List
          </label>
          <input
            type="text"
            name="interface_application_list"
            value={form.interface_application_list}
            onChange={handleChange}
            placeholder="Comma-separated list of interfaces"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Impact S4HANA
          </label>
          <select
            name="impact_S4HANA"
            value={form.impact_S4HANA}
            onChange={handleChange}
            disabled={loading.impactOptions}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.impactOptions ? "Loading..." : "Select impact"}
            </option>
            {impactOptions.map((imp) => (
              <option key={imp.config_id} value={imp.config_id}>
                {imp.config_value}
              </option>
            ))}
          </select>
          {error.impactOptions && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.impactOptions}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            After Use S4HANA
          </label>
          <select
            name="after_use_S4HANA"
            value={form.after_use_S4HANA}
            onChange={handleChange}
            disabled={loading.afterUseS4HANAOptions}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.afterUseS4HANAOptions ? "Loading..." : "Select action"}
            </option>
            {afterUseS4HANAOptions.map((action) => (
              <option key={action.config_id} value={action.config_id}>
                {action.config_value}
              </option>
            ))}
          </select>
          {error.afterUseS4HANAOptions && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.afterUseS4HANAOptions}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            To-Be System
          </label>
          <input
            type="text"
            name="to_be_system"
            value={form.to_be_system}
            onChange={handleChange}
            placeholder="Future system name"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="_note"
            value={form._note}
            onChange={handleChange}
            rows={2}
            placeholder="Additional notes"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isEditMode ? "Update App" : "Create App"}
        </button>
      </div>
    </div>
  );
}
