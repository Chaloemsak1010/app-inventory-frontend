import Sidebar from "@/components/Sidebar";
import { PieChart, Plus, Eye, Settings, Zap, TrendingUp, User , Clock, Package, Zap as Activity } from "lucide-react";
import { Link } from "react-router-dom";
import DonutChart from "@/components/DonutChart.jsx";
import { useState, useEffect } from "react";



export default function Dashboard() {
  const [sampleSummary, setSampleSummary] = useState({
    totalApplications: 0,
    totalServices: 0,
    totalServers: 0,
    cloudServers: 0,
    onPremServers: 0,
    newestApp: "Loading...",
    recentAppChanges: "Loading...",
    recentModuleChanges: "Loading...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7187/api/v1/Demo/dashboard/summary');
        const result = await response.json();

        if (result.StatusCode === '200' && result.Data) {
          setSampleSummary({
            totalApplications: result.Data.TotalApps || 0,
            totalServices: result.Data.TotalModules || 0,
            totalServers: result.Data.TotalServers || 0,
            cloudServers: result.Data.TotalCloudServers || 0,
            onPremServers: result.Data.TotalOnPremServers || 0,
            newestApp: result.Data.NewestApp || "N/A",
            recentAppChanges: result.Data.RecentAppChanges || "N/A",
            recentModuleChanges: result.Data.RecentModuleChanges || "N/A",
          });
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="dashboard" />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:mb-6">
          <div className=" ml-12 lg:ml-0">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-xs md:text-sm lg:text-lg text-gray-500 mt-1">Overview of applications, services and infrastructure</p>
          </div>

        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
            <p className="font-medium">Error loading dashboard:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8">
          <div className="glass-panel p-3 md:p-4 rounded-lg">
            <div className="text-[10px] md:text-xs text-gray-500">Total Applications</div>
            <div className="text-xl md:text-2xl font-bold">{loading ? '—' : sampleSummary.totalApplications}</div>
          </div>
          <div className="glass-panel p-3 md:p-4 rounded-lg">
            <div className="text-[10px] md:text-xs text-gray-500">Total Modules / Services</div>
            <div className="text-xl md:text-2xl font-bold">{loading ? '—' : sampleSummary.totalServices}</div>
          </div>
          <div className="glass-panel p-3 md:p-4 rounded-lg">
            <div className="text-[10px] md:text-xs text-gray-500">Total Servers</div>
            <div className="text-xl md:text-2xl font-bold">{loading ? '—' : sampleSummary.totalServers}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
          <div className="glass-panel p-4 md:p-6 rounded-lg col-span-1 ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><PieChart className="w-4 h-4" /> <h4 className="text-sm md:text-base font-semibold">Server Distribution</h4></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <DonutChart
                cloud={loading ? 0 : sampleSummary.cloudServers}
                onPrem={loading ? 0 : sampleSummary.onPremServers}
              />

              <div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full" /> <span className="text-xs md:text-sm">Cloud — {loading ? '—' : sampleSummary.cloudServers}</span></div>
                <div className="flex items-center gap-2 mt-2"><span className="w-3 h-3 bg-gray-400 rounded-full" /> <span className="text-xs md:text-sm">On-Prem — {loading ? '—' : sampleSummary.onPremServers}</span></div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="glass-panel p-4 md:p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-yellow-500" />
              <h4 className="text-sm md:text-base font-semibold">Quick Access</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Link
                to="/create"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <div className="p-1.5 md:p-2 bg-blue-600 text-white rounded-lg flex-shrink-0">
                  <Plus className="w-3 md:w-4 h-3 md:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-semibold text-gray-800">New App</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 truncate">Create application</div>
                </div>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
              >
                <div className="p-1.5 md:p-2 bg-purple-600 text-white rounded-lg flex-shrink-0">
                  <Eye className="w-3 md:w-4 h-3 md:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-semibold text-gray-800">View All</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 truncate">Browse apps</div>
                </div>
              </Link>

              <Link
                to="/dependency-analysis"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
              >
                <div className="p-1.5 md:p-2 bg-green-600 text-white rounded-lg flex-shrink-0">
                  <TrendingUp className="w-3 md:w-4 h-3 md:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-semibold text-gray-800">Dependency Analysis</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 truncate">Analysis tool</div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
              >
                <div className="p-1.5 md:p-2 bg-red-600 text-white rounded-lg flex-shrink-0">
                  <User className="w-3 md:w-4 h-3 md:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-semibold text-gray-800">User Management</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 truncate">Admin panel</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Updates & Activity Section */}
        <div className="glass-panel p-4 md:p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm md:text-base font-semibold">Recent Updates</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Last App Updated */}
            <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-gray-600 font-medium">Latest App</div>
                  <div className="text-[10px] md:text-sm font-bold text-blue-700 mt-1 truncate">{loading ? 'Loading...' : sampleSummary.newestApp}</div>
                </div>
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-500 mt-2 leading-relaxed">
                <p>From API response</p>
              </div>
            </div>

            {/* Last Module Updated */}
            <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-gray-600 font-medium">Recent Module Changes</div>
                  <div className="text-[10px] md:text-sm font-bold text-purple-700 mt-1 truncate">{loading ? 'Loading...' : sampleSummary.recentModuleChanges}</div>
                </div>
                <Package className="w-4 h-4 text-purple-500 flex-shrink-0 ml-2" />
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-500 mt-2 leading-relaxed">
                <p>From API response</p>
              </div>
            </div>

            {/* Recent App Changes */}
            <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-gray-600 font-medium">Recent App Changes</div>
                  <div className="text-[10px] md:text-sm font-bold text-green-700 mt-1 truncate">{loading ? 'Loading...' : sampleSummary.recentAppChanges}</div>
                </div>
                <Plus className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-500 mt-2 leading-relaxed">
                <p>From API response</p>
              </div>
            </div>

            {/* Total Apps */}
            <div className="p-3 md:p-4 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-gray-600 font-medium">Total Applications</div>
                  <div className="text-[10px] md:text-sm font-bold text-orange-700 mt-1">{loading ? 'Loading...' : sampleSummary.totalApplications + ' Apps'}</div>
                </div>
                <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0 ml-2" />
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-500 mt-2 leading-relaxed">
                <p>In inventory</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
