import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Star, DollarSign } from 'lucide-react';

interface FinancialGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'purchase' | 'retirement' | 'education' | 'other';
}

interface TransformationAnalysisProps {
  goals: FinancialGoal[];
  currentMonthlySavings: number;
  simulatedMonthlySavings: number;
  className?: string;
}

const TransformationAnalysis: React.FC<TransformationAnalysisProps> = ({
  goals,
  currentMonthlySavings,
  simulatedMonthlySavings,
  className = ""
}) => {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const sortedGoals = [...goals].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const calculateTimeToGoal = (targetAmount: number, currentAmount: number, monthlySavings: number) => {
    const remaining = targetAmount - currentAmount;
    return Math.ceil(remaining / Math.max(monthlySavings, 1000));
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const currentTimeToAllGoals = calculateTimeToGoal(totalTargetAmount, 0, currentMonthlySavings);
  const simulatedTimeToAllGoals = calculateTimeToGoal(totalTargetAmount, 0, simulatedMonthlySavings);
  const timeSaved = currentTimeToAllGoals - simulatedTimeToAllGoals;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="font-orbitron text-xl text-cosmic-gradient flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-stellar-gold" />
            Financial Transformation Analysis
          </CardTitle>
          <p className="text-sm text-gray-400">
            Compare current vs optimized scenarios for achieving your financial goals
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-neon-cyan">
                ₹{totalTargetAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Goal Amount</div>
            </div>
            
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-nebula-pink">
                {timeSaved > 0 ? timeSaved : 0} months
              </div>
              <div className="text-sm text-gray-400">Time Saved</div>
            </div>
            
            <div className="cosmic-card-inner p-4 text-center">
              <div className="text-2xl font-bold text-stellar-gold">
                ₹{((simulatedMonthlySavings - currentMonthlySavings) * 12).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Annual Savings Boost</div>
            </div>
          </div>

          {/* Individual Goals Analysis */}
          <div>
            <h3 className="text-lg font-orbitron text-neon-cyan mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Individual Goals Impact
            </h3>
            
            <div className="space-y-4">
              {sortedGoals.map((goal, index) => {
                const currentTimeToGoal = calculateTimeToGoal(goal.targetAmount, goal.currentAmount, currentMonthlySavings);
                const simulatedTimeToGoal = calculateTimeToGoal(goal.targetAmount, goal.currentAmount, simulatedMonthlySavings);
                const goalTimeSaved = currentTimeToGoal - simulatedTimeToGoal;
                
                return (
                  <Card key={goal.id} className="cosmic-card-inner">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
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
                          <h4 className="font-semibold text-white">{goal.description}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neon-cyan">
                            ₹{goal.targetAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Current Timeline</div>
                          <div className="flex items-center justify-center gap-1 text-white">
                            <Clock className="w-4 h-4" />
                            {currentTimeToGoal} months
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Optimized Timeline</div>
                          <div className="flex items-center justify-center gap-1 text-neon-green">
                            <Clock className="w-4 h-4" />
                            {simulatedTimeToGoal} months
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-400 mb-1">Time Saved</div>
                          <div className="flex items-center justify-center gap-1 text-stellar-gold">
                            <TrendingUp className="w-4 h-4" />
                            {goalTimeSaved > 0 ? goalTimeSaved : 0} months
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress 
                          value={(goal.currentAmount / goal.targetAmount) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>₹{goal.currentAmount.toLocaleString()}</span>
                          <span>₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <h3 className="text-lg font-orbitron text-neon-cyan mb-4">Scenario Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400">Metric</th>
                    <th className="text-center py-2 text-gray-400">Current</th>
                    <th className="text-center py-2 text-gray-400">Optimized</th>
                    <th className="text-center py-2 text-gray-400">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-white">Monthly Savings</td>
                    <td className="py-3 text-center text-white">₹{currentMonthlySavings.toLocaleString()}</td>
                    <td className="py-3 text-center text-neon-green">₹{simulatedMonthlySavings.toLocaleString()}</td>
                    <td className="py-3 text-center text-stellar-gold">
                      +₹{(simulatedMonthlySavings - currentMonthlySavings).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-white">Time to All Goals</td>
                    <td className="py-3 text-center text-white">{currentTimeToAllGoals} months</td>
                    <td className="py-3 text-center text-neon-green">{simulatedTimeToAllGoals} months</td>
                    <td className="py-3 text-center text-stellar-gold">
                      -{timeSaved > 0 ? timeSaved : 0} months
                    </td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 text-white">Annual Wealth Building</td>
                    <td className="py-3 text-center text-white">₹{(currentMonthlySavings * 12).toLocaleString()}</td>
                    <td className="py-3 text-center text-neon-green">₹{(simulatedMonthlySavings * 12).toLocaleString()}</td>
                    <td className="py-3 text-center text-stellar-gold">
                      +₹{((simulatedMonthlySavings - currentMonthlySavings) * 12).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransformationAnalysis;