import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CashFlowChartProps {
  income: number;
  expenses: number;
  investments: number;
  savings: number;
}

export function CashFlowChart({ income, expenses, investments, savings }: CashFlowChartProps) {
  const data = [
    {
      name: 'Income',
      amount: income,
      color: '#10B981',
    },
    {
      name: 'Expenses',
      amount: expenses,
      color: '#EF4444',
    },
    {
      name: 'Investments',
      amount: investments,
      color: '#D946EF',
    },
    {
      name: 'Savings',
      amount: savings,
      color: '#00F5FF',
    },
  ];

  return (
    <div className="w-full h-80">
      <h3 className="font-orbitron text-lg font-bold mb-4 text-center text-neon-cyan">
        Cash Flow Analysis
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#E5E7EB"
            fontSize={12}
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
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
          />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="amount" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
