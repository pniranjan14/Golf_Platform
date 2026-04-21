import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from './components/ui/Toaster'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Pages
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DashboardPage from './pages/Dashboard'
import AdminPage from './pages/Admin'
import CharitiesPage from './pages/Charities'
import PricingPage from './pages/Pricing'
import ResultsPage from './pages/Results'

const App: React.FC = () => {
  const location = useLocation();

  return (
    <Layout>
      <Toaster />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/charities" element={<CharitiesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="py-20 text-center text-[#4a4870]">Page Not Found</div>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
