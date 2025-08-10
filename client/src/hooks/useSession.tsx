import { useState, useEffect } from 'react';
import { sessionStorage, SessionData } from '@/utils/session-storage';
import { FinancialData } from '@/types/financial';

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = sessionStorage.getSessionData();
    if (savedSession && sessionStorage.isSessionValid()) {
      setSession(savedSession);
    } else if (savedSession) {
      // Clear expired session
      sessionStorage.clearSessionData();
    }
  }, []);

  const createSession = (userName: string) => {
    // Clear any existing session and create fresh one
    sessionStorage.clearSessionData();
    const newSession = sessionStorage.initializeSession(userName);
    setSession(newSession);
    return newSession;
  };

  const updateFormData = (formData: Partial<FinancialData>, currentStep: number) => {
    sessionStorage.updateFormData(formData, currentStep);
    const updatedSession = sessionStorage.getSessionData();
    if (updatedSession) {
      setSession(updatedSession);
    }
  };

  const completeSession = (sessionId: string) => {
    sessionStorage.completeSession(sessionId);
    const updatedSession = sessionStorage.getSessionData();
    if (updatedSession) {
      setSession(updatedSession);
    }
  };

  const endSession = () => {
    sessionStorage.clearSessionData();
    setSession(null);
  };

  const hasActiveSession = () => {
    const sessionData = sessionStorage.getSessionData();
    return sessionData && !sessionData.isCompleted && sessionStorage.isSessionValid();
  };

  const getSessionData = () => {
    // Get data directly from localStorage to ensure we have the latest
    const sessionData = sessionStorage.getSessionData();
    return sessionData?.formData || {};
  };

  const getCurrentStep = () => {
    // Get step directly from localStorage to ensure we have the latest
    const sessionData = sessionStorage.getSessionData();
    return sessionData?.currentStep || 0;
  };

  // Create server session when questionnaire is completed
  const createServerSession = async (formData: FinancialData): Promise<string> => {
    const response = await fetch('/api/financial-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to create server session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  };

  return {
    session,
    createSession,
    updateFormData,
    completeSession,
    endSession,
    hasActiveSession,
    getSessionData,
    getCurrentStep,
    createServerSession
  };
}