import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LanguageProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AIDetection } from './pages/AIDetection';
import { CropHealth } from './pages/CropHealth';
import { FarmMap } from './pages/FarmMap';
import { RoverControl } from './pages/RoverControl';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { Reports } from './pages/Reports';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/detection"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AIDetection />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/crop-health"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CropHealth />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/farm-map"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FarmMap />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/rover-control"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoverControl />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/monitoring"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LiveMonitoring />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/history"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <History />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
