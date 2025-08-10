import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FinancialData, AnalysisResult } from '@/types/financial';

export function useQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FinancialData>>({});

  const submitQuestionnaire = useMutation({
    mutationFn: async (data: FinancialData): Promise<AnalysisResult> => {
      const response = await apiRequest('POST', '/api/questionnaire', data);
      return response.json();
    },
  });

  const updateFormData = (stepData: Partial<FinancialData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const resetQuestionnaire = () => {
    setCurrentStep(0);
    setFormData({});
    submitQuestionnaire.reset();
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
  };
}
