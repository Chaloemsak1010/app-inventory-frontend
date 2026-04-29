import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#9ca3af"]; // blue-600, gray-400

export default function DonutChart({ cloud, onPrem }) {
  const total = cloud + onPrem;

  const data = [
    { name: "Cloud", value: cloud },
    { name: "On-Prem", value: onPrem },
  ];

  return (
    <div className="relative w-32 h-32">
      <PieChart width={128} height={128}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={42}
          outerRadius={56}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">
          {Math.round((cloud / total) * 100)}%
        </span>
      </div>
    </div>
  );
}
