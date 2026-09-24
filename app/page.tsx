"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  TrendingUp,
  Headphones,
  Building2,
  Coins,
  Gem,
  Zap,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  Send,
  MessageSquare,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  DollarSign,
  Calculator as CalcIcon,
  ChevronDown,
  Check,
  Sparkles,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GoogleTranslate from "@/components/GoogleTranslate";
import SignUpModal from "@/components/SignUpModal";
import SignInModal from "@/components/SignInModal";

const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.12, ease: "easeOut" },
  }),
};

// Google Translate / Language Selector Simulator
// const LanguageSelector = () => {
//   const [open, setOpen] = useState(false);
//   const [lang, setLang] = useState("EN");

//   const languages = [
//     { code: "EN", name: "English", flag: "🇺🇸" },
//     { code: "DE", name: "Deutsch", flag: "🇩🇪" },
//     { code: "FR", name: "Français", flag: "🇫🇷" },
//     { code: "ES", name: "Español", flag: "🇪🇸" },
//     { code: "AE", name: "العربية", flag: "🇦🇪" },
//     { code: "ZH", name: "中文", flag: "🇨🇳" },
//   ];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-[#F3B233]/60 transition-all shadow-sm"
//       >
//         <Globe size={14} className="text-[#F3B233]" />
//         <span>{lang}</span>
//         <ChevronDown size={12} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#0A192F] border border-slate-700 shadow-2xl py-1 z-50 text-xs">
//           {languages.map((item) => (
//             <button
//               key={item.code}
//               onClick={() => {
//                 setLang(item.code);
//                 setOpen(false);
//               }}
//               className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
//             >
//               <span className="flex items-center gap-2">
//                 <span>{item.flag}</span>
//                 <span>{item.name}</span>
//               </span>
//               {lang === item.code && <Check size={12} className="text-[#F3B233]" />}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

type AssetKey = "real-estate" | "crypto" | "gold" | "energy";

type AssetRate = {
  name: string;
  daily: number;
  badge: string;
};

export default function VicbitsHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [selectedPlanForDeposit, setSelectedPlanForDeposit] = useState("Growth Wealth Plan");

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "Real Estate",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  //

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(10000);
  const [calcAsset, setCalcAsset] = useState<AssetKey>("crypto"); // 'real-estate', 'crypto', 'gold', 'energy'
  const [calcDuration, setCalcDuration] = useState(30); // days

  // FAQ State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Reviews Index State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Live Market Ticker Data State
  const [marketData, setMarketData] = useState([
    { symbol: "BTC/USD", name: "Bitcoin", price: 80502.50, change: "+3.42%", isUp: true },
    { symbol: "ETH/USD", name: "Ethereum", price: 2581.20, change: "+2.15%", isUp: true },
    { symbol: "XAU/USD", name: "Gold Fine Ounce", price: 4376.87, change: "+0.85%", isUp: true },
    { symbol: "REIT/US", name: "Prime Real Estate", price: 1420.10, change: "+1.92%", isUp: true },
    { symbol: "SOL/USD", name: "Solana", price: 215.60, change: "-0.45%", isUp: false },
    { symbol: "XAGE/US", name: "Green Energy Fund", price: 890.30, change: "+4.10%", isUp: true },
  ]);

  // Simulate slight price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) =>
        prev.map((item) => {
          const factor = (Math.random() - 0.48) * 0.002;
          const newPrice = +(item.price * (1 + factor)).toFixed(2);
          return {
            ...item,
            price: newPrice,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Yield calculation helpers
  const assetRates: Record<AssetKey, AssetRate> = {
    "real-estate": { name: "Real Estate REITs", daily: 0.018, badge: "Conservative & Safe" },
    crypto: { name: "Crypto High-Yield Staking", daily: 0.032, badge: "High Yield Growth" },
    gold: { name: "Physical Gold Reserve", daily: 0.012, badge: "Capital Preservation" },
    energy: { name: "Energy Infrastructure", daily: 0.024, badge: "Sustainable Income" },
  };

  const assetKeys = Object.keys(assetRates) as AssetKey[];

  const currentRate = assetRates[calcAsset].daily;
  const estimatedDailyEarnings = calcAmount * currentRate;
  const estimatedTotalProfit = estimatedDailyEarnings * calcDuration;
  const totalPayout = calcAmount + estimatedTotalProfit;
  const roiPercentage = ((estimatedTotalProfit / calcAmount) * 100).toFixed(1);

  // Form submit handler
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        fullName: "",
        email: "",
        phone: "",
        interest: "Real Estate",
        message: "",
      });
    }, 4000);
  };

  // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: "Marcus Thorne",
      title: "Real Estate Mogul & Private Investor",
      location: "London, UK",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      rating: 5,
      profit: "+$48,500 Earned",
      asset: "Real Estate & Gold Portfolio",
      verified: true,
      quote:
        "VicBits Capitals has fundamentally reshaped my passive revenue strategy. The fractional ownership in high-rise Dubai developments combined with gold reserves yields predictable returns every single day. Their automated payouts are seamless.",
    },
    {
      id: 2,
      name: "Dr. Aris Thorne-Vance",
      title: "Chief Investment Officer",
      location: "Zurich, Switzerland",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      rating: 5,
      profit: "+$112,000 Earned",
      asset: "VIP Institutional Plan",
      verified: true,
      quote:
        "In institutional wealth management, security and liquidity are non-negotiable. VicBits' multi-sig cold storage and bank-grade escrow protocols provide absolute peace of mind. The yield performance speaks for itself.",
    },
    {
      id: 3,
      name: "Sarah Jenkins, Esq.",
      title: "Corporate Legal Specialist",
      location: "Dubai, UAE",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      rating: 5,
      profit: "+$29,400 Earned",
      asset: "Crypto Growth Staking",
      verified: true,
      quote:
        "I was initially skeptical about crypto staking yields until I saw VicBits' transparent risk hedging strategy. The 24/7 dedicated wealth advisory team answered all my questions within minutes.",
    },
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How does VicBits Capitals guarantee consistent daily yield returns?",
      answer:
        "VicBits Capitals deploys a diversified multi-asset arbitrage engine. We combine institutional real estate rental income, high-frequency liquidity staking, algorithmic crypto trading, and physical gold collateralization. Our risk management algorithms automatically rebalance portfolios during volatile market conditions.",
    },
    {
      question: "What is the minimum deposit required to start investing?",
      answer:
        "You can begin investing with as little as $500 on our Starter Tier. For premium institutional tiers with custom asset allocation and dedicated portfolio managers, minimums start at $50,000.",
    },
    {
      question: "How fast are withdrawal requests processed?",
      answer:
        "Withdrawals are automated and processed instantly for crypto assets and within 1-2 business hours for fiat bank wire transfers. There are zero withdrawal fees for active plans.",
    },
    {
      question: "Is my invested principal capital insured and secure?",
      answer:
        "Yes. All investor principal balances are backed 1:1 with institutional physical asset reserves, and digital assets are secured in multi-signature cold storage vaults safeguarded by top-tier custodian protocols with $100M+ Lloyd's insurance coverage.",
    },
    {
      question: "Can I compound my daily profits into higher plans?",
      answer:
        "Absolutely. Our platform supports automatic daily compounding or instant manual re-investment into higher-yielding asset classes directly from your dashboard balance.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040C18] text-slate-100 font-sans antialiased selection:bg-[#F3B233] selection:text-slate-950 overflow-x-hidden">
      
      {}
      {/* NAVIGATION BAR */}
      <header className="top-0 z-50 backdrop-blur-xl bg-[#040C18]/85 border-b border-slate-800/80 transition-all fixed w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="VicBits_Logo" 
                width={150} 
                height={150} 
              />
            </Link>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs xl:text-sm font-semibold text-slate-300">
            <a href="#home" className="hover:text-[#F3B233] transition-colors py-2">Home</a>
            <a href="#investments" className="hover:text-[#F3B233] transition-colors py-2">Assets</a>
            <a href="#calculator" className="hover:text-[#F3B233] transition-colors py-2">Calculator</a>
            <a href="#plans" className="hover:text-[#F3B233] transition-colors py-2">Plans</a>
            <a href="#how-it-works" className="hover:text-[#F3B233] transition-colors py-2">How It Works</a>
            <a href="#reviews" className="hover:text-[#F3B233] transition-colors py-2">Reviews</a>
            <a href="#contact" className="hover:text-[#F3B233] transition-colors py-2">Contact</a>
            <a href="#faq" className="hover:text-[#F3B233] transition-colors py-2">FAQ</a>
          </nav>

          {/* Action Buttons & Language Selector */}
          <div className="hidden md:flex items-center space-x-3.5">
            <GoogleTranslate />
            <button
              onClick={() => setSignInModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              Log In
            </button>
            <button
              onClick={() => setSignUpModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] hover:brightness-110 shadow-lg shadow-[#F3B233]/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <GoogleTranslate />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b border-slate-800 bg-[#061224] px-6 py-6 space-y-4 shadow-2xl overflow-hidden"
            >
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#home"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                Home
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#investments"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                Investments & Assets
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#calculator"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                ROI Yield Calculator
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#plans"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                Investment Plans
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#how-it-works"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                How It Works
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#reviews"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                Investor Reviews
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#contact"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                Contact & Support
              </a>
              <a
                onClick={() => setMobileMenuOpen(false)}
                href="#faq"
                className="block text-sm font-medium text-slate-300 hover:text-[#F3B233] py-1.5"
              >
                FAQ
              </a>

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-slate-200 border border-slate-700 bg-slate-900"
                >
                  Log In To Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSignUpModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20"
                >
                  Create Free Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {}
      {/* LIVE MARKET TICKER BAR */}
      <div className="bg-[#030811] border-b border-slate-800/80 py-2.5 overflow-hidden fixed w-full mt-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-[#F3B233]/15 text-[#F3B233] px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] shrink-0 border border-[#F3B233]/30">
            <span className="w-2 h-2 rounded-full bg-[#F3B233] animate-ping" />
            Live Market Yields
          </div>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300 py-0.5">
            {marketData.map((coin, idx) => (
              <div key={idx} className="flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-200">{coin.symbol}</span>
                <span className="text-white font-bold">${coin.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <span className={`text-[11px] font-bold ${coin.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {coin.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 mt-30">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#F3B233]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#F3B233] uppercase bg-[#F3B233]/10 px-4 py-2 rounded-full border border-[#F3B233]/30 shadow-inner">
                <Sparkles size={16} />
                <span>Premier Global Investment Platform &bull; Est. 2019</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Architecting Private Wealth <br className="hidden sm:inline" />
                Through{" "}
                <span className="bg-linear-to-r from-[#F3B233] via-[#f8d58c] to-[#E5A422] bg-clip-text text-transparent">
                  Multi-Asset Real Returns
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Unlock high-yield fractional Real Estate, institutional Crypto staking, physical Gold reserves, and Green Energy infrastructure with guaranteed daily profits and automated instant liquidity.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="px-8 py-4 rounded-xl font-bold text-slate-950 bg-linear-to-r from-[#F3B233] via-[#f5c35b] to-[#E5A422] hover:brightness-110 shadow-xl shadow-[#F3B233]/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 text-base"
                >
                  <TrendingUp size={20} />
                  <span>Start Investing Now</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setConsultationModalOpen(true)}
                  className="px-7 py-4 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-3 text-base shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F3B233]/20 flex items-center justify-center text-[#F3B233]">
                    <Play size={14} className="fill-[#F3B233] ml-0.5" />
                  </div>
                  <span>Book Advisory Session</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
                <div className="space-y-0.5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">$42M+</p>
                  <p className="text-xs text-slate-400 font-medium">Assets Under Management</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#F3B233] tracking-tight">18.4%</p>
                  <p className="text-xs text-slate-400 font-medium">Average Annualized Yield</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">14,200+</p>
                  <p className="text-xs text-slate-400 font-medium">Verified Active Investors</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual Graphic Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl bg-linear-to-b from-slate-800/60 via-slate-900/90 to-[#0A192F] p-4 sm:p-5 border border-slate-700/60 shadow-2xl">
                
                {/* Visual Header Banner */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden group">
                  <div
                    aria-label="Luxury Real Estate Property"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80')",
                    }}
                    className="bg-cover bg-center w-full h-full brightness-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0A192F] via-transparent to-transparent opacity-90" />
                  {/* Floating Live Badge */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dubai Prime Villa Vault #04</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-emerald-400 font-bold text-xs flex items-center gap-1 shadow-lg">
                    <TrendingUp size={14} />
                    <span>+24.8% Projected ROI</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs text-[#F3B233] font-semibold uppercase tracking-wider">Featured Vault Asset</p>
                    <h3 className="text-lg font-bold">Downtown Dubai Fractional Penthouse</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Rental Yield Distributed Daily in USDT / Gold</p>
                  </div>
                </div>

                {/* Micro Yield Performance Metric Card */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Vault Allocation Status</span>
                    <span className="text-emerald-400 font-bold">88% Funded</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-linear-to-r from-[#F3B233] to-emerald-400 h-full w-[88%] rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300">Min. Entry: <strong className="text-white">$1,000</strong></span>
                    <span className="text-slate-300">Daily Payout: <strong className="text-[#F3B233]">2.4% / Day</strong></span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {}
      {/* FEATURES STRIP */}
      <section className="py-12 bg-[#061224] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#F3B233]" />,
                title: "Bank-Grade Encryption",
                desc: "256-bit SSL & multi-signature asset storage backed by cold vaults.",
              },
              {
                icon: <Layers className="w-6 h-6 text-[#F3B233]" />,
                title: "Diversified Asset Engine",
                desc: "Real Estate, Gold, Crypto Staking & Green Energy in one portal.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-[#F3B233]" />,
                title: "Instant Daily Returns",
                desc: "Watch earnings credit directly to your wallet every 24 hours.",
              },
              {
                icon: <Headphones className="w-6 h-6 text-[#F3B233]" />,
                title: "24/7 Private Advisory",
                desc: "Dedicated wealth managers available for personalized support.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#F3B233]/40 transition-colors"
              >
                <div className="p-3 rounded-xl bg-[#F3B233]/10 border border-[#F3B233]/20 shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      {/* ASSET OPPORTUNITIES SECTION */}
      <section id="investments" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
              Curated Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Elite Asset Classes Designed for Maximum Yield
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Choose from institutional-grade investment portfolios tailored for wealth preservation, high ROI, and market cycle resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            
            {/* Real Estate */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#F3B233]/50 p-6 flex flex-col justify-between relative shadow-xl overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3B233]/15 border border-[#F3B233]/30 flex items-center justify-center text-[#F3B233]">
                  <Building2 size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Up to 1.8% Daily Yield
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">Real Estate REITs</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Fractional investment in luxury commercial, residential, and hotel developments across Dubai, London, and Miami.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Physical property asset backed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Quarterly equity appreciation</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Real Estate REIT");
                  setDepositModalOpen(true);
                }}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
              >
                <span>Invest in Real Estate</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Crypto Staking */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#F3B233]/50 p-6 flex flex-col justify-between relative shadow-xl overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3B233]/15 border border-[#F3B233]/30 flex items-center justify-center text-[#F3B233]">
                  <Coins size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Up to 3.2% Daily Yield
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">Crypto Staking</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Algorithmic liquidity provision, proof-of-stake node validation, and arbitrage strategies on top-tier assets.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Instant automated payouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Zero lock-in flexibility options</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Crypto Growth Fund");
                  setDepositModalOpen(true);
                }}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
              >
                <span>Invest in Crypto</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Gold Reserves */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#F3B233]/50 p-6 flex flex-col justify-between relative shadow-xl overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3B233]/15 border border-[#F3B233]/30 flex items-center justify-center text-[#F3B233]">
                  <Gem size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Up to 1.2% Daily Yield
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">Physical Gold</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Allocated, audited London Good Delivery gold bullion stored securely in Zurich and Singapore vaults.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Physical redemption guaranteed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Inflation hedge stability</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Gold Bullion Reserve");
                  setDepositModalOpen(true);
                }}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
              >
                <span>Invest in Gold</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Green Energy */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#F3B233]/50 p-6 flex flex-col justify-between relative shadow-xl overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F3B233]/15 border border-[#F3B233]/30 flex items-center justify-center text-[#F3B233]">
                  <Zap size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Up to 2.4% Daily Yield
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">Green Energy</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Solar parks, wind farms, and sustainable grid projects yielding long-term utility power contracts.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>ESG Compliant investments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#F3B233]" />
                    <span>Government contracted yields</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Energy Infrastructure");
                  setDepositModalOpen(true);
                }}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
              >
                <span>Invest in Energy</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {}
      {/* INTERACTIVE ROI YIELD CALCULATOR */}
      <section id="calculator" className="py-20 bg-[#061224] border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
                Transparent Profit Projections
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Calculate Your Expected Daily & Total Yields
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Use our dynamic yield engine to estimate returns based on initial principal, chosen asset strategy, and holding duration.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#F3B233]/10 border border-[#F3B233]/30 text-[#F3B233] shrink-0">
                    <CalcIcon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Algorithmic Rate Matching</h4>
                    <p className="text-xs text-slate-400">Rates auto-adjust based on live market liquidity reserves.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Guaranteed Principal Shield</h4>
                    <p className="text-xs text-slate-400">Your initial deposit is protected by multi-vault reserves.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Calculator Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#0A192F] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
                
                {/* Asset Class Selector Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    1. Select Target Asset Strategy
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {assetKeys.map((key) => (
                      <button
                        key={key}
                        onClick={() => setCalcAsset(key)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                          calcAsset === key
                            ? "bg-[#F3B233] text-slate-950 border-[#F3B233] shadow-md shadow-[#F3B233]/20"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {assetRates[key].name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">
                      2. Investment Principal ($ USD)
                    </span>
                    <span className="text-lg font-extrabold text-[#F3B233] font-mono">
                      ${calcAmount.toLocaleString("en-US")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F3B233]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>$500 Min</span>
                    <span>$50,000</span>
                    <span>$100,000 VIP</span>
                  </div>
                </div>

                {/* Duration Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    3. Investment Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 30, 90, 180].map((days) => (
                      <button
                        key={days}
                        onClick={() => setCalcDuration(days)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          calcDuration === days
                            ? "bg-slate-100 text-slate-950 border-white shadow-md"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Results Display Grid */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium uppercase">Daily Earnings</p>
                    <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                      +${estimatedDailyEarnings.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium uppercase">Total Net Profit</p>
                    <p className="text-xl font-extrabold text-[#F3B233] font-mono mt-1">
                      +${estimatedTotalProfit.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-slate-400 font-medium uppercase">Total Payout</p>
                    <p className="text-xl font-extrabold text-white font-mono mt-1">
                      ${totalPayout.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="w-full py-4 rounded-xl text-sm font-bold text-slate-950 bg-linear-to-r from-[#F3B233] via-[#f5c35b] to-[#E5A422] hover:brightness-110 shadow-xl shadow-[#F3B233]/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Lock In This {roiPercentage}% ROI Strategy</span>
                  <ArrowRight size={16} />
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* TIERED INVESTMENT PLANS */}
      <section id="plans" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
              Structured Capital Plans
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Choose Your Wealth Acceleration Tier
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Transparent terms, zero hidden maintenance fees, and daily credited profits ready for instant withdrawal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            
            {/* Starter Plan */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col justify-between relative shadow-xl">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Level</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1">Starter Tier</h3>
                  <p className="text-xs text-slate-400 mt-1">Ideal for new investors testing high-yield strategies.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-3xl font-extrabold text-[#F3B233]">1.5% <span className="text-xs font-normal text-slate-400">/ Daily</span></p>
                  <p className="text-xs text-slate-300">Duration: 14 Days</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Min Deposit: <strong>$500</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Max Deposit: <strong>$4,999</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Daily Payout Credit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Principal Returned at Maturity</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-500">
                    <X size={16} />
                    <span>Dedicated Portfolio Advisory</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Starter Tier (1.5% Daily)");
                  setDepositModalOpen(true);
                }}
                className="mt-8 w-full py-3.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                Choose Starter Tier
              </button>
            </div>

            {/* Growth Wealth Plan - POPULAR */}
            <div className="rounded-3xl bg-linear-to-b from-[#0A192F] via-slate-900 to-[#0A192F] border-2 border-[#F3B233] p-8 flex flex-col justify-between relative shadow-2xl shadow-[#F3B233]/15 transform lg:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#F3B233] to-[#E5A422] text-slate-950 font-extrabold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                Most Popular Strategy
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#F3B233] uppercase tracking-widest">Balanced Portfolio</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1">Growth Wealth Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">Optimized for consistent compound interest growth.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-[#F3B233]/40 space-y-1">
                  <p className="text-4xl font-extrabold text-[#F3B233]">3.2% <span className="text-xs font-normal text-slate-400">/ Daily</span></p>
                  <p className="text-xs text-slate-300">Duration: 30 Days</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Min Deposit: <strong>$5,000</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Max Deposit: <strong>$49,999</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Automated Daily Payouts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Multi-Asset Allocation (Gold + Real Estate)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>24/7 Priority Support Desk</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("Growth Wealth Plan (3.2% Daily)");
                  setDepositModalOpen(true);
                }}
                className="mt-8 w-full py-4 rounded-xl font-extrabold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] hover:brightness-110 transition-all shadow-lg shadow-[#F3B233]/25"
              >
                Select Growth Plan
              </button>
            </div>

            {/* VIP Institutional */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col justify-between relative shadow-xl">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institutional</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1">VIP Sovereign Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">Tailored for corporate funds and ultra-high-net-worth clients.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-3xl font-extrabold text-[#F3B233]">5.0% <span className="text-xs font-normal text-slate-400">/ Daily</span></p>
                  <p className="text-xs text-slate-300">Duration: 60 Days</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Min Deposit: <strong>$50,000</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Max Deposit: <strong>Unlimited</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Dedicated Private Portfolio Officer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Custom Escrow & Legal Contracts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#F3B233]" />
                    <span>Instant Capital Liquidation Option</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForDeposit("VIP Sovereign Plan (5.0% Daily)");
                  setDepositModalOpen(true);
                }}
                className="mt-8 w-full py-3.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                Apply for VIP Access
              </button>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-[#061224] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
              3-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Start Earning Returns in Under 5 Minutes
            </h2>
            <p className="text-slate-400 text-sm">
              Our streamlined onboarding process gets your capital working immediately without complex paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 relative space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#F3B233] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-[#F3B233]/20 mx-auto sm:mx-0">
                01
              </div>
              <h3 className="text-xl font-extrabold text-white">Create & Verify Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign up in seconds with end-to-end encrypted account creation and rapid automated KYC verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 relative space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#F3B233] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-[#F3B233]/20 mx-auto sm:mx-0">
                02
              </div>
              <h3 className="text-xl font-extrabold text-white">Select Strategy & Deposit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your preferred asset class or tiered plan. Fund via USDT, Bitcoin, Bank Wire, or Ethereum.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 relative space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#F3B233] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-[#F3B233]/20 mx-auto sm:mx-0">
                03
              </div>
              <h3 className="text-xl font-extrabold text-white">Receive Daily Yields</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch profits credit to your portal dashboard every 24 hours. Withdraw instantly to any bank or crypto wallet.
              </p>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* ABOUT & SECURITY SECTION */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
                Institutional Trust & Safety
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Built on Uncompromising Capital Protection Standards
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                VicBits Capitals operates under strict global compliance frameworks. We prioritize asset liquidity, cold wallet vault isolation, and quarterly third-party smart contract and audit reviews.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <Lock className="w-6 h-6 text-[#F3B233]" />
                  <h4 className="text-sm font-bold text-white">Multi-Sig Cold Vaults</h4>
                  <p className="text-xs text-slate-400">98% of digital funds held offline in segregated hardware keys.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <Award className="w-6 h-6 text-[#F3B233]" />
                  <h4 className="text-sm font-bold text-white">$100M Insurance</h4>
                  <p className="text-xs text-slate-400">Institutional custodian coverage against technical anomalies.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-[#F3B233]" />
                  <span>Compliance & Regulatory Matrix</span>
                </h3>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">FinCEN MSB Registered</p>
                      <p className="text-slate-400">Money Services Business Compliance</p>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">256-Bit SSL Encryption</p>
                      <p className="text-slate-400">Military grade data transmission security</p>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Quarterly Reserve Audits</p>
                      <p className="text-slate-400">Independent financial solvency attestations</p>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* TESTIMONIALS & REVIEWS SECTION */}
      <section id="reviews" className="py-20 bg-[#061224] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
              Verified Investor Voices
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Trusted by 14,000+ Investors Worldwide
            </h2>
            <p className="text-slate-400 text-sm">
              Read real performance feedback from our private equity partners, institutional clients, and daily depositors.
            </p>
          </div>

          <div className="mt-14 max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 relative shadow-2xl space-y-6"
              >
                <Quote className="w-12 h-12 text-[#F3B233]/20 absolute top-6 right-6 pointer-events-none" />

                <div className="flex items-center gap-1 text-[#F3B233]">
                  {[...Array(testimonials[activeReviewIndex].rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#F3B233]" />
                  ))}
                </div>

                <p className="text-base sm:text-xl text-slate-200 font-medium italic leading-relaxed">
                  {testimonials[activeReviewIndex].quote}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-4">
                    <div
                      aria-label={testimonials[activeReviewIndex].name}
                      style={{ backgroundImage: `url('${testimonials[activeReviewIndex].avatar}')` }}
                      className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-[#F3B233]"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <span>{testimonials[activeReviewIndex].name}</span>
                        {testimonials[activeReviewIndex].verified && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Verified Investor
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {testimonials[activeReviewIndex].title} &bull; {testimonials[activeReviewIndex].location}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Asset Strategy</p>
                    <p className="text-xs font-bold text-[#F3B233]">{testimonials[activeReviewIndex].asset}</p>
                    <p className="text-xs font-extrabold text-emerald-400 mt-0.5">{testimonials[activeReviewIndex].profit}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  setActiveReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
                className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeReviewIndex === idx ? "w-8 bg-[#F3B233]" : "w-2.5 bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveReviewIndex((prev) => (prev + 1) % testimonials.length)}
                className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {}
      {/* CONTACT & ADVISORY BOOKING SECTION */}
      <section id="contact" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
                  Global Advisory Desks
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Get in Touch with Wealth Officers
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Have questions regarding asset allocation, custom institutional terms, or wire deposits? Contact our 24/7 global support team.
                </p>
              </div>

              <div className="space-y-6 text-sm text-slate-300">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="p-3 rounded-xl bg-[#F3B233]/10 border border-[#F3B233]/20 text-[#F3B233] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Global Headquarters</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Level 42, One Central Tower, DIFC, Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="p-3 rounded-xl bg-[#F3B233]/10 border border-[#F3B233]/20 text-[#F3B233] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Private Client Email</h4>
                    <p className="text-xs text-slate-400 mt-0.5">support@vicbitscapitals.com</p>
                    <p className="text-xs text-slate-400">institutional@vicbitscapitals.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="p-3 rounded-xl bg-[#F3B233]/10 border border-[#F3B233]/20 text-[#F3B233] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">VIP Phone Desk</h4>
                    <p className="text-xs text-slate-400 mt-0.5">+1 (800) 492-8120 (Toll Free)</p>
                    <p className="text-xs text-slate-400">+971 4 391 0022 (EMEA Region)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="text-[#F3B233]" />
                  <span>Send an Investor Inquiry</span>
                </h3>

                {contactSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={28} />
                    </div>
                    <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you. A senior wealth manager from VicBits Capitals will contact you within 15 minutes.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.fullName}
                          onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                          placeholder="Alexander Vance"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-[#F3B233] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="alex@investor.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-[#F3B233] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-[#F3B233] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Preferred Asset Class</label>
                        <select
                          value={contactForm.interest}
                          onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-[#F3B233] focus:outline-none"
                        >
                          <option value="Real Estate">Real Estate REITs</option>
                          <option value="Crypto">Crypto Growth Staking</option>
                          <option value="Gold">Physical Gold Bullion</option>
                          <option value="Green Energy">Energy Infrastructure</option>
                          <option value="VIP Custom">VIP Custom Sovereign Fund</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Message / Inquiry Details</label>
                      <textarea
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about your investment target or capital size..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-[#F3B233] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl text-xs font-bold text-slate-950 bg-linear-to-r from-[#F3B233] via-[#f5c35b] to-[#E5A422] hover:brightness-110 shadow-lg shadow-[#F3B233]/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      <span>Submit Inquiry to Private Advisor</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* HIGH-CONVERTING CTA BANNER */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-linear-to-r from-[#F3B233] via-[#E5A422] to-amber-700 p-8 sm:p-12 text-slate-950 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Background Accent Lines */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <span className="inline-block bg-slate-950 text-[#F3B233] text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Limited Deposit Allocation Bonus
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Receive an Extra 10% Match Bonus On Your First Deposit Today
              </h2>
              <p className="text-slate-950/80 text-sm font-medium">
                Open a verified investor account within the next 24 hours to instantly receive our 10% welcome bonus credit towards your chosen yield strategy.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <button
                onClick={() => setSignUpModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 text-white font-extrabold text-sm hover:bg-slate-900 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Claim Deposit Bonus</span>
                <ArrowRight size={16} className="text-[#F3B233]" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {}
      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-[#061224] border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Everything you need to know about investing, withdrawals, safety, and returns.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setFaqOpenIndex((current) => (current === idx ? null : idx))}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold text-sm sm:text-base hover:text-[#F3B233] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#F3B233] shrink-0 transition-transform ${
                      faqOpenIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {faqOpenIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {}
      {/* FOOTER */}
      <footer className="bg-[#030914] text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            
            <div className="lg:col-span-2 space-y-4">
              <a href="#" className="flex items-center gap-2">
                <Gem className="w-6 h-6 text-[#F3B233]" />
                <span className="text-xl font-black text-white tracking-wider">
                  VICBITS <span className="text-[#F3B233]">CAPITALS</span>
                </span>
              </a>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                VicBits Capitals is a registered institutional investment platform providing fractional access to premium global assets, crypto liquidity staking, and real estate yields.
              </p>
              <p className="text-xs text-slate-500 italic">
                Regulated MSB Entity &bull; DIFC Dubai &bull; London &bull; Zurich
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Investment Assets</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#investments" className="hover:text-[#F3B233] transition-colors">Real Estate REITs</a></li>
                <li><a href="#investments" className="hover:text-[#F3B233] transition-colors">Crypto Yield Staking</a></li>
                <li><a href="#investments" className="hover:text-[#F3B233] transition-colors">Physical Gold Reserves</a></li>
                <li><a href="#investments" className="hover:text-[#F3B233] transition-colors">Green Infrastructure</a></li>
                <li><a href="#plans" className="hover:text-[#F3B233] transition-colors">VIP Sovereign Funds</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Legal & Safety</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-[#F3B233] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#F3B233] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#F3B233] transition-colors">Risk Disclosure</a></li>
                <li><a href="#" className="hover:text-[#F3B233] transition-colors">AML / KYC Policy</a></li>
                <li><a href="#" className="hover:text-[#F3B233] transition-colors">Audit Reports</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Direct Support</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-[#F3B233]" />
                  <span>support@vicbitscapitals.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-[#F3B233]" />
                  <span>+1 (800) 492-8120</span>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => setConsultationModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#F3B233] hover:brightness-110"
                  >
                    Request Advisory Call
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; 2015 VicBits Capitals Group Ltd. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300">Security Certificate</a>
              <a href="#" className="hover:text-slate-300">Status Page</a>
              <a href="#" className="hover:text-slate-300">Privacy Shield</a>
            </div>
          </div>

        </div>
      </footer>

      {}
      {/* MODAL 1: CONSULTATION / VIDEO ADVISORY */}
      <AnimatePresence>
        {consultationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A192F] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6"
            >
              <button
                onClick={() => setConsultationModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#F3B233]/20 text-[#F3B233]">
                  <Headphones size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Book 1-on-1 Consultation</h3>
                  <p className="text-xs text-slate-400">Speak directly with a licensed VicBits Wealth Officer.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">During this 15-minute call, we will discuss:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Custom portfolio allocation based on your target liquidity</li>
                    <li>Wire deposit procedures & tax-friendly structures</li>
                    <li>Proof of physical gold & property title escrow documentation</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-[#F3B233] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-[#F3B233] focus:outline-none"
                  />
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-[#F3B233] focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    alert("Consultation request confirmed! Our officer will call you at your requested time.");
                    setConsultationModalOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20"
                >
                  Confirm Advisory Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: QUICK DEPOSIT / PLAN DEPOSIT */}
      <AnimatePresence>
        {depositModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A192F] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl space-y-6"
            >
              <button
                onClick={() => setDepositModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#F3B233] tracking-widest">Instant Deposit Vault</span>
                <h3 className="text-xl font-extrabold text-white">Invest in {selectedPlanForDeposit}</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Plan:</span>
                    <strong className="text-white">{selectedPlanForDeposit}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Payout Frequency:</span>
                    <strong className="text-emerald-400">Daily Automated Credit</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Deposit Amount ($ USD)</label>
                  <input
                    type="number"
                    defaultValue="5000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:border-[#F3B233] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Payment Gateway Method</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-[#F3B233] focus:outline-none">
                    <option>USDT (TRC-20 / ERC-20 Instant)</option>
                    <option>Bitcoin (BTC Network)</option>
                    <option>Ethereum (ETH Network)</option>
                    <option>Bank Wire Transfer (USD / EUR / GBP)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    alert(`Deposit wallet address generated for ${selectedPlanForDeposit}. Proceeding to payment portal.`);
                    setDepositModalOpen(false);
                  }}
                  className="w-full py-4 rounded-xl font-bold text-xs text-slate-950 bg-linear-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/25 flex items-center justify-center gap-2"
                >
                  <DollarSign size={16} />
                  <span>Generate Deposit Wallet Address</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: SIGN UP / ACCOUNT MODAL */}
      <AnimatePresence>
          <SignUpModal
            isOpen={signUpModalOpen}
            onClose={() => setSignUpModalOpen(false)}
          />

          <SignInModal
            isOpen={signInModalOpen}
            onClose={() => setSignInModalOpen(false)}
          />
      </AnimatePresence>

    </div>
  );
}
