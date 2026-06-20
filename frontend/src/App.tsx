import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landingpage';
import { useAuth } from './context/AuthContext';
import { lazy,Suspense } from 'react';

const Kanban = lazy(()=> import ('./pages/Kanban'));
const Analytics = lazy(()=> import ('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/kanban" element={user ? <Kanban /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
    </Suspense>
  );
}

export default App;