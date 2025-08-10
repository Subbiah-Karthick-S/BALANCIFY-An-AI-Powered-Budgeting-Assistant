import { GoogleGenAI } from "@google/genai";
import { QuestionnaireData } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FinancialInsights {
  spendingPatterns: string;
  optimizationOpportunities: string;
  investmentRecommendations: string;
  riskAnalysis: string;
  goalAchievability: string;
}

export interface SpendingBreakdown {
  housing: number;
  food: number;
  transportation: number;
  entertainment: number;
  shopping: number;
  subscriptions: number;
  loans: number;
  investments: number;
  savings: number;
  other: number;
}

export interface NeedsWantsAnalysis {
  needs: {
    housing: number;
    food_essential: number;
    transportation: number;
    utilities: number;
    loan_payments: number;
  };
  wants: {
    dining_out: number;
    entertainment: number;
    shopping: number;
    subscriptions: number;
    other: number;
  };
  needsPercentage: number;
  wantsPercentage: number;
}

export interface Recommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  emergencyFund: string;
  investmentStrategy: string;
}

export interface FinancialGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'purchase' | 'retirement' | 'education' | 'other';
}

export interface GoalTimeline {
  currentSavings: number;
  targetAmount: number;
  monthlyContribution: number;
  timeToGoal: number;
  milestones: {
    month: number;
    amount: number;
    description: string;
  }[];
}

export async function analyzeFinancialData(data: QuestionnaireData): Promise<{
  insights: FinancialInsights;
  spendingBreakdown: SpendingBreakdown;
  needsWantsAnalysis: NeedsWantsAnalysis;
  recommendations: Recommendations;
  goalTimeline: GoalTimeline;
  financialGoals: FinancialGoal[];
}> {
  try {
    // Calculate spending breakdown
    const spendingBreakdown = calculateSpendingBreakdown(data);
    
    // Analyze needs vs wants
    const needsWantsAnalysis = analyzeNeedsVsWants(data, spendingBreakdown);
    
    // Calculate goal timeline
    const goalTimeline = calculateGoalTimeline(data, spendingBreakdown);
    
    // Generate AI insights
    const insights = await generateAIInsights(data, spendingBreakdown, needsWantsAnalysis);
    
    // Parse financial goals from text input
    const financialGoals = parseFinancialGoals(data.financial_goals, data.monthly_income);
    
    // Generate recommendations
    const recommendations = await generateRecommendations(data, spendingBreakdown, needsWantsAnalysis);
    
    return {
      insights,
      spendingBreakdown,
      needsWantsAnalysis,
      recommendations,
      goalTimeline,
      financialGoals,
    };
  } catch (error) {
    throw new Error(`Failed to analyze financial data: ${error}`);
  }
}

function calculateSpendingBreakdown(data: QuestionnaireData): SpendingBreakdown {
  const monthlyGroceries = data.groceries_weekly * 4;
  const loanPayment = data.has_loans === "Yes" ? (data.loan_repayment || 0) : 0;
  const entertainment = calculateEntertainmentCost(data);
  
  // Calculate total expenses first
  const totalExpenses = 
    data.housing_expenses + data.utility_bills +
    monthlyGroceries + data.dining_monthly +
    data.transport_monthly +
    entertainment +
    data.shopping_monthly +
    data.subscription_cost +
    loanPayment +
    data.monthly_investment;
  
  // Calculate actual savings as income - total expenses
  const actualSavings = Math.max(0, data.monthly_income - totalExpenses);
  
  return {
    housing: data.housing_expenses + data.utility_bills,
    food: monthlyGroceries + data.dining_monthly,
    transportation: data.transport_monthly,
    entertainment: entertainment,
    shopping: data.shopping_monthly,
    subscriptions: data.subscription_cost,
    loans: loanPayment,
    investments: data.monthly_investment,
    savings: actualSavings, // Use actual savings, not preferred savings
    other: 0 // Since we calculated actual savings, other should be 0
  };
}

function calculateEntertainmentCost(data: QuestionnaireData): number {
  // Estimate entertainment cost based on hours and spending patterns
  const baseRate = data.impulse_shopping * 500; // Base rate per impulse level
  const frequencyMultiplier = data.entertainment_hours / 10;
  return Math.round(baseRate * frequencyMultiplier);
}

function analyzeNeedsVsWants(data: QuestionnaireData, spending: SpendingBreakdown): NeedsWantsAnalysis {
  const needs = {
    housing: spending.housing,
    food_essential: Math.round(spending.food * 0.7), // 70% of food is essential
    transportation: spending.transportation,
    utilities: data.utility_bills,
    loan_payments: spending.loans,
  };
  
  const wants = {
    dining_out: Math.round(spending.food * 0.3), // 30% of food is dining out
    entertainment: spending.entertainment,
    shopping: spending.shopping,
    subscriptions: spending.subscriptions,
    other: spending.other,
  };
  
  const totalNeeds = Object.values(needs).reduce((sum, val) => sum + val, 0);
  const totalWants = Object.values(wants).reduce((sum, val) => sum + val, 0);
  const totalSpending = totalNeeds + totalWants;
  
  return {
    needs,
    wants,
    needsPercentage: Math.round((totalNeeds / totalSpending) * 100),
    wantsPercentage: Math.round((totalWants / totalSpending) * 100),
  };
}

function parseFinancialGoals(financialGoalsArray: any[], monthlyIncome: number): FinancialGoal[] {
  if (!Array.isArray(financialGoalsArray) || financialGoalsArray.length === 0) {
    return [{
      id: 'goal_1',
      description: 'Emergency Fund',
      targetAmount: 500000,
      currentAmount: 0,
      priority: 'high',
      category: 'emergency'
    }];
  }

  return financialGoalsArray.map((goal, index) => ({
    id: `goal_${index + 1}`,
    description: goal.description || 'Financial Goal',
    targetAmount: goal.target_amount || 500000,
    currentAmount: 0, // Starting fresh
    priority: goal.priority || 'medium',
    category: goal.category || 'other'
  }));
}

function calculateGoalTimeline(data: QuestionnaireData, spending: SpendingBreakdown): GoalTimeline {
  // Use the highest priority goal as the primary target
  const primaryGoal = data.financial_goals.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  })[0];
  
  const targetAmount = primaryGoal?.target_amount || 500000;
  const monthlyContribution = spending.savings + spending.investments;
  const timeToGoal = Math.ceil(targetAmount / Math.max(monthlyContribution, 1000));
  
  const milestones = [];
  const timelineMonths = Math.min(primaryGoal?.timeline_months || 24, timeToGoal, 240);
  for (let month = 6; month <= timelineMonths; month += 6) {
    milestones.push({
      month,
      amount: Math.round(monthlyContribution * month),
      description: `${month} month milestone`,
    });
  }
  
  return {
    currentSavings: 0,
    targetAmount,
    monthlyContribution,
    timeToGoal: Math.min(timeToGoal, primaryGoal?.timeline_months || 24),
    milestones,
  };
}

async function generateAIInsights(
  data: QuestionnaireData,
  spending: SpendingBreakdown,
  needsWants: NeedsWantsAnalysis
): Promise<FinancialInsights> {
  const prompt = `
  Analyze this financial profile and provide insights:
  
  Income: ₹${data.monthly_income}
  Spending Breakdown: ${JSON.stringify(spending)}
  Needs vs Wants: ${needsWants.needsPercentage}% needs, ${needsWants.wantsPercentage}% wants
  Financial Discipline: ${data.financial_discipline}/5
  Risk Tolerance: ${data.risk_taking}
  Investment Types: ${data.investment_types.join(', ')}
  
  Provide insights in JSON format with these fields:
  - spendingPatterns: analysis of spending behavior
  - optimizationOpportunities: areas for improvement
  - investmentRecommendations: investment advice based on risk profile
  - riskAnalysis: financial risk assessment
  - goalAchievability: assessment of goal achievability
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          spendingPatterns: { type: "string" },
          optimizationOpportunities: { type: "string" },
          investmentRecommendations: { type: "string" },
          riskAnalysis: { type: "string" },
          goalAchievability: { type: "string" },
        },
        required: ["spendingPatterns", "optimizationOpportunities", "investmentRecommendations", "riskAnalysis", "goalAchievability"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (rawJson) {
    return JSON.parse(rawJson);
  } else {
    throw new Error("Empty response from AI model");
  }
}

async function generateRecommendations(
  data: QuestionnaireData,
  spending: SpendingBreakdown,
  needsWants: NeedsWantsAnalysis
): Promise<Recommendations> {
  const prompt = `
  Based on this financial profile, provide actionable recommendations:
  
  Income: ₹${data.monthly_income}
  Spending: ${JSON.stringify(spending)}
  Willingness to reduce expenses: ${data.expense_reduction}/10
  Financial goals: ${data.financial_goals}
  
  Provide recommendations in JSON format:
  - immediate: array of immediate actions (1-3 months)
  - shortTerm: array of short-term goals (3-12 months)
  - longTerm: array of long-term strategies (1+ years)
  - emergencyFund: emergency fund recommendation
  - investmentStrategy: investment strategy recommendation
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          immediate: { type: "array", items: { type: "string" } },
          shortTerm: { type: "array", items: { type: "string" } },
          longTerm: { type: "array", items: { type: "string" } },
          emergencyFund: { type: "string" },
          investmentStrategy: { type: "string" },
        },
        required: ["immediate", "shortTerm", "longTerm", "emergencyFund", "investmentStrategy"],
      },
    },
    contents: prompt,
  });

  const rawJson = response.text;
  if (rawJson) {
    return JSON.parse(rawJson);
  } else {
    throw new Error("Empty response from AI model");
  }
}
