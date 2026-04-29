import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AllApps() {
  const navigate = useNavigate();
  // idea to detect screen size for responsive design
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  // console.log("isMobile:", isMobile);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [apps_MockData, setAppsMockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const appsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7187/api/v1/Demo/apps');
        const result = await response.json();

        console.log("API Response:", result);

        if (result.StatusCode === '200' && result.Data) {
          // Transform API data to match component structure
          const transformedData = result.Data.map((app) => ({
            id: app.ApplicationId,
            name: app.ApplicationName,
            owner: app.BusinessOwner || "Unassigned",
            platform: app.Platform || "Web Application",
            status: app.Status || "Unknown",
            core: app.CoreApplication || false,
          }));
          setAppsMockData(transformedData);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
        setAppsMockData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  // --- Logic to handle Search & Pagination ---
  const filteredApps = apps_MockData.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastApp = currentPage * appsPerPage;
  const indexOfFirstApp = indexOfLastApp - appsPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(filteredApps.length / appsPerPage);

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-inter">
      <Sidebar active="all" />

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Header: Responsive stacking */}
        <header className="flex justify-center lg:justify-between items-center mb-2 lg:mb-8 ">

          <div className="ml-8 mr-8 lg:mr-0">

            <h2 className=" text-lg lg:text-2xl font-bold text-gray-800">All Applications</h2>

            <p className="text-gray-500 lg:text-2xl hidden lg:block mt-1">Manage and view your complete application inventory.</p>

          </div>

          <Link to="/create" className="bg-blue-600 text-white p-2 lg:px-4 lg:py-2 rounded-lg text-[8px] lg:text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center">

            <Plus className="mr-2 w-4 h-4" /> New App

          </Link>

        </header>

        {/* Search Bar */}
        <div className="relative max-w-md mt-4 mb-2 lg:mb-4 lg:max-w-5xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 lg:w-4 lg:h-4" />
          <input
            type="text"
            placeholder="Search by name ..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl p-8 text-center">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            <p className="font-medium">Error loading applications:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
       
        {/* Table Container: scrollable on mobile */}
        {!loading && !error && (
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full lg:min-w-[600px] md:min-w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] md:text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="p-2 lg:p-4">ID</th>
                  <th className="p-2 lg:p-4  ">App Name</th>
                  <th className="p-2 lg:p-4 hidden md:table-cell">Business Owner</th>
                  <th className="p-2 lg:p-4 hidden lg:table-cell">Platform</th>
                  <th className="p-2 lg:p-4">Status</th>
                  <th className="p-2 lg:p-4 hidden sm:table-cell">Core</th>
                  <th className="p-2 lg:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[10px] lg:text-sm divide-y divide-gray-100">
                {currentApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/${app.id}`)}
                  >
                    <td className="p-2 lg:p-4 font-mono text-[9px] lg:text-xs text-gray-500">{app.id}</td>
                    <td className="p-2 lg:p-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <span className="font-medium text-gray-800 truncate max-w-[100px] md:max-w-[140px] lg:max-w-none text-[10px] lg:text-sm">
                          {app.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 lg:p-4 text-gray-600 hidden md:table-cell text-[10px] lg:text-sm">{app.owner}</td>
                    <td className="p-2 lg:p-4 text-gray-600 hidden lg:table-cell text-[10px] lg:text-sm">{app.platform}</td>
                    <td className="p-2 lg:p-4">
                      <span className={`px-2 py-0.5 lg:py-1 rounded-full text-[8px] lg:text-xs font-medium ${app.status === "Active" ? "bg-green-100 text-green-700" :
                          app.status === "Maintenance" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-600"
                        }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-2 lg:p-4 hidden sm:table-cell">
                      {app.core ? <Check className="text-blue-500 w-3 h-3 lg:w-4 lg:h-4" /> : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="p-2 lg:p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2 lg:gap-3">
                        <button
                          onClick={() => navigate(`/create?app_id=${app.id}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit application"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-2 lg:p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 lg:gap-4">
            <span className="text-[9px] lg:text-xs text-gray-500 text-center sm:text-left">
              Showing {indexOfFirstApp + 1} to {Math.min(indexOfLastApp, filteredApps.length)} of {filteredApps.length} applications
            </span>
            <div className="flex items-center gap-0.5 lg:gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg text-[10px] lg:text-xs font-medium transition-colors ${currentPage === index + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}