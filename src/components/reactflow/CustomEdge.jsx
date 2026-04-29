import React from "react";

// Custom edge renderer for XYFlow/React Flow compatible API
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  style,
}) {
  
  const relation = data?.relation || data?.Relation || "";

  const styleMap = {
    depends_on: { stroke: "#60a5fa", animated: false },
    impacted_by: { stroke: "#fb7185", animated: true },
    uses: { stroke: "#f59e0b", animated: false },
    hosted_on: { stroke: "#94a3b8", animated: false },
  };

  const relStyle = styleMap[relation] || { stroke: "#9ca3af", animated: false };
  const stroke = (style && style.stroke) || relStyle.stroke;
  const strokeWidth = selected ? 3 : 2;

  // const d = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  let d = "";

  switch (relation) {
    case "hosted_on":
      d = `M ${sourceX},${sourceY}
         C ${(sourceX + targetX) / 2},${sourceY}
           ${(sourceX + targetX) / 2},${targetY}
           ${targetX},${targetY}`;
      break;

    case "depends_on":
      d = `M ${sourceX},${sourceY}
         C ${sourceX + 100},${sourceY}
           ${targetX - 100},${targetY}
           ${targetX},${targetY}`;
      break;

    case "uses":
      d = `M ${sourceX},${sourceY}
         Q ${(sourceX + targetX) / 2},${sourceY - 50}
           ${targetX},${targetY}`;
      break;

    default:
      d = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  }

  const markerId = `arrow-${id}`;

  return (
    <g className="react-flow__edge" data-relation={relation}>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,8 L8,4 z" fill={stroke} />
        </marker>
      </defs>

      <path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        style={{ transition: "stroke-width 120ms ease" }}
      />

      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            className="text-xs text-slate-600"
          >
            {data.label}
          </textPath>
        </text>
      )}
    </g>
  );
}
