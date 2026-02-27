import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css'

// auth
import ProtectedRoute from './auth/ProtectedRoute';

// pages
import LoginPage from './page/LoginPage';
import DashboardPage from './page/DashboardPage';
import RegistrationPage from './page/RegistrationPage';
import ForgetPasswordPage from './page/ForgetPasswordPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/reg' element={<RegistrationPage/>}/>
        <Route path='/forget-password' element={<ForgetPasswordPage/>}/>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }/>
      </Routes>
    </Router>
  </StrictMode>
)
