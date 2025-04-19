import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Files from './pages/Files';
import OtherActivities from './pages/OtherActivities';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeStyles from './components/ThemeCustomizer/ThemeStyles';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <ThemeStyles />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/files" element={<Files />} />
                <Route path="/other-activities" element={<OtherActivities />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;