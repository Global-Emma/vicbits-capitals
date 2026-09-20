"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Briefcase,
  User,
  Headphones,
  LogOut,
  Search,
  Bell,
  Wallet,
  Building2,
  Coins,
  Gem,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function VicbitsDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [timeframe, setTimeframe] = useState("7D");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Investments", icon: TrendingUp },
    { name: "Deposits", icon: ArrowDownLeft },
    { name: "Withdrawals", icon: ArrowUpRight },
    { name: "Transactions", icon: History },
    { name: "Portfolio", icon: Briefcase },
    { name: "Profile", icon: User },
    { name: "Support", icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#040B18] text-slate-100 flex font-sans antialiased selection:bg-[#F3B233] selection:text-slate-950">
      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#061224] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* LOGO */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F3B233] to-[#D89315] flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-md shadow-[#F3B233]/20">
                V
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white leading-none">
                  VicBits
                </h1>
                <span className="text-[10px] font-bold text-[#F3B233] uppercase tracking-wider">
                  Capitals
                </span>
              </div>
            </div>
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-800/60">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-xl transition-colors">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-20 border-b border-slate-800/80 bg-[#061224]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2"
            >
              <Menu size={22} />
            </button>

            {/* SEARCH BAR */}
            <div className="relative w-64 sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3] transition-colors"
              />
            </div>
          </div>

          {/* RIGHT TOP PROFILE ACTIONS */}
          <div className="flex items-center gap-5">
            {/* Notification Icon */}
            <button className="relative p-2 rounded-xl bg-[#09172c] border border-slate-800 text-slate-300 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800/80">
              <div
                aria-label="John Doe"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80')",
                }}
                className="w-9 h-9 rounded-full bg-cover bg-center border border-[#F3B233]"
              />
              <div className="hidden sm:block text-left">
                <h2 className="text-xs font-bold text-white leading-snug">
                  John Doe
                </h2>
                <span className="text-[10px] font-medium text-emerald-400">
                  Verified User
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* HEADER GREETING */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Welcome back, John Doe <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Here&apos;s your investment overview
            </p>
          </div>

          {/* TOP OVERVIEW CARDS + PROMO BANNER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 4 STAT CARDS (Col 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Total Balance */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Total Balance
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#1E6BF3]/15 text-[#1E6BF3] flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">
                    $12,480.00
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 mt-1 inline-block">
                    +12.5%
                  </span>
                </div>
              </div>

              {/* Card 2: Total Invested */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Total Invested
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Coins size={16} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">
                    $8,500.00
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 mt-1 inline-block">
                    +8.4%
                  </span>
                </div>
              </div>

              {/* Card 3: Total Returns */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Total Returns
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-extrabold text-white">
                    $3,980.00
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 mt-1 inline-block">
                    +15.2%
                  </span>
                </div>
              </div>

              {/* Card 4: Active Investments */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Active Investments
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Briefcase size={16} />
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <h3 className="text-2xl font-extrabold text-white">3</h3>
                  <button className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-1">
                    <span>View Details</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* TOP RIGHT PROMO BANNER (Col 4) */}
            <div className="lg:col-span-4 rounded-2xl overflow-hidden relative border border-slate-800/80 bg-gradient-to-br from-[#0a1b38] to-[#040d1a] p-6 flex flex-col justify-between min-h-[220px]">
              {/* Background Image Overlay */}
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity pointer-events-none"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80')",
                }}
              />
              <div className="relative z-10 space-y-2">
                <h2 className="text-lg font-bold text-white leading-snug">
                  Grow Your Wealth <br />
                  with <span className="text-[#F3B233]">VicBits Capitals</span>
                </h2>
                <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">
                  Invest in Real Estate, Crypto and Gold. Secure. Transparent. Profitable.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <button className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 transition-all flex items-center gap-2">
                  <span>Explore Investments</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: PERFORMANCE CHART & RECENT TRANSACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* PORTFOLIO PERFORMANCE CHART (Col 7) */}
            <div className="lg:col-span-7 bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Portfolio Performance
                  </h3>
                  <div className="flex items-center gap-1 bg-[#061224] p-1 rounded-xl border border-slate-800">
                    {["7D", "30D", "3M", "1Y"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          timeframe === tf
                            ? "bg-[#1E6BF3] text-white shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    $12,480.00
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    +12.5%
                  </span>
                </div>
              </div>

              {/* SVG Smooth Area Line Chart */}
              <div className="mt-6 w-full h-44 relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E6BF3" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1E6BF3" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill */}
                  <path
                    d="M 0,110 Q 50,80 100,95 T 200,60 T 300,75 T 400,30 T 500,45 L 500,150 L 0,150 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Chart Stroke Line */}
                  <path
                    d="M 0,110 Q 50,80 100,95 T 200,60 T 300,75 T 400,30 T 500,45"
                    fill="none"
                    stroke="#1E6BF3"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Glowing Point */}
                  <circle cx="500" cy="45" r="5" fill="#3B82F6" className="animate-pulse" />
                </svg>

                {/* X-AXIS DATES */}
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 mt-4 px-1">
                  <span>Apr 20</span>
                  <span>Apr 27</span>
                  <span>May 4</span>
                  <span>May 11</span>
                  <span>May 18</span>
                </div>
              </div>
            </div>

            {/* RECENT TRANSACTIONS LIST (Col 5) */}
            <div className="lg:col-span-5 bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">
                  Recent Transactions
                </h3>
                <button className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                  <span>View All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    type: "Crypto Deposit",
                    date: "Apr 18, 2026",
                    amount: "+$500.00",
                    status: "Confirmed",
                    positive: true,
                    icon: Coins,
                  },
                  {
                    type: "Real Estate Investment",
                    date: "Apr 15, 2026",
                    amount: "-$2,000.00",
                    status: "Completed",
                    positive: false,
                    icon: Building2,
                  },
                  {
                    type: "Gold Investment",
                    date: "Apr 12, 2026",
                    amount: "-$1,500.00",
                    status: "Completed",
                    positive: false,
                    icon: Gem,
                  },
                  {
                    type: "Account Bonus",
                    date: "Apr 10, 2026",
                    amount: "+$50.00",
                    status: "Credited",
                    positive: true,
                    icon: Sparkles,
                  },
                ].map((tx, idx) => {
                  const Icon = tx.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#061224]/70 border border-slate-800/50 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-[#F3B233]">
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {tx.type}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {tx.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-bold block ${
                            tx.positive ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {tx.amount}
                        </span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mt-0.5">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: INVESTMENT PLANS & REAL ESTATE BANNER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* INVESTMENT PLAN TIERS (Col 7) */}
            <div className="lg:col-span-7 bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">
                  Investment Plans
                </h3>
                <button className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                  <span>View All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Starter Plan */}
                <div className="rounded-xl border border-slate-800 bg-[#061224]/80 p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Starter</h4>
                      <p className="text-sm font-extrabold text-white mt-1">
                        $500 - $2,499
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span>Expected Return:</span>
                      <p className="font-bold text-slate-200">8% - 12%</p>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">
                    Invest Now
                  </button>
                </div>

                {/* Growth Plan (Most Popular Highlighted) */}
                <div className="relative rounded-xl border-2 border-[#F3B233] bg-[#07152b] p-4 flex flex-col justify-between shadow-lg shadow-[#F3B233]/10">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#F3B233] text-slate-950 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                    Most Popular
                  </span>
                  <div className="space-y-3 pt-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Growth</h4>
                      <p className="text-sm font-extrabold text-white mt-1">
                        $2,500 - $9,999
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span>Expected Return:</span>
                      <p className="font-bold text-slate-200">12% - 18%</p>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] hover:brightness-110 transition-all shadow-md">
                    Invest Now
                  </button>
                </div>

                {/* Premium Plan */}
                <div className="rounded-xl border border-slate-800 bg-[#061224]/80 p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                      <Gem size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Premium</h4>
                      <p className="text-sm font-extrabold text-white mt-1">
                        $10,000+
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span>Expected Return:</span>
                      <p className="font-bold text-slate-200">18% - 25%</p>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>

            {/* REAL ESTATE PROMO CARD (Col 5) */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden relative border border-slate-800/80 bg-slate-900 min-h-[220px] flex flex-col justify-between p-6">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80')",
                }}
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040c18] via-[#040c18]/70 to-transparent" />

              <div className="relative z-10 space-y-1">
                <h3 className="text-xl font-bold text-white">Real Estate</h3>
                <p className="text-xs text-slate-300 max-w-xs">
                  Build generational wealth with prime properties.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <button className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 transition-all flex items-center gap-2">
                  <span>Invest in Real Estate</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}