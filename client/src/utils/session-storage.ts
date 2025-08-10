import { FinancialData } from '@/types/financial';

export interface SessionData {
  sessionId?: string;
  formData: Partial<FinancialData>;
  currentStep: number;
  startTime: Date;
  lastUpdated: Date;
  userName?: string;
  isCompleted: boolean;
}

const STORAGE_KEY = 'balancifySession';

export const sessionStorage = {
  // Save questionnaire data to localStorage
  saveSessionData(data: Partial<SessionData>): void {
    try {
      const existing = this.getSessionData();
      const updatedData: SessionData = {
        ...existing,
        ...data,
        lastUpdated: new Date(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  },

  // Retrieve session data from localStorage
  getSessionData(): SessionData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
        lastUpdated: new Date(parsed.lastUpdated),
      };
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  },

  // Remove session data
  clearSessionData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  },

  // Check if session exists
  hasSessionData(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  // Initialize new session
  initializeSession(userName: string): SessionData {
    const newSession: SessionData = {
      formData: {},
      currentStep: 0,
      startTime: new Date(),
      lastUpdated: new Date(),
      userName,
      isCompleted: false,
    };
    
    this.saveSessionData(newSession);
    return newSession;
  },

  // Update form data incrementally
  updateFormData(formData: Partial<FinancialData>, currentStep: number): void {
    const existing = this.getSessionData();
    if (existing) {
      this.saveSessionData({
        formData: { ...existing.formData, ...formData },
        currentStep,
      });
    }
  },

  // Mark session as completed
  completeSession(sessionId: string): void {
    this.saveSessionData({
      sessionId,
      isCompleted: true,
    });
  },

  // Check if session is valid (not expired)
  isSessionValid(): boolean {
    const session = this.getSessionData();
    if (!session) return false;
    
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const sessionAge = Date.now() - session.startTime.getTime();
    
    return sessionAge < maxAge;
  },
};