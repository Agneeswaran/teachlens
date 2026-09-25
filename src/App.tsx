import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { BackendOfflineBanner } from './components/common/BackendOfflineBanner';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { WorkflowTimeline } from './components/landing/WorkflowTimeline';
import { FeatureCards } from './components/landing/FeatureCards';

// Student App Views
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ConceptMasteryGrid } from './components/mastery/ConceptMasteryGrid';
import { GapAnalysisView } from './components/gapAnalysis/GapAnalysisView';
import { PrerequisiteGraph } from './components/graph/PrerequisiteGraph';
import { RecoveryPlanView } from './components/recovery/RecoveryPlanView';
import { AdaptiveQuizView } from './components/quiz/AdaptiveQuizView';
import { ReassessmentComparison } from './components/reassessment/ReassessmentComparison';
import { LearningHistoryTimeline } from './components/history/LearningHistoryTimeline';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { PeerSquadsView } from './components/squads/PeerSquadsView';
import { ComebackLeaderboardView } from './components/leaderboard/ComebackLeaderboardView';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherPendingView } from './components/teacher/TeacherPendingView';
import { EarlyWarningSignals } from './components/teacher/EarlyWarningSignals';

// Admin Views
import { AdminTeacherVerification } from './components/admin/AdminTeacherVerification';

export const AppContent: React.FC = () => {
  const {
    currentTab,
    isLoggedIn,
    isBackendUnavailable,
    retryBackendHealth,
    teacherStatus,
    openAuthModal
  } = useApp();

  const renderCurrentView = () => {
    // If not logged in and not on landing page, redirect to landing with auth prompt
    if (!isLoggedIn && currentTab !== 'landing') {
      return (
        <div className="space-y-0">
          <HeroSection />
          <WorkflowTimeline />
          <FeatureCards />
        </div>
      );
    }

    switch (currentTab) {
      case 'landing':
        return (
          <div className="space-y-0">
            <HeroSection />
            <WorkflowTimeline />
            <FeatureCards />
          </div>
        );
      case 'dashboard':
        return <StudentDashboard />;
      case 'mastery':
        return <ConceptMasteryGrid />;
      case 'gap-analysis':
        return <GapAnalysisView />;
      case 'prerequisites':
        return <PrerequisiteGraph />;
      case 'recovery':
        return <RecoveryPlanView />;
      case 'quiz':
        return <AdaptiveQuizView />;
      case 'reassessment':
        return <ReassessmentComparison />;
      case 'history':
        return <LearningHistoryTimeline />;
      case 'profile':
        return <StudentProfileView />;
      case 'squads':
        return <PeerSquadsView />;
      case 'leaderboard':
        return <ComebackLeaderboardView />;
      case 'teacher':
        if (teacherStatus === 'PENDING' || teacherStatus === 'REJECTED' || teacherStatus === 'SUSPENDED') {
          return <TeacherPendingView />;
        }
        return <TeacherDashboard />;
      case 'teacher-pending':
        return <TeacherPendingView />;
      case 'early-warnings':
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <EarlyWarningSignals />
          </div>
        );
      case 'admin-teachers':
        return <AdminTeacherVerification />;
      default:
        return <StudentDashboard />;
    }
  };

  const isLanding = currentTab === 'landing' || !isLoggedIn;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Backend Unavailable Warning Banner */}
      {isBackendUnavailable && (
        <BackendOfflineBanner onRetry={retryBackendHealth} />
      )}

      {/* Sticky Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className={`flex-1 ${isLanding ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full'}`}>
        {renderCurrentView()}
      </main>

      {/* Global Modals & Drawers */}
      <NotificationsDrawer />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
