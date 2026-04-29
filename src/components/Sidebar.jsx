import React, { useState } from "react";
import { Link } from "react-router-dom";
import {Layers,PieChart,List,
  Plus,
  Shield,
  User,
  Package,
  Menu,
  X,
  PackageSearch,
  Settings,
  Users,
  Database
} from "lucide-react";

export default function Sidebar({ active = "all" }) {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const navItems = [
    { to: "/", icon: List, label: "All Applications", key: "all" },
    { to: "/dependency-analysis", icon: PackageSearch, label: "Dependency Analysis", key: "dependency-analysis" },
    { to: "/dashboard", icon: PieChart, label: "Dashboard", key: "dashboard" },
    { to: "/create", icon: Plus, label: "New Application", key: "create" },
    { to: "/server-register", icon: Package, label: "Server Register", key: "server-register" },
    // { to: "/admin", icon: Shield, label: "Admin & Permissions", key: "admin" },
    { to: "/admin/master-data", icon: Database, label: "Master Data Config", key: "admin-master-data" },
    {to: "/admin/business-data" , icon: Database , label: "Business Data config" , key: "business-process-data"},
    { to: "/admin/rbac", icon: Settings, label: "RBAC Configuration", key: "admin-rbac" },
    { to: "/admin/users", icon: Users, label: "User Management", key: "admin-users" },
    
  ];

  return (
    <>
      {/* Hamburger button (mobile only) */}

      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-1  z-20 p-2 md:hidden lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="w-8 bg-blue-600  h-8 lg:w-8 lg:h-8 rounded-sm flex items-center justify-center text-white">
          <Layers className="w-4 h-4" />
        </div>
      </button>

      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-white/95 backdrop-blur-sm
          border border-white/20
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
          z-50 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-10
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3" onClick={handleLinkClick}>
            <div className="w-8 h-8  lg:w-8 lg:h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white">
              <Layers className="w-4 h-4 " />
            </div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight">App Inventory</h1>
          </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <Link
                key={item.key}
                to={item.to}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm lg:text-base
                  transition-colors duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}