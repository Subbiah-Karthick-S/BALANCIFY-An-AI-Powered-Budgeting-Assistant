import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Clock, TrendingUp, DollarSign, Star, Zap } from 'lucide-react';
import WhatIfSimulator from '../WhatIfSimulator';

interface FinancialGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'purchase' | 'retirement' | 'education' | 'other';
}

interface IndividualGoalChartProps {
  goal: FinancialGoal;
  monthlySavings: number;
  goalIndex: number;
  className?: string;
}

const IndividualGoalChart: React.FC<IndividualGoalChartProps> = ({
  goal,
  monthlySavings,
  goalIndex,
  className = ""
}) => {
  const [showWhatIf, setShowWhatIf] = useState(false);
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const categoryColors = {
    emergency: '#ef4444',
    investment: '#8b5cf6',
    purchase: '#f59e0b',
    retirement: '#10b981',
    education: '#3b82f6',
    other: '#6b7280'
  };

  // Calculate timeline data
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const monthsToGoal = Math.ceil(remainingAmount / Math.max(monthlySavings, 1000));
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  // Generate projection data for the chart
  const projectionData = [];
  for (let month = 0; month <= Math.min(monthsToGoal, 60); month++) {
    const projectedAmount = Math.min(
      goal.currentAmount + (monthlySavings * month),
      goal.targetAmount
    );
    
    projectionData.push({
      month: `Month ${month}`,
      monthNumber: month,
      current: month === 0 ? goal.currentAmount : 0,
      projected: projectedAmount,
      target: goal.targetAmount,
      progress: (projectedAmount / goal.targetAmount) * 100
    });
  }

  // Milestone markers
  const milestones = [];
  const milestoneIntervals = [25, 50, 75, 90, 100];
  milestoneIntervals.forEach(percentage => {
    const milestoneAmount = (goal.targetAmount * percentage) / 100;
    const monthsToMilestone = Math.ceil((milestoneAmount - goal.currentAmount) / monthlySavings);
    if (monthsToMilestone > 0 && monthsToMilestone <= monthsToGoal) {
      milestones.push({
        month: monthsToMilestone,
        percentage,
        amount: milestoneAmount
      });
    }
  });

  return (
    <Card className={`cosmic-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-orbitron text-cosmic-gradient flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal {goalIndex + 1}: {goal.description}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="border-2"
              style={{ 
                borderColor: priorityColors[goal.priority], 
                color: priorityColors[goal.priority] 
              }}
            >
              <Star className="w-3 h-3 mr-1" />
              {goal.priority.toUpperCase()}
            </Badge>
            <Badge 
              variant="outline"
              style={{ 
                borderColor: categoryColors[goal.category], 
                color: categoryColors[goal.category] 
              }}
            >
              {goal.category.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Goal Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="cosmic-card-inner p-3 text-center">
            <div className="text-xl font-bold text-neon-cyan">
              ₹{goal.targetAmount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Target Amount</div>
          </div>
          
          <div className="cosmic-card-inner p-3 text-center">
            <div className="text-xl font-bold text-stellar-gold">
              ₹{goal.currentAmount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Current Amount</div>
          </div>
          
          <div className="cosmic-card-inner p-3 text-center">
            <div className="text-xl font-bold text-nebula-pink">
              {monthsToGoal} months
            </div>
            <div className="text-xs text-gray-400">Time to Goal</div>
          </div>
          
          <div className="cosmic-card-inner p-3 text-center">
            <div className="text-xl font-bold text-neon-green">
              {progressPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Progress</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress to Goal</span>
            <span className="text-neon-cyan font-medium">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
            style={{ 
              background: `linear-gradient(to right, ${categoryColors[goal.category]} 0%, transparent 100%)` 
            }}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{goal.currentAmount.toLocaleString()}</span>
            <span>₹{goal.targetAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-orbitron text-neon-cyan flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Goal Achievement Timeline
          </h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id={`goalGradient${goalIndex}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={categoryColors[goal.category]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={categoryColors[goal.category]} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="monthNumber" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `M${value}`}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: any, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name === 'projected' ? 'Projected Amount' : 
                    name === 'target' ? 'Target Amount' : 'Current Amount'
                  ]}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke={categoryColors[goal.category]}
                  strokeWidth={2}
                  fillUrl={`url(#goalGradient${goalIndex})`}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-orbitron text-neon-cyan flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Achievement Milestones
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="cosmic-card-inner p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {milestone.percentage}% Complete
                    </div>
                    <div className="text-xs text-gray-400">
                      ₹{milestone.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-neon-cyan">
                      Month {milestone.month}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(Date.now() + milestone.month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What If Simulator Toggle */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={() => setShowWhatIf(!showWhatIf)}
            variant="outline"
            className="w-full cosmic-button border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            {showWhatIf ? 'Hide' : 'Show'} What If Analysis
          </Button>
        </div>

        {/* What If Simulator */}
        {showWhatIf && (
          <div className="mt-6">
            <WhatIfSimulator
              questionnaireId={`individual-goal-${goal.id || goalIndex}`}
              initialData={{
                income: { monthly: monthlySavings * 2 }, // Estimated total income
                expenses: { total: monthlySavings }, // Estimated expenses
                currentSavings: goal.currentAmount,
                financialGoals: [goal],
                spendingBreakdown: {
                  savings: monthlySavings * 0.6,
                  investments: monthlySavings * 0.4,
                  housing: monthlySavings * 1.2,
                  food: monthlySavings * 0.8,
                  transportation: monthlySavings * 0.4,
                  entertainment: monthlySavings * 0.3,
                  utilities: monthlySavings * 0.2,
                  healthcare: monthlySavings * 0.1,
                  other: monthlySavings * 0.1
                }
              }}
              className="border-t border-gray-700 pt-6 mt-6"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualGoalChart;