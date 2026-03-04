import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Properties from './pages/Properties';
import Waitlist from './pages/Waitlist';
import Maintenance from './pages/Maintenance';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen bg-[#1F1F1F] text-white flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex bg-[#1F1F1F] min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
                    <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
                    <Route path="/waitlist" element={<ProtectedRoute><Waitlist /></ProtectedRoute>} />
                    <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
                    <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
                    <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
