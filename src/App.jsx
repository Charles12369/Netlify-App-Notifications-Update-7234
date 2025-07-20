import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import WorkoutPage from './components/WorkoutPage';
import ProgressPage from './components/ProgressPage';
import SettingsPage from './components/SettingsPage';
import { WorkoutProvider } from './context/WorkoutContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

function App() {
  return (
    <NotificationProvider>
      <WorkoutProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workout" element={<WorkoutPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }
              }}
            />
          </div>
        </Router>
      </WorkoutProvider>
    </NotificationProvider>
  );
}

export default App;