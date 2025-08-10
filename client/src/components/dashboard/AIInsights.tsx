import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lightbulb, TrendingUp, Shield } from 'lucide-react';

interface AIInsightsProps {
  insights: {
    spendingPatterns: string;
    optimizationOpportunities: string;
    investmentRecommendations: string;
    riskAnalysis: string;
    goalAchievability: string;
  };
}

export function AIInsights({ insights }: AIInsightsProps) {
  const insightItems = [
    {
      icon: Brain,
      title: "Spending Pattern Analysis",
      content: insights.spendingPatterns,
      color: "text-neon-cyan",
      borderColor: "border-neon-cyan",
    },
    {
      icon: Lightbulb,
      title: "Optimization Opportunities",
      content: insights.optimizationOpportunities,
      color: "text-neon-green",
      borderColor: "border-neon-green",
    },
    {
      icon: TrendingUp,
      title: "Investment Recommendations",
      content: insights.investmentRecommendations,
      color: "text-neon-purple",
      borderColor: "border-neon-purple",
    },
    {
      icon: Shield,
      title: "Risk Analysis",
      content: insights.riskAnalysis,
      color: "text-yellow-400",
      borderColor: "border-yellow-400",
    },
  ];

  return (
    <Card className="glass-effect border-white/20">
      <CardContent className="p-8">
        <h3 className="font-orbitron text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <Brain className="mr-3 text-neon-cyan" />
          AI Financial Intelligence Report
        </h3>
        
        <div className="space-y-6">
          {insightItems.map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gradient-to-r from-cosmic-900/50 to-space-900/50 rounded-lg border-l-4 ${item.borderColor}`}
            >
              <h4 className={`font-semibold ${item.color} mb-2 flex items-center`}>
                <item.icon className="w-5 h-5 mr-2" />
                {item.title}
              </h4>
              <p className="text-gray-300 leading-relaxed">{item.content}</p>
            </div>
          ))}
          
          <div className="p-4 bg-gradient-to-r from-cosmic-900/50 to-space-900/50 rounded-lg border-l-4 border-cosmic-400">
            <h4 className="font-semibold text-cosmic-400 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Goal Achievability Assessment
            </h4>
            <p className="text-gray-300 leading-relaxed">{insights.goalAchievability}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
