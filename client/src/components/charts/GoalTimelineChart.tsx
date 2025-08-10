import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface GoalTimelineChartProps {
  milestones: {
    month: number;
    amount: number;
    description: string;
  }[];
  targetAmount: number;
}

export function GoalTimelineChart({ milestones, targetAmount }: GoalTimelineChartProps) {
  const data = milestones.map(milestone => ({
    month: milestone.month,
    amount: milestone.amount,
    target: targetAmount,
    description: milestone.description,
  }));

  return (
    <div className="w-full h-80">
      <h3 className="font-orbitron text-2xl font-bold mb-6 text-center text-neon-green flex items-center justify-center">
        <span className="mr-3">📈</span>
        Financial Goal Timeline
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#E5E7EB"
            fontSize={12}
            tickFormatter={(value) => `${Math.ceil(value/12)}Y`}
          />
          <YAxis 
            stroke="#E5E7EB"
            fontSize={12}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 26, 58, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value: number, name: string) => [
              `₹${value.toLocaleString()}`, 
              name === 'amount' ? 'Investment Growth' : 'Target'
            ]}
            labelFormatter={(month: number) => `Month ${month}`}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#00F5FF"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGrowth)"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#D946EF"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
