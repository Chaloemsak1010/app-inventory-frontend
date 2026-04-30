// we send data from child to parent component using callback function and props
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Save, AlertCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import AppOverviewForm from "@/components/AppOverviewForm";
import DevelopmentInfoForm from "@/components/DevelopmentInfoForm";
import InfrastructureInfoForm from "@/components/InfrastructureInfoForm";
import CyberSecurityInfoForm from "@/components/CyberSecurityInfoForm";

const USER_ROLES = ["ADMIN", "DEV", "IDS", "CBS", "VIEWER"];

export default function CreateApp({ role : initialRole = "ADMIN" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appIdParam = searchParams.get("app_id") || "";

  console.log("Try to edit app id: " , appIdParam);
  
  // State for role and app_id
  const [role, setRole] = useState("ADMIN"); // Default role
  const [appId, setAppId] = useState(appIdParam);


    
    // // Development Information Section
    // product_owner: "",
    // frontend_stack: "",
    // backend_stack: "",
    // frameworks: "",
    // runtime: "",
    // auth_provider: "",
    // auth_method: "",
    // mfa_enabled: false,
    // token_policy: "",
    // pdpa_data: "",
    // database_system: "",

    // // Infrastructure Network Information Section
    // operating_system: "",
    // compute_platform: "",
    // service_organization: "",
    // deployment_type: "",
    // cloud_provider: "",
    // physical_location: "",
    // host_ip_production: "",
    // host_ip_non_production: "",
    // production_link: "",
    // sharepoint_link: "",
    // access_to_app: "",

    // // Cyber Security Information Section
    // security_classification: "",
    // data_sensitivity_level: "",
    // vulnerability_assessment: false,
    // last_va_scan_date: "",
    // penetration_test: false,
    // penetration_date: "",
    // compliance_standard: "",
    // last_security_review: "",
    // next_date: "",
  

  // Callback to receive data from child component
  
  
  const handleChildData = (data) => {
    // setChildData(data);
    console.log("Data received in parent:", data);
  };

  // Check if section should be shown based on role
  const canFillDevelopmentInfo = role === "ADMIN" || role === "DEV";
  const canFillInfraInfo = role === "ADMIN" || role === "IDS";
  const canFillCyberInfo = role === "ADMIN" || role === "CBS";

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="create" />

      <main className="flex-1 overflow-y-auto pl-8 pr-8 pt-4 lg:p-8">
        <header className="flex flex-col lg:flex-row pl-4 lg:pl-0 justify-between  items-center mb-2 lg:mb-8">
          <div className=" mb-1 lg:mb-0">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">
              {appId ? "Edit Application" : "Create New Application"}
            </h2>
            <p className="text-gray-500 text-[10px] lg:text-sm mt-1">
              {appId
                ? "Update application details in the inventory."
                : "Fill in the details to register a new application in the inventory."}
            </p>
          </div>
        </header>

        <div  className="space-y-2 lg:space-y-8 pb-10 lg:pb-12">
          {/* APPLICATION OVERVIEW SECTION - Everyone can fill */}
           <AppOverviewForm appId = {appId} setAppId = {setAppId} /> 

          {/* DEVELOPMENT INFORMATION SECTION - DEV and ADMIN only */}
          {canFillDevelopmentInfo && (
            <DevelopmentInfoForm  appId = {appId}  />
          )}

          {/* INFRASTRUCTURE NETWORK INFORMATION SECTION - IDS and ADMIN only */}
          {/* {canFillInfraInfo && (
            <InfrastructureInfoForm form={form} onChange={onChange} appId = {appId} setAppId = {setAppId} />
          )} */}

          {/* CYBER SECURITY INFORMATION SECTION - CBS and ADMIN only */}
          {/* {canFillCyberInfo && (
            <CyberSecurityInfoForm  appId = {appId}  />
          )} */}
          {/* <div className="flex justify-end gap-1 mt-4 lg:mt-0 lg:gap-3 ">
            <button
              form="appForm"
              className="bg-blue-600 text-white px-3 py-1 lg:px-6 lg:py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center"
            >
              <Save className="mr-2 w-4 h-4" />
              {appId ? "Update App" : "Create App"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-yellow-400 px-2 py-1  lg:px-4 lg:py-2 rounded-lg text-[10px] lg:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div> */}

          {/* Permission Notice */}
          {role !== "ADMIN" && (
            <div className="glass-panel p-2 lg:p-6 rounded-2xl border border-amber-200 bg-amber-50/50 flex gap-2 lg:gap-4">
              <AlertCircle className="w-3 h-3 lg:w-5 lg:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[10px] lg:text-sm text-amber-900 mb-1">Limited Access</h4>
                <p className="text-[10px] lg:text-sm text-amber-800">
                  Your role ({role}) allows you to edit the Application Overview section and{" "}
                  {role === "DEV"
                    ? "Development Information"
                    : role === "IDS"
                    ? "Infrastructure & Network Information"
                    : "Cyber Security Information"}
                  . Other sections are restricted. Contact an admin to edit all sections.
                </p>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );}
  
