import { useState, useEffect } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import HomePage from '@/pages/HomePage';
import { QuestionnairePage } from '@/pages/QuestionnairePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalysisResult } from '@/types/financial';
import { useSession } from '@/hooks/useSession';

type AppState = 'home' | 'questionnaire' | 'dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { session, hasActiveSession, hasCompletedQuestionnaire, updateSession } = useSession();

  // Check session state on app startup
  useEffect(() => {
    if (session) {
      if (hasCompletedQuestionnaire()) {
        // User has completed questionnaire and has results - show dashboard
        if (session.analysisResult) {
          setAnalysisResult(session.analysisResult);
          setCurrentState('dashboard');
        } else {
          // Has questionnaire data but no analysis result - go to questionnaire for re-analysis
          setCurrentState('questionnaire');
        }
      } else if (hasActiveSession()) {
        // User has active session but incomplete questionnaire - resume questionnaire
        setCurrentState('questionnaire');
      }
    }
  }, [session?.sessionId]);

  const handleStartMission = () => {
    setCurrentState('questionnaire');
  };

  const handleQuestionnaireComplete = (result: AnalysisResult) => {
    // Save analysis result to session
    if (session) {
      updateSession({ analysisResult: result });
    }
    setAnalysisResult(result);
    setCurrentState('dashboard');
  };

  const handleStartNew = () => {
    setAnalysisResult(null);
    setCurrentState('questionnaire'); // Go to questionnaire to maintain session
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  const renderCurrentPage = () => {
    switch (currentState) {
      case 'home':
        return <HomePage onStartMission={handleStartMission} />;
      case 'questionnaire':
        return <QuestionnairePage onComplete={handleQuestionnaireComplete} />;
      case 'dashboard':
        return analysisResult ? (
          <DashboardPage 
            analysisResult={analysisResult} 
            onStartNew={handleStartNew}
            onBackToHome={handleBackToHome}
          />
        ) : null;
      default:
        return <HomePage onStartMission={handleStartMission} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#0B0B1F] via-[#1A1A3A] to-[#2D1B69]">
          {renderCurrentPage()}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
