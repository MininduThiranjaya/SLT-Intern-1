import { Eye, EyeOff, Mail, Lock, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react"
import React, { useState } from "react"
import axios from "axios"
import API from "../apis/apis"
import { useNavigate } from "react-router-dom"

export default function ForgetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSendVerificationCode = async () => {
    if (!email) { alert('Please enter your email address'); return; }
    setIsSendingCode(true);
    try {
      await axios.post(API.common.forget_password_send_mail, { email });
      setStep(2);
    } catch (error) {
      alert('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword || !confirmNewPassword) { alert('Please fill in all fields'); return; }
    if (newPassword !== confirmNewPassword) { alert('Passwords do not match!'); return; }
    setIsResettingPassword(true);
    try {
      await axios.post(API.common.forget_password_reset, { email, token: verificationCode, password: newPassword });
      alert('Password has been reset successfully!');
      navigate('/');
    } catch (error) {
      alert('Invalid code or failed to reset password. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  return (
    <div className="h-screen bg-[#161826] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-[#1c1f2e] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#007bff] to-[#0056d2] px-6 py-5 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-white/20 rounded-full mb-2">
              {step === 1 ? <Mail className="w-5 h-5 text-white" /> : <ShieldCheck className="w-5 h-5 text-white" />}
            </div>
            <h1 className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-urbanist)" }}>
              Reset Password
            </h1>
            <p className="text-blue-100 text-xs" style={{ fontFamily: "var(--font-urbanist)" }}>
              {step === 1 ? "Enter your email to receive a verification code" : "Enter the code and set your new password"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-100">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-[#007bff] text-white shadow-md shadow-blue-200' : 'bg-gray-200 text-gray-500'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-[#007bff]' : 'text-gray-400'}`} style={{ fontFamily: "var(--font-urbanist)" }}>
                    {s === 1 ? 'Email' : 'Reset'}
                  </span>
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 mx-3 rounded transition-all ${step > s ? 'bg-[#007bff]' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Card Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Step 1: Email */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendVerificationCode()}
                      className="w-full pl-12 pr-4 py-3 rounded-xl
                         bg-[#141624] border border-[#2a2d3e]
                         text-white placeholder-[#6b6f86]
                         focus:outline-none focus:ring-2 
                         focus:ring-yellow-400 focus:border-transparent
                         transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode}
                  className="w-full w-full px-4 py-2 rounded-xl font-semibold
                     bg-yellow-400 text-[#0d0f1a]
                     hover:bg-yellow-300
                     transition-all duration-200
                     shadow-[0_6px_20px_rgba(251,191,36,0.4)]
                     disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center"
                  style={{ fontFamily: "var(--font-urbanist)" }}
                >
                  {isSendingCode ? <span className="flex items-center justify-center gap-2"><Spinner /> Sending Code...</span> : "Send Verification Code"}
                </button>
              </>
            )}

            {/* Step 2: Code + Password */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    6-digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl
                         bg-[#141624] border border-[#2a2d3e]
                         text-white placeholder-[#6b6f86]
                         focus:outline-none focus:ring-2 
                         focus:ring-yellow-400 focus:border-transparent
                         transition"
                      placeholder="••••••"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1" style={{ fontFamily: "var(--font-urbanist)" }}>
                    <Mail className="w-3 h-3" /> Code sent to <span className="font-medium text-gray-700">{email}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl
                         bg-[#141624] border border-[#2a2d3e]
                         text-white placeholder-[#6b6f86]
                         focus:outline-none focus:ring-2 
                         focus:ring-yellow-400 focus:border-transparent
                         transition"
                      placeholder="Create new password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl
                         bg-[#141624] border border-[#2a2d3e]
                         text-white placeholder-[#6b6f86]
                         focus:outline-none focus:ring-2 
                         focus:ring-yellow-400 focus:border-transparent
                         transition"
                      placeholder="Confirm new password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>Passwords do not match</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-urbanist)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={isResettingPassword || verificationCode.length !== 6 || !newPassword || newPassword !== confirmNewPassword}
                    className="flex-grow bg-[#007bff] hover:bg-[#0056d2] text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-200 hover:shadow-blue-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-urbanist)" }}
                  >
                    {isResettingPassword ? <span className="flex items-center justify-center gap-2"><Spinner /> Resetting...</span> : "Reset Password"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Card Footer */}
          <div className="px-6 pb-5 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-sm text-[#007bff] hover:text-[#0056d2] font-medium transition-colors"
              style={{ fontFamily: "var(--font-urbanist)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-gray-500 mt-4" style={{ fontFamily: "var(--font-urbanist)" }}>
          Didn't receive a code? Check your spam folder.
        </p>
      </div>
    </div>
  );
}