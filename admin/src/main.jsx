import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import { Toaster } from "react-hot-toast";

// auth
import ProtectedRoute from './auth/ProtectedRoute';

// pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }/>
      </Routes>
    </Router>
  </StrictMode>
)
