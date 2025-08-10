import { useState, useEffect } from 'react';

interface SessionData {
  sessionId: string;
  userName: string;
  startTime: Date;
  isActive: boolean;
  questionnaireCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  analysisResult?: any;
  formData?: any; // Store questionnaire progress
  questionnaireData?: any; // Store submitted questionnaire
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('balancify_session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      // Check if session is still valid (within 24 hours)
      const sessionAge = Date.now() - new Date(parsedSession.startTime).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxAge && parsedSession.isActive) {
        setSession({
          ...parsedSession,
          startTime: new Date(parsedSession.startTime)
        });
      } else {
        // Clear expired session
        localStorage.removeItem('balancify_session');
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('balancify_session', JSON.stringify(session));
    }
  }, [session]);

  const createSession = (userName: string, totalSteps: number = 8) => {
    // Always create a fresh session when called
    const newSession: SessionData = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userName,
      startTime: new Date(),
      isActive: true,
      questionnaireCompleted: false,
      currentStep: 0,
      totalSteps
    };
    setSession(newSession);
    return newSession;
  };

  const updateSession = (updates: Partial<SessionData>) => {
    if (session) {
      const updatedSession = { ...session, ...updates };
      setSession(updatedSession);
    }
  };

  const completeSession = () => {
    if (session) {
      updateSession({ 
        isActive: false,
        questionnaireCompleted: true 
      });
    }
  };

  const endSession = () => {
    localStorage.removeItem('balancify_session');
    setSession(null);
  };

  const hasActiveSession = () => {
    return session?.isActive;
  };

  const hasCompletedQuestionnaire = () => {
    return session?.questionnaireCompleted && session?.analysisResult;
  };

  const saveFormProgress = (stepData: any, currentStep: number) => {
    if (session) {
      const updatedFormData = { ...session.formData, ...stepData };
      updateSession({ 
        formData: updatedFormData, 
        currentStep: Math.max(currentStep, session.currentStep || 0)
      });
    }
  };

  const saveQuestionnaireData = (questionnaireData: any) => {
    if (session) {
      updateSession({ 
        questionnaireData,
        questionnaireCompleted: true 
      });
    }
  };

  const resetToQuestionnaire = () => {
    if (session) {
      updateSession({ 
        isActive: true,
        // Keep questionnaire data and form data but allow re-analysis
      });
    }
  };

  return {
    session,
    createSession,
    updateSession,
    completeSession,
    endSession,
    hasActiveSession,
    hasCompletedQuestionnaire,
    saveFormProgress,
    saveQuestionnaireData,
    resetToQuestionnaire
  };
}