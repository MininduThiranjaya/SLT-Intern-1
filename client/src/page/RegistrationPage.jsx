import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, UserPlus } from "lucide-react"
import React, { useState } from "react"
import axios from "axios"
import API from "../apis/apis"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function RegistrationPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const [errors, setErrors] = useState({});

    const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: '' }));

    const validate = () => {
        const newErrors = {};
        if (!formData.userName.trim()) newErrors.userName = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        try {
            const tempFormData = {
                userName: formData.userName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                userRole: "passenger"
            }
            const res = await axios.post(API.common.reg, tempFormData);
            if(res.data.status){
                toast.success('Account created successfully!');
                navigate('/');
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const Spinner = () => (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );

    const inputClass = (hasError) =>
        `w-full pl-9 pr-4  bg-[#141624] border border-[#2a2d3e]
                         text-white placeholder-[#6b6f86] py-2.5 rounded-xl outline-none transition-all text-sm focus:ring-2 ${
        hasError
            ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
            : 'border-gray-200 focus:ring-yellow-400 focus:border-transparent transition'
    }`;

    return (
        <div className="h-screen bg-[#161826] flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md">

            {/* Card */}
            <div className="bg-[#1c1f2e] border border-[#2a2d3e] 
                    backdrop-blur-xl 
                     rounded-2xl shadow-2xl overflow-hidden">

            {/* Card Header */}
            <div className="bg-yellow-500 px-6 py-5 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 bg-white/20 rounded-full mb-2">
                    <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Create Account
                </h1>
                <p className="text-white text-xs" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Fill in your details to get started
                </p>
            </div>

            {/* Card Body */}
            <div className="px-6 py-5 space-y-3.5">

                {/* userName */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Username
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={(e) => { handleChange(e); clearError('userName'); }}
                        className={inputClass(!!errors.userName)}
                        style={{ fontFamily: "var(--font-urbanist)" }}
                        placeholder="johndoe"
                    />
                </div>
                    {errors.userName && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>{errors.userName}</p>}
                </div>

                {/* Email */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => { handleChange(e); clearError('email'); }}
                        className={inputClass(!!errors.email)}
                        style={{ fontFamily: "var(--font-urbanist)" }}
                        placeholder="you@example.com"
                    />
                </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>{errors.email}</p>}
                </div>

                {/* phoneNumber */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Phone Number
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => { handleChange(e); clearError('phoneNumber'); }}
                        className={inputClass(!!errors.phoneNumber)}
                        style={{ fontFamily: "var(--font-urbanist)" }}
                        placeholder="+1 234 567 8900"
                    />
                </div>
                    {errors.phoneNumber && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>{errors.phoneNumber}</p>}
                </div>

                {/* Password */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => { handleChange(e); clearError('password'); }}
                        className={`${inputClass(!!errors.password)} pr-10`}
                        style={{ fontFamily: "var(--font-urbanist)" }}
                        placeholder="Min. 8 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => { handleChange(e); clearError('confirmPassword'); }}
                        className={`${inputClass(!!errors.confirmPassword)} pr-10`}
                        style={{ fontFamily: "var(--font-urbanist)" }}
                        placeholder="Repeat your password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "var(--font-urbanist)" }}>{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <button
                    onClick={() => {handleSubmit()}}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-semibold
                     bg-yellow-400 text-[#0d0f1a]
                     hover:bg-yellow-300
                     transition-all duration-200
                     shadow-[0_6px_20px_rgba(251,191,36,0.4)]
                     disabled:opacity-70 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-urbanist)" }}
                >
                {isSubmitting ? (
                    <><Spinner /> Creating Account...</>
                ) : (
                    <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
                </button>
            </div>

            {/* Card Footer */}
            <div className="px-6 pb-5 text-center">
                <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-urbanist)" }}>
                    Already have an account?{" "}
                <button
                    onClick={() => navigate('/')}
                    className="text-[#007bff] hover:text-[#0056d2] font-semibold transition-colors"
                >
                    Sign In
                </button>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
}