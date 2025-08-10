import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
  color: string;
  trend?: number;
  description?: string;
}

interface Advanced3DPieChartProps {
  data: DataPoint[];
  title: string;
  total?: number;
  className?: string;
}

const Advanced3DPieChart: React.FC<Advanced3DPieChartProps> = ({ 
  data, 
  title, 
  total,
  className = "" 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-card p-4 border border-neon-cyan/30 backdrop-blur-md">
          <p className="font-orbitron text-neon-cyan font-semibold">{data.name}</p>
          <p className="text-astral-white">
            <span className="font-mono">₹{data.value.toLocaleString()}</span>
          </p>
          {data.description && (
            <p className="text-gray-300 text-sm mt-1">{data.description}</p>
          )}
          {data.trend && (
            <div className="flex items-center mt-2">
              {data.trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-aurora-green mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-nebula-pink mr-1" />
              )}
              <span className={`text-sm font-mono ${data.trend > 0 ? 'text-aurora-green' : 'text-nebula-pink'}`}>
                {data.trend > 0 ? '+' : ''}{data.trend}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry: any, index: number) => (
          <div 
            key={index}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 ${
              activeIndex === index ? 'bg-cosmic-purple/20 shadow-lg' : 'hover:bg-slate-800/50'
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-space text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const totalAmount = total || data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={`cosmic-card transform-3d transition-all duration-500 hover:scale-105 ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="font-orbitron text-xl text-cosmic-gradient mb-2">
          {title}
        </CardTitle>
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="w-5 h-5 text-stellar-gold" />
          <span className="font-mono text-2xl text-neon-cyan">
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative">
          {/* 3D Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/10 to-neon-cyan/10 rounded-full blur-xl" />
          
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>
              
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    stroke={activeIndex === index ? entry.color : 'none'}
                    strokeWidth={activeIndex === index ? 3 : 0}
                    style={{
                      filter: activeIndex === index ? 'drop-shadow(0 0 10px currentColor)' : 'none',
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
              
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="font-orbitron text-lg text-neon-cyan animate-pulse-neon">
                TOTAL
              </div>
              <div className="font-mono text-sm text-gray-400">
                {data.length} Categories
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {data.slice(0, 3).map((item, index) => (
            <div 
              key={index}
              className="text-center p-3 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/30"
            >
              <div className="text-xs text-gray-400 mb-1">{item.name}</div>
              <div className="font-mono text-sm text-neon-cyan">
                ₹{item.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {((item.value / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Advanced3DPieChart;