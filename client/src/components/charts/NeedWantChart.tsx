import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NeedWantChartProps {
  needsPercentage: number;
  wantsPercentage: number;
}

export function NeedWantChart({ needsPercentage, wantsPercentage }: NeedWantChartProps) {
  const data = [
    { name: 'Needs', value: needsPercentage, color: '#10B981' },
    { name: 'Wants', value: wantsPercentage, color: '#EF4444' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={16}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-80">
      <h3 className="font-orbitron text-xl font-bold mb-4 text-center text-cosmic-400 flex items-center justify-center">
        <span className="mr-2">⚖️</span>
        Needs vs Wants Analysis
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            stroke="#1A1A3A"
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 26, 58, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value: number) => [`${value}%`, 'Percentage']}
          />
          <Legend
            wrapperStyle={{ color: '#ffffff' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
