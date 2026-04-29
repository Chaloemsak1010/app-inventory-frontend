// Show APP Details by app id.

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Server, Code, Shield, Info } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useParams } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const Section = ({ title, icon: Icon, data, sectionKey, isExpanded, onToggle, formatFieldName, formatValue }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                onToggle(sectionKey);
            }}
            className="w-full px-3 lg:px-6 py-3 lg:py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
        >
            <div className="flex items-center gap-2 lg:gap-3">
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                <h2 className="text-[10px] lg:text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            {isExpanded ? (
                <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            ) : (
                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            )}
        </button>

        {isExpanded && (
            <div className="p-3 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-2 lg:p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                            <div className="text-[8px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 lg:mb-2">
                                {formatFieldName(key)}
                            </div>
                            <div className={`${key === 'core_application' && value
                                        ? 'text-blue-600 font-semibold text-[10px] lg:text-base'
                                        : key === 'vulnerability_assessment' && value
                                            ? 'text-green-600 font-semibold text-[10px] lg:text-base'
                                            : key === 'penetration_test' && value
                                                ? 'text-green-600 font-semibold text-[10px] lg:text-base'
                                                : key === 'application_description' || key === 'interface_application_list' || key === '_note' || key === 'token_policy' || key === 'pdpa_data' || key === 'compliance_standard'
                                                    ? 'text-gray-900 text-[9px] lg:text-sm leading-relaxed'
                                                    : 'text-gray-900 font-semibold text-[10px] lg:text-base'
                                }`}>
                                {formatValue(value)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const AppDetailsPage = () => {
    const { app_id : appId } = useParams();
    const [expandedSections, setExpandedSections] = useState({
        overview: false,
        development: false,
        infrastructure: false,
        security: false
    });
    const [mockData, setMockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch application details from API
    useEffect(() => {
        const fetchAppDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://localhost:7187/api/v1/Demo/apps/${appId}`);
                const result = await response.json();

                if (result.StatusCode === '200' && result.Data) {
                    const data = result.Data;
                    
                    // Transform API response to match component structure
                    const transformedData = {
                        overview: {
                            application_id: data.application_id,
                            business_process_id: data.business_process_id || "N/A",

                            business_domain: data.business_domain || "N/A",
                            business_process: data.business_process || "N/A",
                            business_sub_process : data.business_sub_process || "N/A",

                            business_owner: data.business_owner || "N/A",
                            data_owner: data.data_owner || "N/A",
                            system_owner: data.system_owner || "N/A",
                              


                            application_name: data.application_name,
                            application_description: data.application_description || "N/A",
                            apllication_category: data.application_category || "N/A",
                            status: data.status || "N/A",
                            apllication_criticality: data.criticality_level || "N/A",
                            core_application: data.core_application || false,
                            year_start: data.year_start || "N/A",
                            end_year: data.end_year || "N/A",
                            application_platform: data.application_platform || "N/A",
                            software_type: data.software_type || "N/A",
                            interface_system: data.interface_system || "false",
                            interface_application_list: data.interface_application_list || "N/A",
                            software_product_name: data.software_product_name || "N/A",
                            number_of_users: data.number_of_users || 0,
                            impact_s4hana: data.impact_s4hana || "N/A",
                            after_use_s4hana: data.after_use_s4hana || "N/A",
                    
                            vendor_name: data.vendor?.vendor_name || "N/A",
                            vendor_support: data.vendor?.support_contact_info || "N/A",
                            end_of_support: data.end_vendor_support || "N/A",
                            
                            to_be_system: data.to_be_system || "N/A",
                            _note: data._note || "N/A",
                            
                        },
                        development: {
                            product_owner: data.owners?.find(o => o.owner_type === 'Business Owner')?.username || "N/A",
                            
                            frontend_stack: data.development_info?.frontend || "N/A",
                            backend_stack: data.development_info?.backend || "N/A",
                            framework: data.development_info?.framework || "N/A",
                            runtime: data.development_info?.runtime || "N/A",
                            

                            auth_provider: data.development_info?.auth_provider || "N/A",
                            auth_method: data.development_info?.auth_method || "N/A",
                            token_policy: data.development_info?.token_policy || "N/A",
                            pdpa_data: data.development_info?.pdpa_data || "N/A",
                            mfa_enabled: data.development_info?.mfa_enabled || false,
                            database_system: data.development_info?.database_system || "N/A",
                        },
                        infrastructure: {
                            operating_system: data.infrastructure?.operating_system || "N/A",
                            compute_platform: data.infrastructure?.compute_platform || "N/A",
                            service_organization: data.infrastructure?.service_organization || "N/A",
                            deployment_type: data.infrastructure?.deployment_type || "N/A",
                            cloud_provider: data.infrastructure?.cloud_provider || "N/A",
                            physical_location: data.infrastructure?.physical_location || "N/A",
                            host_ip_production: data.infrastructure?.host_ip_production || "N/A",
                            host_ip_non_production: data.infrastructure?.host_ip_non_production || "N/A",
                            production_link: data.infrastructure?.production_link || "N/A",
                            sharepoint_link: data.infrastructure?.sharepoint_link || "N/A",
                            access_to_app: data.infrastructure?.access_to_app || "N/A",
                        },
                        security: {
                            security_classification: data.cyber_security?.security_classification || "N/A",
                            data_sensitivity_level: data.cyber_security?.data_sensitivity_level || "N/A",
                            vulnerability_assessment: data.cyber_security?.vulnerability_assessment || false,
                            last_va_scan_date: data.cyber_security?.last_va_scan_date || "N/A",
                            penetration_test: data.cyber_security?.penetration_test || false,
                            penetration_date: data.cyber_security?.penetration_date || "N/A",
                            compliance_standard: data.cyber_security?.compliance_standard || "N/A",
                            last_security_review: data.cyber_security?.last_security_review || "N/A",
                            next_date: data.cyber_security?.next_date || "N/A",
                        }
                    };
                    setMockData(transformedData);
                    setError(null);
                }
            } catch (err) {
                console.error("LLLLLLLLLLLLLLL");
                setError(err.message);
                setMockData(null);
            } finally {
                setLoading(false);
            }
        };

        if (appId) {
            fetchAppDetails();
        }
    }, [appId]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const formatFieldName = (fieldName) => {
        return fieldName
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (value === 'VH') return 'Very High';
        if (value === 'H') return 'High';
        if (value === 'M') return 'Medium';
        if (value === 'L') return 'Low';
        if (value === 'VL') return 'Very Low';
        return value.toString().replace(/_/g, ' ');
    };

    const renderSections = () => {
        return (
            <>
                <Section
                    title="Application Overview"
                    icon={Info}
                    data={mockData.overview}
                    sectionKey="overview"
                    isExpanded={expandedSections.overview}
                    onToggle={toggleSection}
                    formatFieldName={formatFieldName}
                    formatValue={formatValue}
                />
                <Section
                    title="Development Information"
                    icon={Code}
                    data={mockData.development}
                    sectionKey="development"
                    isExpanded={expandedSections.development}
                    onToggle={toggleSection}
                    formatFieldName={formatFieldName}
                    formatValue={formatValue}
                />
                <Section
                    title="Infrastructure Information"
                    icon={Server}
                    data={mockData.infrastructure}
                    sectionKey="infrastructure"
                    isExpanded={expandedSections.infrastructure}
                    onToggle={toggleSection}
                    formatFieldName={formatFieldName}
                    formatValue={formatValue}
                />
                <Section
                    title="Cyber Security Information"
                    icon={Shield}
                    data={mockData.security}
                    sectionKey="security"
                    isExpanded={expandedSections.security}
                    onToggle={toggleSection}
                    formatFieldName={formatFieldName}
                    formatValue={formatValue}
                />
            </>
        );
    };

    if (!mockData && loading) {
        return (
            <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
                <Sidebar active="" />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 text-lg">Loading application details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !mockData) {
        return (
            <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
                <Sidebar active="" />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <p className="font-medium">Error loading application:</p>
                        <p className="text-sm mt-1">{error || 'Application not found'}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
            <Sidebar active="" />

            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="mb-4 ml-12 lg:mb-8 ">
                    <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                        <h1 className="text-sm lg:text-3xl font-bold text-gray-900">
                            {mockData.overview.application_name}
                        </h1>
                        <span className="text-xs lg:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {mockData.overview.status}
                        </span>
                    </div>

                    <p className="text-[10px] lg:text-sm text-gray-600 max-w-3xl">
                        {mockData.overview.application_description}
                    </p>
                </div>



                {/* Sections */}
                <div className="space-y-3 lg:space-y-4">{renderSections()}</div>
            </main>
        </div>
    );
};

export default AppDetailsPage;