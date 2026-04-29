import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const API_BASE_URL = "https://localhost:7187/api/v1/Demo";

export default function CyberSecurityInfoForm({ appId }) {
  const [dataSensitivityLevels, setDataSensitivityLevels] = useState([]);
  const [securityClassifications, setSecurityClassifications] = useState([]);

  const [securityId, setSecurityId] = useState(null);

  const isEditMode = Boolean(securityId);

  const [form, setForm] = useState({
    application_id: appId || "",
    security_classification: "",
    data_sensitivity_level: "",
    vulnerability_assessment: false,
    last_va_scan_date: "",
    penetration_test: false,
    penetration_date: "",
    compliance_standard: "",
    last_security_review: "",
    next_date: "",
  });

  const [loading, setLoading] = useState({
    dataSensitivityLevels: false,
    securityClassifications: false,
  });

  const [error, setError] = useState({
    dataSensitivityLevels: null,
    securityClassifications: null,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10); // safest (no timezone bug)
  };

  
  useEffect(() => {

    if (!appId) return;
    
    const fetchCyber = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/app/cyber/${appId}`);
        if (!res.ok) return; // no data yet → create mode

        const data = await res.json();

        console.log("Data for cyber is : ", data);

        if (data?.security_id) {
          setSecurityId(data.security_id);

          // preload form
          setForm((prev) => ({
            ...prev,
            security_classification:
              data.security_classification_config_id || "",
            data_sensitivity_level: data.data_sensitivity_level_config_id || "",
            vulnerability_assessment: data.vulnerability_assessment,
            last_va_scan_date: formatDate(data.last_va_scan_date),
            penetration_test: data.penetration_test,
            penetration_date: formatDate(data.penetration_date),
            compliance_standard: data.compliance_standard || "",
            last_security_review: formatDate(data.last_security_review),
            next_date: formatDate(data.next_date),
          }));
        }
      } catch (err) {
        console.error("Fetch cyber failed:", err);
      }
    };

    fetchCyber();
  }, [appId]);

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

  // Fetch config groups on component mount
  useEffect(() => {
    fetchConfigGroup(
      "DATA_SENSITIVITY_LEVEL",
      setDataSensitivityLevels,
      "dataSensitivityLevels",
    );
    fetchConfigGroup(
      "SECURITY_CLASSIFICATION",
      setSecurityClassifications,
      "securityClassifications",
    );
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildBasePayload = () => ({
    application_id: appId,

    security_classification_config_id:
      Number(form.security_classification) || null,

    data_sensitivity_level_config_id:
      Number(form.data_sensitivity_level) || null,

    vulnerability_assessment: form.vulnerability_assessment,

    last_va_scan_date: form.last_va_scan_date || null,

    penetration_test: form.penetration_test,

    penetration_date: form.penetration_date || null,

    compliance_standard: form.compliance_standard,

    last_security_review: form.last_security_review || null,

    next_date: form.next_date || null,
  });

  const buildCreatePayload = () => ({
    ...buildBasePayload(),
    created_at: new Date().toISOString(), // only for create
  });

  const buildUpdatePayload = () => ({
    security_id: securityId, // REQUIRED for update
    ...buildBasePayload(),
  });

  const handleSubmit = async () => {
    if (!appId) {
      console.warn("No appId yet — create App Overview first");
      return;
    }

    const isEditMode = Boolean(securityId);

    const payload = isEditMode ? buildUpdatePayload() : buildCreatePayload();

    const url = isEditMode
      ? `${API_BASE_URL}/app/cyber/${appId}`
      : `${API_BASE_URL}/app/cyber`;

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
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();

      if (!isEditMode && data?.Data) {
        // console.log("Created → switch to EDIT mode:", data.Data);
        setSecurityId(data.Data);
      }
    } catch (err) {
      console.error("Cyber submit failed:", err);
    }
  };

  if (!appId) {
    return (
     
    <div className="glass-panel p-4 lg:p-8 rounded-2xl border-l-4 border-red-500">
      <h3 className="flex items-center gap-2 lg:gap-3 text-sm lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
        <Shield className="text-red-500 w-4 h-4 lg:w-6 lg:h-6" />
        Cyber Security Information
      </h3>

      <p className="text-[10px] lg:text-sm text-gray-600 mb-4 lg:mb-6">
        Cybersecurity team can fill this section
      </p>

      {/* Centered Alert */}
      <div className="flex items-center justify-center min-h-[120px]">
        <p className="text-center text-red-600 font-semibold text-sm lg:text-base bg-red-50 px-4 py-3 rounded-lg shadow-sm">
          Please Create App Overview first
        </p>
      </div>
    </div>
    );
  }

  return (
    <div className="glass-panel p-4 lg:p-8 rounded-2xl border-l-4 border-red-500">
      <h3 className="flex items-center gap-2 lg:gap-3 text-sm lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
        <Shield className="text-red-500 w-4 h-4 lg:w-6 lg:h-6" /> Cyber Security
        Information
      </h3>
      <p className="text-[10px] lg:text-sm text-gray-600 mb-4 lg:mb-6">
        Cybersecurity team can fill this section for App ID: {appId || ""} and
        Security ID: {securityId || ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-6">
        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Security Classification *
          </label>
          <select
            name="security_classification"
            value={form.security_classification}
            onChange={onChange}
            disabled={loading.securityClassifications}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.securityClassifications
                ? "Loading..."
                : "Select classification"}
            </option>
            {securityClassifications.map((sec) => (
              <option key={sec.config_id} value={sec.config_id}>
                {sec.config_value}
              </option>
            ))}
          </select>
          {error.securityClassifications && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.securityClassifications}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Data Sensitivity Level *
          </label>
          <select
            name="data_sensitivity_level"
            value={form.data_sensitivity_level}
            onChange={onChange}
            disabled={loading.dataSensitivityLevels}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.dataSensitivityLevels
                ? "Loading..."
                : "Select sensitivity"}
            </option>
            {dataSensitivityLevels.map((level) => (
              <option key={level.config_id} value={level.config_id}>
                {level.config_value}
              </option>
            ))}
          </select>
          {error.dataSensitivityLevels && (
            <p className="text-[10px] text-red-500 mt-1">
              {error.dataSensitivityLevels}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Vulnerability Assessment
          </label>
          <select
            name="vulnerability_assessment"
            value={form.vulnerability_assessment ? "true" : "false"}
            onChange={(e) => {
              const event = new Event("change", { bubbles: true });
              event.target = {
                name: "vulnerability_assessment",
                type: "checkbox",
                checked: e.target.value === "true",
              };
              onChange(event);
            }}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="false">Not Done</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Last VA Scan Date
          </label>
          <input
            type="date"
            name="last_va_scan_date"
            value={form.last_va_scan_date}
            onChange={onChange}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Penetration Test
          </label>
          <select
            name="penetration_test"
            value={form.penetration_test ? "true" : "false"}
            onChange={(e) => {
              const event = new Event("change", { bubbles: true });
              event.target = {
                name: "penetration_test",
                type: "checkbox",
                checked: e.target.value === "true",
              };
              onChange(event);
            }}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="false">Not Done</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Penetration Test Date
          </label>
          <input
            type="date"
            name="penetration_date"
            value={form.penetration_date}
            onChange={onChange}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Compliance Standards
          </label>
          <input
            type="text"
            name="compliance_standard"
            value={form.compliance_standard}
            onChange={onChange}
            placeholder="e.g., ISO 27001, SOC2, GDPR"
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Last Security Review
          </label>
          <input
            type="date"
            name="last_security_review"
            value={form.last_security_review}
            onChange={onChange}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-[10px] lg:text-sm font-semibold text-gray-700 mb-1">
            Next Review Date
          </label>
          <input
            type="date"
            name="next_date"
            value={form.next_date}
            onChange={onChange}
            className="w-full px-2 py-1 lg:px-4 lg:py-2 bg-white border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {securityId ? "Update Cyber Info" : "Create Cyber Info"}
        </button>
      </div>
    </div>
  );
}
