import { Area, AreaChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { GridTrendPoint } from "../../types/greenqueue";

interface CarbonTrendChartProps {
  trend: GridTrendPoint[];
  threshold: number;
}

export function CarbonTrendChart({ trend, threshold }: CarbonTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gqCarbonFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ED8A0" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2ED8A0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" tick={{ fill: "#7E9691", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
        <ReferenceLine y={threshold} stroke="#C98A3E" strokeDasharray="3 3" strokeOpacity={0.6} />
        <Area
          type="monotone"
          dataKey="carbonIntensity"
          stroke="#2ED8A0"
          strokeWidth={1.5}
          fill="url(#gqCarbonFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
