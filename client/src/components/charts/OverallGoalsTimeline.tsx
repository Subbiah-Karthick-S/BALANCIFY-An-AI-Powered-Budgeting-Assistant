import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Users, TrendingUp } from 'lucide-react';

interface FinancialGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'purchase' | 'retirement' | 'education' | 'other';
}

interface OverallGoalsTimelineProps {
  goals: FinancialGoal[];
  monthlySavings: number;
  className?: string;
}

const OverallGoalsTimeline: React.FC<OverallGoalsTimelineProps> = ({
  goals,
  monthlySavings,
  className = ""
}) => {
  const categoryColors = {
    emergency: '#ef4444',
    investment: '#8b5cf6',
    purchase: '#f59e0b',
    retirement: '#10b981',
    education: '#3b82f6',
    other: '#6b7280'
  };

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  // Sort goals by priority for achievement order
  const sortedGoals = [...goals].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Calculate timeline data for all goals
  const timelineData = [];
  const maxMonths = 120; // 10 years max view
  
  // Calculate when each goal will be achieved
  const goalAchievementData = sortedGoals.map((goal, index) => {
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const monthsToGoal = Math.ceil(remainingAmount / Math.max(monthlySavings, 1000));
    
    return {
      goal,
      index,
      monthsToGoal,
      achievementMonth: monthsToGoal,
      cumulativeTarget: sortedGoals.slice(0, index + 1).reduce((sum, g) => sum + g.targetAmount, 0)
    };
  });

  // Generate monthly data for the chart
  for (let month = 0; month <= Math.min(maxMonths, Math.max(...goalAchievementData.map(g => g.monthsToGoal))); month++) {
    const monthData: any = {
      month: `Month ${month}`,
      monthNumber: month,
    };

    // Add cumulative progress line
    let cumulativeProgress = 0;
    goalAchievementData.forEach(({ goal, monthsToGoal, index }) => {
      const goalProgress = month <= monthsToGoal 
        ? goal.currentAmount + (monthlySavings * month)
        : goal.targetAmount;
      
      if (month <= monthsToGoal) {
        cumulativeProgress += Math.min(goalProgress, goal.targetAmount);
      } else {
        cumulativeProgress += goal.targetAmount;
      }

      // Individual goal lines
      monthData[`goal_${index}`] = month <= monthsToGoal ? goalProgress : goal.targetAmount;
      monthData[`goal_${index}_name`] = goal.description;
      monthData[`goal_${index}_color`] = categoryColors[goal.category];
    });

    monthData.cumulativeProgress = cumulativeProgress;
    monthData.totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    
    timelineData.push(monthData);
  }

  // Calculate achievement milestones
  const achievements = goalAchievementData.map(({ goal, monthsToGoal, cumulativeTarget }) => ({
    month: monthsToGoal,
    goalName: goal.description,
    amount: goal.targetAmount,
    cumulativeAmount: cumulativeTarget,
    priority: goal.priority,
    category: goal.category,
    date: new Date(Date.now() + monthsToGoal * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  })).sort((a, b) => a.month - b.month);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="font-orbitron text-xl text-cosmic-gradient flex items-center gap-2">
            <Users className="w-5 h-5 text-stellar-gold" />
            Overall Goals Achievement Timeline
          </CardTitle>
          <p className="text-sm text-gray-400">
            Complete roadmap showing when each financial goal will be achieved
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Goals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-neon-cyan">
                {goals.length}
              </div>
              <div className="text-sm text-gray-400">Total Goals</div>
            </div>
            
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-stellar-gold">
                ₹{goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Target</div>
            </div>
            
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-nebula-pink">
                {Math.max(...goalAchievementData.map(g => g.monthsToGoal))} months
              </div>
              <div className="text-sm text-gray-400">Last Goal</div>
            </div>
            
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-neon-green">
                ₹{monthlySavings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Monthly Savings</div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="space-y-3">
            <h4 className="text-lg font-orbitron text-neon-cyan flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Cumulative Goals Achievement
            </h4>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
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
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'cumulativeProgress') {
                        return [`₹${value.toLocaleString()}`, 'Cumulative Progress'];
                      }
                      const goalIndex = name.split('_')[1];
                      const goalName = timelineData[0][`goal_${goalIndex}_name`];
                      return [`₹${value.toLocaleString()}`, goalName];
                    }}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Legend />
                  
                  {/* Individual goal lines */}
                  {sortedGoals.map((goal, index) => (
                    <Line
                      key={`goal_${index}`}
                      type="monotone"
                      dataKey={`goal_${index}`}
                      stroke={categoryColors[goal.category]}
                      strokeWidth={2}
                      strokeDasharray="2 2"
                      dot={false}
                      name={goal.description}
                    />
                  ))}
                  
                  {/* Cumulative progress line */}
                  <Line
                    type="monotone"
                    dataKey="cumulativeProgress"
                    stroke="#06d6a0"
                    strokeWidth={3}
                    dot={false}
                    name="Total Progress"
                  />
                  
                  {/* Total target line */}
                  <Line
                    type="monotone"
                    dataKey="totalTarget"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Total Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Schedule */}
          <div className="space-y-3">
            <h4 className="text-lg font-orbitron text-neon-cyan flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Goal Achievement Schedule
            </h4>
            
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="cosmic-card-inner p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="border-2"
                        style={{ 
                          borderColor: priorityColors[achievement.priority], 
                          color: priorityColors[achievement.priority] 
                        }}
                      >
                        {achievement.priority.toUpperCase()}
                      </Badge>
                      <div>
                        <h5 className="font-semibold text-white">{achievement.goalName}</h5>
                        <p className="text-sm text-gray-400">{achievement.category} goal</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-neon-cyan">
                        Month {achievement.month}
                      </div>
                      <div className="text-sm text-gray-400">{achievement.date}</div>
                      <div className="text-sm font-medium text-stellar-gold">
                        ₹{achievement.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Individual Goal Target</span>
                    <span>Cumulative: ₹{achievement.cumulativeAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallGoalsTimeline;