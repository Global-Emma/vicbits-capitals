"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axios";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gem,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

type SignInUserData = {
  email: string;
  rememberMe: boolean;
  loggedInAt: string;
};

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: SignInUserData) => void;
  onSwitchToSignUp?: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToSignUp,
}: SignInModalProps) {
  // Modal Navigation View: 'login' | 'forgot_password' | 'success'
  const [view, setView] = useState<"login" | "forgot_password" | "success">("login");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 

  // Forgot Password State
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data.success) {
        const { accessToken, user: userData } = response.data;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("login", "true");

        setView("success");

        if (onSuccess) {
          onSuccess({
            email: userData?.email || email,
            rememberMe,
            loggedInAt: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid email or password. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await api.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setResetEmailSent(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Success State
  const triggerSuccess = () => {
    setView("success");
    if (onSuccess) {
      onSuccess({
        email,
        rememberMe,
        loggedInAt: new Date().toISOString(),
      });
    }
  };

  // Reset Form Modal State on Close
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView("login");
      setEmail("");
      setPassword("");
      setErrorMessage("");
      setResetEmailSent(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#081528] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl my-8 overflow-hidden text-slate-100 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors z-20 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-6">
              <Gem className="w-6 h-6 text-[#F3B233]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3B233]">
                VicBits Capitals Vault
              </span>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* VIEW 1: STANDARD LOGIN */}
            {view === "login" && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4 text-xs"
              >
                <div className="text-left space-y-1">
                  <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
                  <p className="text-slate-400">
                    Sign in to access your investment portfolio.
                  </p>
                </div>

                {/* Email Input */}
                <div className="pt-2">
                  <label className="text-slate-300 font-semibold mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="investor@vicbitscapitals.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-300 font-semibold block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot_password")}
                      className="text-[#F3B233] hover:underline text-[11px] font-medium cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-[#F3B233] focus:ring-[#F3B233]"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Vault</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Switch to Sign Up */}
                <div className="text-center pt-4 border-t border-slate-800/80 text-slate-400">
                  <span>{"Don't have an investor account?"} </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      if (onSwitchToSignUp) onSwitchToSignUp();
                    }}
                    className="text-[#F3B233] font-bold hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </motion.form>
            )}

          
            {/* VIEW 3: FORGOT PASSWORD */}
            {view === "forgot_password" && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1 text-left">
                  <div className="w-10 h-10 bg-[#F3B233]/10 border border-[#F3B233]/30 rounded-xl flex items-center justify-center mb-3 text-[#F3B233]">
                    <KeyRound size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Reset Password</h3>
                  <p className="text-slate-400">
                    {"Enter your email address and we'll send you a link to reset your account password."}
                  </p>
                </div>

                {!resetEmailSent ? (
                  <>
                    <div className="pt-2">
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@vicbitscapitals.com"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setView("login")}
                        className="w-1/3 py-3 rounded-xl font-semibold text-slate-300 border border-slate-800 hover:bg-slate-900 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-2/3 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Sending Link...</span>
                          </>
                        ) : (
                          <span>Send Reset Link</span>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-4 space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
                      Reset link successfully dispatched to{" "}
                      <span className="font-bold text-white">{email}</span>. Please check your inbox and spam folder.
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setResetEmailSent(false);
                        setView("login");
                      }}
                      className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422]"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}
              </motion.form>
            )}

            {/* VIEW 4: SUCCESS STATE */}
            {view === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-6 text-center space-y-5 text-xs"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">
                    Authenticated!
                  </h3>
                  <p className="text-slate-300">
                    Welcome back to VicBits Capitals. Redirecting to your vault...
                  </p>
                </div>

                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Account Email</span>
                    <span className="text-slate-200 font-mono">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Status</span>
                    <span className="text-emerald-400 font-semibold">Verified / Encrypted</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-xl shadow-[#F3B233]/25 hover:brightness-110 transition-all cursor-pointer"
                >
                  Enter Investor Dashboard
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}