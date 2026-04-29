import React, { useState, useEffect } from "react";
import DependencyGraph from "@/components/reactflow/DependencyGraph";
import Sidebar from "@/components/Sidebar";
import { Info, X, Search } from "lucide-react";
import { Listbox } from "@headlessui/react";
// import { mapApiToFlow, computeDagreLayout } from '@/components/reactflow/transformGraph';
import { mapApiToFlow } from "@/components/reactflow/transformGraph";

import TooltipLabel from "@/components/Tooltips.jsx";

const API_ROOT = "https://localhost:7187/api/v1";
const DEMO_BASE = `${API_ROOT}/Demo`;
const DEP_BASE = `${API_ROOT}/Dependency`;

// const NotesOverlay = () => (
//   <div className="bg-white/90 backdrop-blur border border-slate-200 p-2 lg:p-4 rounded-xl shadow-sm lg:shadow-lg max-w-xs">
//     <h3 className="text-[10px] lg:text-sm font-semibold text-slate-600 flex items-center gap-2 mb-1 lg:mb-3">
//       <Info className="w-2 h-2 lg:w-4 lg:h-4" /> Notes
//     </h3>
//     <div className="space-y-3 text-[10px] lg:text-xs text-slate-600">
//       <p className="leading-relaxed">
//         Hover nodes for details. Use depth to control hop count.
//       </p>
//     </div>
//   </div>
// );

export default function Dependency() {
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [openNote, setOpenNote] = useState(false);
  const [depth, setDepth] = useState(0);
  const [layerDepth, setLayerDepth] = useState(2); // 2 = app->module, 3 = app->module->server
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("App");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [analysisType, setAnalysisType] = useState("impacted_by"); // "depends_on" or "impacted_by"

  const [selectedItem, setSelectedItem] = useState(null);

  const options = ["App", "Module", "Server"];

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setFilteredItems([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let endpoint = "";

        if (filterType === "App")
          endpoint = `${DEMO_BASE}/apps/keyword/${encodeURIComponent(searchTerm)}`;
        if (filterType === "Module")
          endpoint = `${DEMO_BASE}/modules/keyword/${encodeURIComponent(searchTerm)}`;
        if (filterType === "Server")
          endpoint = `${DEMO_BASE}/servers/keyword/${encodeURIComponent(searchTerm)}`;

        const res = await fetch(endpoint);
        const text = await res.text();
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok)
          throw new Error(
            `Server error ${res.status}: ${text.substring(0, 300)}`,
          );
        if (!contentType.includes("application/json"))
          throw new Error(
            `Server returned non-JSON response: ${text.substring(0, 300)}`,
          );
        const data = JSON.parse(text);
        setFilteredItems(Array.isArray(data) ? data : data.Data || data);
      } catch (err) {
        setError(err.message);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchTerm, filterType]);

  async function view_Details(item) {
    // setSelectedItem(item);
    const itemId =
      item.Id ||
      item.id ||
      item.module_id ||
      item.application_id ||
      item.server_id;
    const type = (item.Type || item.type || filterType || "")
      .toString()
      .toLowerCase();
    try {
      let endpoint = "";
      if (type === "application" || filterType === "App") {
        // App: choose 2-layer or 3-layer
        if (layerDepth === 2)
          endpoint = `${DEP_BASE}/getModules/${itemId}/modules`;
        else endpoint = `${DEP_BASE}/getModulesAndServers/${itemId}`;
      } else if (type === "module" || filterType === "Module") {
        // Module dependency analysis uses maxDepth
        // Becareful
        if (depth == 0) {
          if (analysisType === "impacted_by") {
            endpoint = `${DEP_BASE}/impacted-modules/${itemId}`;
          } else {
            // depends_on
            endpoint = `${DEP_BASE}/dependencies/${itemId}`;
          }
        } else {
          if (analysisType === "impacted_by") {
            endpoint = `${DEP_BASE}/impacted-modules/${itemId}?maxDepth=${depth}`;
          } else {
            endpoint = `${DEP_BASE}/dependencies/${itemId}?maxDepth=${depth}`;
          }
        }
      } else if (type === "server" || filterType === "Server") {
        // Server: choose 2-layer or 3-layer
        if (layerDepth === 2)
          endpoint = `${DEP_BASE}/getModulesByServer/${itemId}`;
        else endpoint = `${DEP_BASE}/getModulesAndAppsByServer/${itemId}`;
      } else {
        endpoint = `${DEP_BASE}/dependencies/${itemId}?maxDepth=${depth}`;
      }

      const res = await fetch(endpoint);
      const text = await res.text();
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok)
        throw new Error(
          `Server error ${res.status}: ${text.substring(0, 300)}`,
        );

      // console.log("Selected item:", item);
      // Name : "auth module v2" ,module_id: "9eccf8b2-a6e3-4c81-bb64-53fde19869e9"

      const data = JSON.parse(text);

      // 2. Update the specific node label based on item.module_id
      if (data.Nodes && (type === "module" || filterType === "Module")) {
        data.Nodes = data.Nodes.map((node) => {
          if (node.Id === item.module_id) {
            return {
              ...node,
              Label: item.Name, // Set the label to "auth module v2"
            };
          }
          return node;
        });
      }

      if (type === "module" || filterType === "Module") {
        const { nodes, edges } = mapApiToFlow(data || { Nodes: [], Edges: [] } , true );
        setFlowNodes(nodes);
         setFlowEdges(edges);
      } else {
        const { nodes, edges } = mapApiToFlow(data || { Nodes: [], Edges: [] }  ); // default is false
        setFlowNodes(nodes);
        setFlowEdges(edges);
      } 
      // clear UI
      setFilteredItems([]);
      setSearchTerm("");
      
    } catch {
      setFlowNodes([]);
      setFlowEdges([]);
    }
  }

  return (
    <div className="text-gray-800 h-screen flex overflow-hidden bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-screen font-inter">
      <Sidebar active="dependency-analysis" />
      <main className="flex-1 overflow-y-auto">
        <div className="relative h-screen w-full bg-white text-slate-900 font-sans overflow-hidden">
          {flowNodes?.length > 0 && (
            <div className="absolute inset-0 z-0">
              <DependencyGraph nodes={flowNodes} edges={flowEdges} />
            </div>
          )}

          <div className="absolute top-4 left-1/2 transform bg-white/0 -translate-x-1/2 z-20 w-200 max-h-[600px] flex flex-col">
            <div className="p-2 m-1 bg-white/80 rounded-lg shadow-md">
              <div className="flex gap-2 mb-1 items-center">
                <Listbox value={filterType} onChange={setFilterType}>
                  <div className="relative">
                    <Listbox.Button className="bg-blue-200 rounded-lg p-2 text-xs">
                      {filterType}
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 bg-white rounded shadow p-1">
                      {options.map((opt) => (
                        <Listbox.Option
                          key={opt}
                          value={opt}
                          className="p-1 text-sm"
                        >
                          {opt}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                <div className="relative flex-1 z-0">
                  <input
                    className="w-full p-1 rounded border"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className=" mt-2 flex items-center gap-2">
                  {filterType === "Module" ? (
                    <>
                      <label className="text-xs">Hop</label>
                      <TooltipLabel
                        description={
                          <>
                            0 Hop → Max as posible <br />
                            1 Hop → direct dependencies only <br />
                            2 Hop → dependencies of dependencies <br />
                            ... and so on
                          </>
                        }
                      />
                      <input
                        type="number"
                        min={0}
                        value={depth}
                        onChange={(e) => setDepth(Number(e.target.value))}
                        className="w-16 p-1 rounded border"
                      />
                      {/* // togle for analysisType *** Here we go */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setAnalysisType("impacted_by")}
                          className={`px-2 py-1 rounded ${analysisType === "impacted_by" ? "bg-blue-100" : ""}`}
                        >
                          Impacted By 
                        </button>

                        <button
                          onClick={() => setAnalysisType("depends_on")}
                          className={`px-2 py-1 rounded ${analysisType === "depends_on" ? "bg-blue-100" : ""}`}
                        >
                          Depend On
                        </button>
                      </div>
                      <TooltipLabel
                          description={
                            <>"Impacted By" → who depends on this module <br />
                            "Depends On" → who this module depends on <br />
                          </>
                          }
                      />
                    </>
                  ) : (
                    <>
                      <label className="text-xs">Layers</label>
                      {/* <TooltipLabel description={"2 = app → module,{<br>} 3 = app → module → server"} /> */}
                      <TooltipLabel
                        description={
                          <>
                            2 = app → module,
                            <br />3 = app → module → server
                          </>
                        }
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setLayerDepth(2)}
                          className={`px-2 py-1 rounded ${layerDepth === 2 ? "bg-blue-100" : ""}`}
                          title="2 = app → module / server → module"
                        >
                          2
                        </button>
                        <button
                          onClick={() => setLayerDepth(3)}
                          className={`px-2 py-1 rounded ${layerDepth === 3 ? "bg-blue-100" : ""}`}
                          title="3 = app → module → server"
                        >
                          3
                        </button>
                      </div>
                      {/* <div className="text-xs text-slate-400 ml-2">
                        (2 = app → module, 3 = app → module → server)
                      </div> */}
                    </>
                  )}
                </div>
              </div>

              {searchTerm && (
                <div className="max-h-56 overflow-auto space-y-2">
                  {isLoading && (
                    <div className="text-center text-sm">Loading...</div>
                  )}
                  {error && <div className="text-red-500">{error}</div>}
                  {!isLoading &&
                    !error &&
                    filteredItems.map((item) => (
                      // console.log("Rendering item:", item)
                      <button
                        key={
                          item.Id || item.id || item.module_id || item.server_id
                        }
                        onClick={() => view_Details(item)}
                        className="w-full text-left p-2 rounded hover:bg-slate-50"
                      >
                        <div className="flex justify-between">
                          <div className="font-semibold text-sm truncate">
                            {item.Label ||
                              item.Name ||
                              item.module_name ||
                              item.server_name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {(item.Type || item.type || "").toUpperCase()}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.Data?.module_name ||
                            item.Data?.server_name ||
                            ""}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* <div className="hidden lg:block absolute top-4 right-4 z-10">
            <NotesOverlay />
          </div> */}

          {openNote && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black/30 ">
              <div className="absolute top-16 right-4">
                <div className="relative">
                  <button
                    onClick={() => setOpenNote(false)}
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                  {/* <NotesOverlay /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
