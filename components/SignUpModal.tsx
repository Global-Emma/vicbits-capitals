"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/axios";
import {
  ShieldCheck,
  Gem,
  ArrowRight,
  ArrowLeft,
  X,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Globe,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Check,
} from "lucide-react";

type SignUpSuccessPayload = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    country: string;
  };
  verification: {
    otpCode: string;
    isVerified: boolean;
  };
  addressAndKYC: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    investorType: string;
    targetCapital: string;
  };
  securityAndTerms: {
    password: string;
    referralCode: string | null;
    acceptedTerms: boolean;
  };
  submittedAt: string;
};

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (payload: SignUpSuccessPayload) => void | Promise<void>;
}

// Slide Animation Variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 250 : -250,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 250 : -250,
    opacity: 0,
  }),
};

export default function SignUpModal({ isOpen, onClose, onSuccess }: SignUpModalProps) {
  // Wizard & animation state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    country: "United States",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    investorType: "Individual Investor",
    targetCapital: "$1,000 - $10,000",
    password: "",
    confirmPassword: "",
    referralCode: "",
    acceptedTerms: false,
  });

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // OTP Input Handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`modal-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Timer Countdown for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && step === 2 && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, resendTimer]);

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      await api.post("/api/auth/send-otp", {
        email: formData.email.trim().toLowerCase(),
      });
      setResendTimer(60);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Unable to resend the verification code right now.");
    } finally {
      setIsResending(false);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const compiledData = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        country: formData.country,
      },
      verification: {
        otpCode: otp.join(""),
        isVerified: true,
      },
      addressAndKYC: {
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        investorType: formData.investorType,
        targetCapital: formData.targetCapital,
      },
      securityAndTerms: {
        password: formData.password,
        referralCode: formData.referralCode || null,
        acceptedTerms: formData.acceptedTerms,
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await api.post("/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        dob: formData.dob,
        country: formData.country,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        investorType: formData.investorType,
        targetCapital: formData.targetCapital,
        password: formData.password,
        referralCode: formData.referralCode || "",
        acceptedTerms: formData.acceptedTerms,
      });

      if (response.data.success) {
        const { accessToken, user: userData } = response.data;
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("login", "true");

        if (onSuccess) {
          await onSuccess({
            ...compiledData,
            personalInfo: {
              ...compiledData.personalInfo,
              email: userData?.email || compiledData.personalInfo.email,
            },
          } as SignUpSuccessPayload);
        }
      }

      nextStep();
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error?.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setOtp(["", "", "", "", "", ""]);
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
            className="bg-[#081528] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl my-8 overflow-hidden text-slate-100 font-sans"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Step Progress Header */}
            {step <= 4 && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <Gem className="w-6 h-6 text-[#F3B233]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F3B233]">
                    VicBits Investor Onboarding
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-medium mb-2">
                    <span>
                      Step {step} of 4:{" "}
                      {step === 1 && "Personal Info"}
                      {step === 2 && "Verification"}
                      {step === 3 && "Investor Profile"}
                      {step === 4 && "Security"}
                    </span>
                    <span>{step * 25}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#F3B233] to-[#E5A422] h-full rounded-full"
                      initial={{ width: `${(step - 1) * 25}%` }}
                      animate={{ width: `${step * 25}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Step Animated Content */}
            <div className="relative overflow-hidden min-h-[380px]">
              <AnimatePresence custom={direction} mode="wait">
                {/* STEP 1: PERSONAL INFORMATION */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onSubmit={async (e) => {
                      e.preventDefault();

                      try {
                        await api.post("/api/auth/send-otp", {
                          email: formData.email.trim().toLowerCase(),
                        });
                        nextStep();
                      } catch (error: any) {
                        alert(error?.response?.data?.message || "Unable to send the verification code. Please try again.");
                      }
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="text-left space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        Personal Information
                      </h3>
                      <p className="text-slate-400">
                        Please enter your legal name and contact details.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Alex"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Morgan"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="alex.morgan@example.com"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Country of Residence *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        >
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Germany">Germany</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Continue to Verification</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 2: CODE VERIFICATION (OTP) */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 text-xs text-center"
                  >
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-[#F3B233]/10 border border-[#F3B233]/30 rounded-full flex items-center justify-center mx-auto text-[#F3B233]">
                        <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Verify Email Address
                      </h3>
                      <p className="text-slate-400 max-w-xs mx-auto">
                        We sent a 6-digit verification code to{" "}
                        <span className="text-slate-200 font-semibold">
                          {formData.email || "your email address"}
                        </span>
                      </p>
                    </div>

                    {/* 6 Digit OTP Inputs */}
                    <div className="flex justify-center gap-2 py-4">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`modal-otp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !digit && idx > 0) {
                              document.getElementById(`modal-otp-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-950 border border-slate-800 text-[#F3B233] focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <span>{"Didn't receive code?"}</span>
                      {resendTimer > 0 ? (
                        <span className="text-slate-500 font-medium">
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="text-[#F3B233] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isResending && <RefreshCw size={12} className="animate-spin" />}
                          <span>Resend Code</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const code = otp.join("");

                          if (code.length !== 6) {
                            alert("Please enter all 6 digits of your verification code.");
                            return;
                          }

                          try {
                            await api.post("/api/auth/verify-otp", {
                              email: formData.email.trim().toLowerCase(),
                              otp: code,
                            });
                            nextStep();
                          } catch (error: any) {
                            alert(error?.response?.data?.message || "The verification code is invalid or expired.");
                          }
                        }}
                        className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Verify & Proceed</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: ADDRESS & INVESTOR PROFILE */}
                {step === 3 && (
                  <motion.form
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="text-left space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        Address & Investor Profile
                      </h3>
                      <p className="text-slate-400">
                        Required for regulatory compliance and portfolio customization.
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Street Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          name="streetAddress"
                          required
                          value={formData.streetAddress}
                          onChange={handleInputChange}
                          placeholder="742 Evergreen Terrace"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Springfield"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="IL"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="62701"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Investor Entity Type
                        </label>
                        <select
                          name="investorType"
                          value={formData.investorType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        >
                          <option value="Individual Investor">Individual Investor</option>
                          <option value="Corporate Entity">Corporate Entity</option>
                          <option value="Trust / Family Office">Trust / Family Office</option>
                          <option value="Accredited Investor">Accredited Investor</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold mb-1 block">
                          Target Initial Capital
                        </label>
                        <select
                          name="targetCapital"
                          value={formData.targetCapital}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        >
                          <option value="$1,000 - $10,000">$500 - $1,000</option>
                          <option value="$1,000 - $10,000">$1,000 - $10,000</option>
                          <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                          <option value="$50,000 - $250,000">$50,000 - $250,000</option>
                          <option value="$250,000+">$250,000+ (VIP Tier)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Next: Security</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 4: PASSWORD & AGREEMENT */}
                {step === 4 && (
                  <motion.form
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onSubmit={handleFinalSubmit}
                    className="space-y-4 text-xs"
                  >
                    <div className="text-left space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        Account Security & Terms
                      </h3>
                      <p className="text-slate-400">
                        Create a strong password to protect your investment vault.
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
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

                      {formData.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((level) => {
                              const score = getPasswordStrength(formData.password);
                              return (
                                <div
                                  key={level}
                                  className={`h-full flex-1 rounded-full ${
                                    level <= score
                                      ? score >= 3
                                        ? "bg-emerald-500"
                                        : score === 2
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                      : "bg-slate-800"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Strength:{" "}
                            {getPasswordStrength(formData.password) >= 3
                              ? "Strong"
                              : getPasswordStrength(formData.password) === 2
                              ? "Medium"
                              : "Weak"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                        />
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-rose-400 text-[10px] mt-1">
                            Passwords do not match.
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">
                        Referral Code (Optional)
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleInputChange}
                        placeholder="e.g. VIC-8890"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:border-[#F3B233] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-start gap-2 cursor-pointer text-slate-400">
                        <input
                          type="checkbox"
                          name="acceptedTerms"
                          required
                          checked={formData.acceptedTerms}
                          onChange={handleInputChange}
                          className="mt-0.5 rounded border-slate-800 bg-slate-950 text-[#F3B233] focus:ring-[#F3B233]"
                        />
                        <span>
                          I agree to the{" "}
                          <a href="#" className="text-[#F3B233] underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-[#F3B233] underline">
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/3 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          formData.password !== formData.confirmPassword ||
                          !formData.acceptedTerms
                        }
                        className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Sign Up</span>
                            <Check size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 5: SUCCESS STATE */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                      <CheckCircle2 size={44} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">
                        Registration Complete!
                      </h3>
                      <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">
                        Welcome,{" "}
                        <span className="text-[#F3B233] font-bold">
                          {formData.firstName} {formData.lastName}
                        </span>
                        ! Your VicBits Capitals investor account has been provisioned.
                      </p>
                    </div>

                    <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-left text-xs space-y-2">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Investor Email</span>
                        <span className="text-slate-200 font-mono">{formData.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-500">Account Type</span>
                        <span className="text-[#F3B233] font-bold">{formData.investorType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Sparkles size={12} /> Active / Verified
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full py-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-xl shadow-[#F3B233]/25 hover:brightness-110 transition-all cursor-pointer"
                    >
                      Go to Investor Dashboard
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}