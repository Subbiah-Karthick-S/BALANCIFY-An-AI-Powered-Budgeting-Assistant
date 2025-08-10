import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SimulationAdjustments } from '@/types/financial';

interface WhatIfSimulatorProps {
  questionnaireId: string;
  originalData: {
    preferred_savings: number;
    subscription_cost: number;
    entertainment_hours: number;
    shopping_monthly: number;
    dining_monthly: number;
  };
}

export function WhatIfSimulator({ questionnaireId, originalData }: WhatIfSimulatorProps) {
  const [adjustments, setAdjustments] = useState<SimulationAdjustments>({
    preferred_savings: originalData.preferred_savings,
    subscription_cost: originalData.subscription_cost,
    entertainment_hours: originalData.entertainment_hours,
    shopping_monthly: originalData.shopping_monthly,
    dining_monthly: originalData.dining_monthly,
  });

  const [simulationResults, setSimulationResults] = useState({
    savingsImpact: 0,
    goalTimeline: 36,
    investmentGrowth: 0,
  });

  const simulate = useMutation({
    mutationFn: async (adjustments: SimulationAdjustments) => {
      const response = await apiRequest('POST', '/api/simulate', {
        questionnaireId,
        adjustments,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Calculate impact based on simulation results
      const savingsIncrease = (adjustments.preferred_savings || 0) - originalData.preferred_savings;
      const subscriptionSavings = originalData.subscription_cost - (adjustments.subscription_cost || 0);
      const shoppingSavings = originalData.shopping_monthly - (adjustments.shopping_monthly || 0);
      const diningS = originalData.dining_monthly - (adjustments.dining_monthly || 0);
      
      const totalImpact = savingsIncrease + subscriptionSavings + shoppingSavings + diningS;
      const newTimeline = Math.max(12, data.goalTimeline?.timeToGoal || 36);
      const investmentGrowth = Math.round(totalImpact * 12 * 1.08);
      
      setSimulationResults({
        savingsImpact: totalImpact,
        goalTimeline: newTimeline,
        investmentGrowth,
      });
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      simulate.mutate(adjustments);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [adjustments]);

  const handleAdjustment = (key: keyof SimulationAdjustments, value: number[]) => {
    setAdjustments(prev => ({ ...prev, [key]: value[0] }));
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardContent className="p-8">
        <h3 className="font-orbitron text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <Calculator className="mr-3 text-cosmic-400" />
          What-If Mission Simulator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Savings Adjustment */}
            <div className="space-y-2">
              <Label className="text-gray-300">Monthly Savings Target</Label>
              <Slider
                value={[adjustments.preferred_savings || 0]}
                onValueChange={(value) => handleAdjustment('preferred_savings', value)}
                min={0}
                max={originalData.preferred_savings * 2}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹0</span>
                <span className="text-neon-cyan font-medium">₹{adjustments.preferred_savings?.toLocaleString()}</span>
                <span>₹{(originalData.preferred_savings * 2).toLocaleString()}</span>
              </div>
            </div>

            {/* Subscription Reduction */}
            <div className="space-y-2">
              <Label className="text-gray-300">Subscription Costs</Label>
              <Slider
                value={[adjustments.subscription_cost || 0]}
                onValueChange={(value) => handleAdjustment('subscription_cost', value)}
                min={0}
                max={originalData.subscription_cost}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹0</span>
                <span className="text-neon-cyan font-medium">₹{adjustments.subscription_cost?.toLocaleString()}</span>
                <span>₹{originalData.subscription_cost.toLocaleString()}</span>
              </div>
            </div>

            {/* Shopping Reduction */}
            <div className="space-y-2">
              <Label className="text-gray-300">Shopping Budget</Label>
              <Slider
                value={[adjustments.shopping_monthly || 0]}
                onValueChange={(value) => handleAdjustment('shopping_monthly', value)}
                min={0}
                max={originalData.shopping_monthly}
                step={200}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹0</span>
                <span className="text-neon-cyan font-medium">₹{adjustments.shopping_monthly?.toLocaleString()}</span>
                <span>₹{originalData.shopping_monthly.toLocaleString()}</span>
              </div>
            </div>

            {/* Dining Reduction */}
            <div className="space-y-2">
              <Label className="text-gray-300">Dining Out Budget</Label>
              <Slider
                value={[adjustments.dining_monthly || 0]}
                onValueChange={(value) => handleAdjustment('dining_monthly', value)}
                min={0}
                max={originalData.dining_monthly}
                step={200}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹0</span>
                <span className="text-neon-cyan font-medium">₹{adjustments.dining_monthly?.toLocaleString()}</span>
                <span>₹{originalData.dining_monthly.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-lg">
            <h4 className="font-semibold mb-4 text-neon-cyan">Simulation Results</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly Savings Impact:</span>
                <span className={`font-medium ${simulationResults.savingsImpact >= 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {simulationResults.savingsImpact >= 0 ? '+' : ''}₹{simulationResults.savingsImpact.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Goal Achievement:</span>
                <span className="text-neon-cyan font-medium">{simulationResults.goalTimeline} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Annual Investment Growth:</span>
                <span className="text-cosmic-400 font-medium">₹{simulationResults.investmentGrowth.toLocaleString()}</span>
              </div>
            </div>
            
            {simulate.isPending && (
              <div className="mt-4 text-center text-gray-400">
                <div className="animate-pulse">Calculating scenarios...</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
