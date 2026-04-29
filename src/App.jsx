import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllApps from "@/pages/AllApps";
import AdminRBAC from "@/pages/AdminRBAC";
import AdminUsers from "@/pages/AdminUsers";
import AdminMasterData from "@/pages/AdminMasterData";

import BusinessProcessData from "@/pages/BusinessProcessData";

import CreateApp from "@/pages/CreateApp";

import Dashboard from "./pages/Dashboard";
import Login from "@/pages/Login";
import Application from "@/pages/Application";
import ServerRegister from "@/pages/Server_register";
import NotFound from "@/pages/Notfound";
import Dependency from "@/pages/DependencyAnalysis";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllApps />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/rbac" element={<AdminRBAC />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/master-data" element={<AdminMasterData />} />
        <Route path="/admin/business-data" element ={<BusinessProcessData/> }/>
        <Route path="/create" element={<CreateApp />} />
        <Route path="/app/:app_id" element={<Application />} />
        <Route path="/server-register" element={<ServerRegister />} />
        <Route path="/dependency-analysis" element={<Dependency />} />
         {/* 👇 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    
  );
}