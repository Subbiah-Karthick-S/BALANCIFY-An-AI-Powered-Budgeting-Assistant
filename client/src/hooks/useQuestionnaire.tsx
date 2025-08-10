import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FinancialData, AnalysisResult } from '@/types/financial';
import { useSession } from './useSession';

export function useQuestionnaire() {
  const { getSessionData, getCurrentStep, updateFormData: updateSessionFormData, hasActiveSession, createServerSession, completeSession } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FinancialData>>({});

  // Load session data on component mount
  useEffect(() => {
    if (hasActiveSession()) {
      const sessionData = getSessionData();
      const sessionStep = getCurrentStep();
      
      console.log('Loading session data on mount:', { sessionData, sessionStep });
      
      if (sessionData && Object.keys(sessionData).length > 0) {
        console.log('Setting form data from session:', sessionData);
        setFormData(sessionData);
      }
      if (sessionStep >= 0) {
        console.log('Setting current step from session:', sessionStep);
        setCurrentStep(sessionStep);
      }
    } else {
      console.log('No active session found on mount');
    }
  }, [hasActiveSession, getSessionData, getCurrentStep]);

  const submitQuestionnaire = useMutation({
    mutationFn: async (data: FinancialData): Promise<AnalysisResult> => {
      // First create server session with questionnaire data
      const sessionId = await createServerSession(data);
      
      // Mark local session as completed
      completeSession(sessionId);
      
      // Now analyze the financial data using the session ID
      const response = await fetch(`/api/analyze-session/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze financial data');
      }
      
      return response.json();
    },
  });

  const updateFormData = (stepData: Partial<FinancialData>) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    // Save to session automatically
    if (hasActiveSession()) {
      updateSessionFormData(newFormData, currentStep);
    }
  };

  const nextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    
    // Save step progress to session
    if (hasActiveSession()) {
      updateSessionFormData(formData, newStep);
    }
  };

  const prevStep = () => {
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    
    // Save step progress to session
    if (hasActiveSession()) {
      updateSessionFormData(formData, newStep);
    }
  };

  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setFormData({});
    submitQuestionnaire.reset();
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
    loadFormDataFromSession,
    submitQuestionnaire,
    isSubmitting: submitQuestionnaire.isPending,
    analysisResult: submitQuestionnaire.data,
    error: submitQuestionnaire.error,
  };
}
