import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';

interface SpendingData {
  month: string;
  essential: number;
  lifestyle: number;
  savings: number;
  investments: number;
  total: number;
  budget: number;
}

interface EnhancedSpendingChartProps {
  data: SpendingData[];
  title?: string;
  className?: string;
}

const EnhancedSpendingChart: React.FC<EnhancedSpendingChartProps> = ({ 
  data, 
  title = "Monthly Spending Analysis",
  className = "" 
}) => {
  const [viewMode, setViewMode] = useState<'bar' | 'area' | 'composed'>('composed');
  const [selectedMetric, setSelectedMetric] = useState<string>('total');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const categories = [
    { key: 'essential', name: 'Essentials', color: '#00F5FF' },
    { key: 'lifestyle', name: 'Lifestyle', color: '#8B5CF6' },
    { key: 'savings', name: 'Savings', color: '#00FF7F' },
    { key: 'investments', name: 'Investments', color: '#FFD700' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="cosmic-card p-4 border border-neon-cyan/30 backdrop-blur-md">
          <p className="font-orbitron text-neon-cyan font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <span className="text-gray-300 text-sm">{entry.name}:</span>
              <span className="font-mono text-neon-cyan ml-2">
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-600 mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Budget:</span>
              <span className="font-mono text-stellar-gold">
                ₹{payload[0]?.payload?.budget?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (viewMode) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
            />
            <YAxis 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            {categories.map((category) => (
              <Bar
                key={category.key}
                dataKey={category.key}
                fill={category.color}
                radius={[2, 2, 0, 0]}
                fillOpacity={0.8}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
            />
            <YAxis 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            {categories.map((category, index) => (
              <Area
                key={category.key}
                type="monotone"
                dataKey={category.key}
                stackId="1"
                stroke={category.color}
                fill={category.color}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'composed':
      default:
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
            />
            <YAxis 
              stroke="#E5E7EB"
              fontSize={12}
              tick={{ fill: '#E5E7EB' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            {categories.map((category) => (
              <Bar
                key={category.key}
                dataKey={category.key}
                fill={category.color}
                radius={[2, 2, 0, 0]}
                fillOpacity={0.7}
              />
            ))}
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="#FFD700" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        );
    }
  };

  const totalSpent = data.reduce((sum, month) => sum + month.total, 0);
  const avgMonthlySpending = totalSpent / data.length;
  const totalBudget = data.reduce((sum, month) => sum + month.budget, 0);
  const budgetUtilization = (totalSpent / totalBudget) * 100;

  return (
    <Card className={`cosmic-card transform-3d transition-all duration-500 hover:scale-105 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-orbitron text-xl text-cosmic-gradient">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {[
              { mode: 'composed' as const, icon: TrendingUp, label: 'Trend' },
              { mode: 'bar' as const, icon: Calendar, label: 'Bars' },
              { mode: 'area' as const, icon: Target, label: 'Area' },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                size="sm"
                variant={viewMode === mode ? "default" : "outline"}
                onClick={() => setViewMode(mode)}
                className={`cosmic-button px-3 py-1 ${viewMode === mode ? 'bg-neon-cyan text-slate-900' : 'border-neon-cyan text-neon-cyan'}`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/50">
            <div className="text-xs text-gray-400 mb-1">Total Spent</div>
            <div className="font-mono text-lg text-neon-cyan">₹{totalSpent.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/50">
            <div className="text-xs text-gray-400 mb-1">Avg Monthly</div>
            <div className="font-mono text-lg text-cosmic-purple">₹{avgMonthlySpending.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/50">
            <div className="text-xs text-gray-400 mb-1">Budget Usage</div>
            <div className={`font-mono text-lg ${budgetUtilization > 90 ? 'text-nebula-pink' : budgetUtilization > 75 ? 'text-stellar-gold' : 'text-aurora-green'}`}>
              {budgetUtilization.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative">
          {/* 3D Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/5 to-neon-cyan/5 rounded-lg blur-xl" />
          
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categories.map((category) => (
            <div 
              key={category.key}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-space text-gray-300">{category.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
            <div className="w-4 h-1 bg-stellar-gold rounded" style={{ borderStyle: 'dashed' }} />
            <span className="text-sm font-space text-gray-300">Budget Line</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSpendingChart;