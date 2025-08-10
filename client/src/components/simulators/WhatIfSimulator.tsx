import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface WhatIfSimulatorProps {
  onSimulationChange: (savingsChange: number, entertainmentReduction: number) => void;
  results: {
    savingsImpact: number;
    goalTimeline: number;
    investmentGrowth: number;
  };
}

export function WhatIfSimulator({ onSimulationChange, results }: WhatIfSimulatorProps) {
  const [savingsChange, setSavingsChange] = useState([0]);
  const [entertainmentReduction, setEntertainmentReduction] = useState([0]);

  const handleSavingsChange = (value: number[]) => {
    setSavingsChange(value);
    onSimulationChange(value[0], entertainmentReduction[0]);
  };

  const handleEntertainmentChange = (value: number[]) => {
    setEntertainmentReduction(value);
    onSimulationChange(savingsChange[0], value[0]);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="font-orbitron text-2xl font-bold text-center">
          <i className="fas fa-calculator mr-3 text-cosmic-400" />
          What-If Mission Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-4 text-gray-300">
                Adjust Monthly Savings (+/-)
              </Label>
              <Slider
                value={savingsChange}
                onValueChange={handleSavingsChange}
                max={100}
                min={-50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>-50%</span>
                <span className="text-neon-cyan font-medium">{savingsChange[0]}%</span>
                <span>+100%</span>
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-4 text-gray-300">
                Reduce Entertainment Spending
              </Label>
              <Slider
                value={entertainmentReduction}
                onValueChange={handleEntertainmentChange}
                max={80}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0%</span>
                <span className="text-neon-purple font-medium">{entertainmentReduction[0]}%</span>
                <span>80%</span>
              </div>
            </div>
          </div>
          
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="font-semibold text-neon-cyan text-lg">
                Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Savings Impact:</span>
                <span className="text-neon-green font-medium">
                  +₹{results.savingsImpact.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Goal Achievement:</span>
                <span className="text-neon-cyan font-medium">
                  {results.goalTimeline} months
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Investment Growth:</span>
                <span className="text-cosmic-400 font-medium">
                  ₹{results.investmentGrowth.toLocaleString()}
                </span>
              </div>
              
              {/* Visual Impact Indicator */}
              <div className="mt-4 p-3 bg-gradient-to-r from-cosmic-900/30 to-space-900/30 rounded-lg">
                <div className="text-center">
                  {results.savingsImpact > 0 ? (
                    <div className="text-neon-green">
                      <i className="fas fa-arrow-up mr-2" />
                      Improved Financial Position
                    </div>
                  ) : results.savingsImpact < 0 ? (
                    <div className="text-red-400">
                      <i className="fas fa-arrow-down mr-2" />
                      Reduced Savings Capacity
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <i className="fas fa-equals mr-2" />
                      No Change in Current Plan
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
