import { FinancialData } from '@/types/financial';

const SESSION_KEY = 'balancifySession';
const SESSION_EXPIRY_HOURS = 24;

interface SessionData {
  questionnaireData: Partial<FinancialData>;
  currentStep: number;
  timestamp: number;
  userName?: string;
}

export function saveSessionData(
  questionnaireData: Partial<FinancialData>, 
  currentStep: number,
  userName?: string
): void {
  try {
    const sessionData: SessionData = {
      questionnaireData,
      currentStep,
      timestamp: Date.now(),
      userName
    };
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.warn('Failed to save session data:', error);
  }
}

export function getSessionData(): SessionData | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    const sessionData: SessionData = JSON.parse(sessionStr);
    
    // Check if session has expired
    const hoursElapsed = (Date.now() - sessionData.timestamp) / (1000 * 60 * 60);
    if (hoursElapsed > SESSION_EXPIRY_HOURS) {
      clearSessionData();
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.warn('Failed to load session data:', error);
    clearSessionData();
    return null;
  }
}

export function hasSessionData(): boolean {
  return getSessionData() !== null;
}

export function clearSessionData(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear session data:', error);
  }
}

export function updateSessionStep(newStep: number): void {
  const sessionData = getSessionData();
  if (sessionData) {
    saveSessionData(sessionData.questionnaireData, newStep, sessionData.userName);
  }
}

export function updateSessionData(newData: Partial<FinancialData>): void {
  const sessionData = getSessionData();
  const currentStep = sessionData?.currentStep || 0;
  const userName = sessionData?.userName || (newData as any).name;
  
  const updatedData = { ...sessionData?.questionnaireData, ...newData };
  saveSessionData(updatedData, currentStep, userName);
}