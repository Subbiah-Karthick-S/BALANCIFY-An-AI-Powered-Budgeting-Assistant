import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FinancialData, AnalysisResult } from '@/types/financial';
import { 
  saveSessionData, 
  getSessionData, 
  hasSessionData, 
  clearSessionData, 
  updateSessionStep, 
  updateSessionData 
} from '@/utils/session-storage';

export function useQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FinancialData>>({});
  const [sessionRestored, setSessionRestored] = useState(false);

  // Load session data on component mount
  useEffect(() => {
    const sessionData = getSessionData();
    if (sessionData) {
      setFormData(sessionData.questionnaireData);
      setCurrentStep(sessionData.currentStep);
      setSessionRestored(true);
      console.log('Session restored:', { step: sessionData.currentStep, dataKeys: Object.keys(sessionData.questionnaireData) });
    }
  }, []);

  const submitQuestionnaire = useMutation({
    mutationFn: async (data: FinancialData): Promise<AnalysisResult> => {
      // Ensure all required fields have default values
      const sanitizedData = {
        // Personal Information - using any to handle form field
        name: (data as any).name || "",
        
        // Salary & Income
        monthly_income: data.monthly_income || 0,
        side_income: data.side_income || "No",
        side_income_amount: data.side_income_amount || 0,
        bonus_pay: data.bonus_pay || "No",
        
        // Living Situation & Rent
        housing_status: data.housing_status || "Rent",
        housing_expenses: data.housing_expenses || 0,
        utility_bills: data.utility_bills || 0,
        household_size: Math.max(1, data.household_size || 1),
        
        // Food & Dining
        groceries_weekly: data.groceries_weekly || 0,
        dining_monthly: data.dining_monthly || 0,
        food_ordering: data.food_ordering || "Rarely",
        
        // Shopping Habits
        shopping_monthly: data.shopping_monthly || 0,
        impulse_shopping: data.impulse_shopping || 1,
        online_shopping: data.online_shopping || "Rarely",
        
        // Subscriptions & Entertainment
        subscriptions: data.subscriptions || [],
        subscription_cost: data.subscription_cost || 0,
        entertainment_hours: data.entertainment_hours || 0,
        
        // Travel & Transportation
        commute_cost: data.commute_cost || 0,
        transport_mode: data.transport_mode || "Public Transport",
        transport_monthly: data.transport_monthly || 0,
        
        // Debt / Loans
        has_loans: data.has_loans || "No",
        loan_repayment: data.loan_repayment || 0,
        loan_type: data.loan_type || "Personal",
        
        // Investments & Financial Goals
        investment_types: data.investment_types || [],
        monthly_investment: data.monthly_investment || 0,
        financial_goals: data.financial_goals || [{
          description: "Emergency Fund",
          target_amount: 500000,
          timeline_months: 24,
          priority: "high",
          category: "emergency"
        }],
        
        // Budgeting Behavior & Mindset
        track_spending: data.track_spending || "No",
        impulse_control: data.impulse_control || 1,
        saving_behavior: data.saving_behavior || 1,
        risk_taking: data.risk_taking || "Low",
        
        // Commitment & Willingness
        expense_reduction: data.expense_reduction || 1,
        preferred_savings: data.preferred_savings || 0,
        financial_discipline: data.financial_discipline || 1
      };

      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit questionnaire');
      }
      
      return response.json();
    },
  });

  const updateFormData = (stepData: Partial<FinancialData>) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    // Save to localStorage automatically
    updateSessionData(newFormData);
    console.log('Form data updated and saved:', Object.keys(stepData));
  };

  const nextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    
    // Save step progress to localStorage
    updateSessionStep(newStep);
    console.log('Advanced to step:', newStep);
  };

  const prevStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    
    // Save step progress to localStorage
    updateSessionStep(newStep);
    console.log('Moved back to step:', newStep);
  };

  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setFormData({});
    setSessionRestored(false);
    clearSessionData();
    submitQuestionnaire.reset();
    console.log('Questionnaire reset and session cleared');
  };

  const loadFormDataFromSession = (sessionData: Partial<FinancialData>) => {
    setFormData(prev => ({ ...prev, ...sessionData }));
  };

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    resetQuestionnaire,
    submitQuestionnaire,
    isSubmitting: submitQuestionnaire.isPending,
    analysisResult: submitQuestionnaire.data,
    error: submitQuestionnaire.error,
    sessionRestored,
    hasSession: hasSessionData,
  };
}
