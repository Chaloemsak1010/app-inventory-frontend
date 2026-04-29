import { MarkerType } from "@xyflow/react";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;
const NODE_X_SPACING = 600;
const NODE_Y_SPACING = 140;

export function mapApiToFlow(apiResponse, isModule = false) {
  // rearange nodes around here lol
  if (!apiResponse) return { nodes: [], edges: [] };

  const { Nodes = [], Edges = [] } = apiResponse;

  const typeOrder = {
    application: 0,
    module: 1,
    server: 2,
  };

  const groupedByType = Nodes.reduce((acc, node) => {
    const type = node.Type || "custom";
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  var nodes = null;
  if (!isModule) {
    const positionMap = {};

    Object.entries(groupedByType).forEach(([type, nodesOfType]) => {
      const col = typeOrder[type.toLowerCase()] ?? 2;
      const x = col * NODE_X_SPACING;

      const totalHeight = (nodesOfType.length - 1) * NODE_Y_SPACING;
      const startY = -totalHeight / 2;

      nodesOfType.forEach((node, i) => {
        positionMap[String(node.Id || node.id)] = {
          x,
          y: startY + i * NODE_Y_SPACING,
        };
      });
    });

    nodes = Nodes.map((n) => ({
      id: String(n.Id || n.id),
      type: mapNodeType(n.Type),
      position: positionMap[String(n.Id || n.id)] ?? { x: 0, y: 0 },
      data: {
        ...n.Data,
        label: n.Label || n.label,
      },
      label: n.Label || n.label,
    }));
  } else {
    // For Module to Module relation Only.
    function getCircularLayout(
      nodes,
      centerX = 400,
      centerY = 300,
      radius = 200,
    ) {
      return nodes.map((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;

        return {
          ...node,
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
        };
      });
    }

    nodes = getCircularLayout(
      Nodes.map((n) => ({
        id: String(n.Id || n.id),
        type: mapNodeType(n.Type),
        data: {
          ...n.Data,
          label: n.Label || n.label,
        },
        label: n.Label || n.label,
      })),
    );
    // Results:
    //   Server   Server
    //      \      /
    // Module--App--Module
    //      /      \
    //  Server    Server
  }

  const edges = Edges.map((e) => {
    const relation = e.Relation || e.relation || "";
    const color = mapRelationColor(relation);

    return {
      id: String(e.Id || e.id),
      source: String(e.Source ?? e.source),
      target: String(e.Target ?? e.target),
      label: relation,
      data: {
        relation,
        label: relation,
      },
      style: { stroke: color },
      animated: relation.toLowerCase() === "impacted_by",
      type: "custom",
      //   can we custom direction here for module to server
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
      },
    };
  });

  return { nodes, edges };
}

function mapNodeType(type) {
  if (!type) return "module";

  const t = String(type).toLowerCase();

  if (t.includes("app") || t === "application") return "application";
  if (t.includes("server") || t === "server") return "server";

  return "module";
}

function mapRelationColor(rel) {
  if (!rel) return "#9ca3af";

  const r = String(rel).toLowerCase();

  if (r === "depends_on") return "#60a5fa";
  if (r === "impacted_by") return "#fb7185";
  if (r === "uses") return "#f59e0b";
  if (r === "hosted_on") return "#94a3b8";

  return "#9ca3af";
}
