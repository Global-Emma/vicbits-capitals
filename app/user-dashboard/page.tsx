"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Briefcase,
  Wallet,
  Building2,
  Coins,
  ChevronRight,
  ArrowRight,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/utils/useApp";
import api from "@/utils/axios";
import DashboardLayout from "@/components/Sidebar";

// Format helper for USD currency
const formatCurrency = (amount: number | string = 0) => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(isNaN(numericAmount) ? 0 : numericAmount);
};

interface DashboardData {
  balance: number;
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  recentTransactions: Array<{
    id: string;
    description: string;
    date: string;
    amount: number;
    type: string;
    status: string;
  }>;
}

interface InvestmentPlan {
  _id: string;
  name: string;
  slug: string;
  minInvestment: number;
  expectedApy: number;
  badge?: string;
}

export default function VicbitsDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    Promise.all([api.get("/api/portal/dashboard"), api.get("/api/portal/plans")])
      .then(([dashboardResponse, plansResponse]) => {
        setDashboard(dashboardResponse.data.data);
        setPlans(plansResponse.data.data.slice(0, 3));
      })
      .catch((error) => console.error("Could not load dashboard data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-[#040B18] text-slate-100 flex font-sans antialiased selection:bg-[#F3B233] selection:text-slate-950">
      <DashboardLayout>
        {/* MAIN DASHBOARD OVERVIEW */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-7xl mx-auto">
          {/* 1. HEADER: GREETING & QUICK ACTIONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Welcome back, {user?.firstName || "Investor"} <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Here&apos;s your financial portfolio summary</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={11} /> {user?.kycStatus || "unverified"} account
                </span>
              </p>
            </div>

            {/* Quick Action Buttons for Investor */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/user-dashboard/deposit")}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/15 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Plus size={15} />
                <span>Deposit Funds</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/user-dashboard/withdrawals")}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-[#09172c] border border-slate-800 hover:border-slate-700 hover:text-white transition-all flex items-center gap-2"
              >
                <ArrowDownLeft size={15} />
                <span>Withdraw Profit</span>
              </button>
            </div>
          </div>

          {/* 2. TOP KPI STAT CARDS (4-Column Balanced Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Balance */}
            <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Balance</span>
                <div className="w-8 h-8 rounded-xl bg-[#1E6BF3]/15 text-[#1E6BF3] flex items-center justify-center">
                  <Wallet size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {formatCurrency(dashboard?.balance ?? user?.balance)}
                </h3>
              </div>
            </div>

            {/* Card 2: Total Invested */}
            <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Active Invested Capital</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Coins size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {formatCurrency(dashboard?.totalInvested ?? user?.totalInvested)}
                </h3>
              </div>
            </div>

            {/* Card 3: Total Returns */}
            <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Net Returns</span>
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {formatCurrency(dashboard?.totalReturns ?? user?.totalReturns)}
                </h3>
              </div>
            </div>

            {/* Card 4: Active Portfolios */}
            <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Active Plans</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Briefcase size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">{dashboard?.activeInvestments ?? 0} Positions</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Active investments</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/user-dashboard/investments")}
                  className="text-xs font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5"
                >
                  <span>Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 3. MAIN CONTENT GRID (8 Cols Left / 4 Cols Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: PERFORMANCE & INVESTMENT PLANS (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* ACCOUNT VALUE */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Account Overview</h3>
                    <p className="text-[11px] text-slate-400">Current cash and active investment value</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#040D1A]/70 border border-slate-800/60 p-4">
                    <span className="text-xs text-slate-400">Available cash</span>
                    <p className="mt-2 text-xl font-extrabold text-white">{formatCurrency(dashboard?.balance)}</p>
                  </div>
                  <div className="rounded-xl bg-[#040D1A]/70 border border-slate-800/60 p-4">
                    <span className="text-xs text-slate-400">Active investments</span>
                    <p className="mt-2 text-xl font-extrabold text-white">{formatCurrency(dashboard?.totalInvested)}</p>
                  </div>
                </div>
              </div>

              {/* AVAILABLE INVESTMENT TIERS */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">Featured Investment Plans</h3>
                    <p className="text-[11px] text-slate-400">Select a plan to compound your wealth</p>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5"
                  >
                    <span>View All Plans</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div key={plan._id} className="rounded-xl border border-slate-800/80 bg-[#040D1A]/60 p-4 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center"><TrendingUp size={16} /></div>
                        <h4 className="text-xs font-bold text-white">{plan.name}</h4>
                        <p className="text-sm font-extrabold text-white">From {formatCurrency(plan.minInvestment)}</p>
                        <p className="text-[11px] text-emerald-400">{plan.expectedApy}% expected APY</p>
                      </div>
                      <Link href="/user-dashboard/investments" className="mt-4 w-full py-2 rounded-lg text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">View Plan</Link>
                    </div>
                  ))}
                  {plans.length === 0 && <p className="text-xs text-slate-400">No investment plans are available yet.</p>}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TRANSACTIONS & HIGHLIGHT PROMO (Col 4) */}
            <div className="lg:col-span-4 space-y-6">
              {/* RECENT TRANSACTIONS FEED */}
              <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                    <p className="text-[11px] text-slate-400">Your latest account activity</p>
                  </div>
                  <Link href="/user-dashboard/transactions" className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                    <span>View All</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {(dashboard?.recentTransactions || []).map((tx) => {
                    const Icon = tx.type === "Income" ? Coins : tx.description.toLowerCase().includes("investment") ? Building2 : ArrowUpRight;
                    const positive = tx.type === "Income" || tx.type === "Refund";
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#040D1A]/70 border border-slate-800/50 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-[#F3B233] shrink-0">
                            <Icon size={15} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{tx.description}</h4>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {new Date(tx.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-bold block ${
                              positive ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {positive ? "+" : "-"}{formatCurrency(tx.amount)}
                          </span>
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mt-0.5">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {dashboard?.recentTransactions.length === 0 && <p className="text-xs text-slate-400">No account activity yet.</p>}
                </div>
              </div>

              {/* FEATURED OPPORTUNITY BANNER (Compact & Clean) */}
              <div className="rounded-2xl overflow-hidden relative border border-slate-800/80 bg-slate-900 min-h-[200px] flex flex-col justify-between p-6">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040c18] via-[#040c18]/80 to-[#040c18]/40" />

                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-[#F3B233] tracking-wider uppercase bg-[#F3B233]/10 border border-[#F3B233]/20 px-2 py-0.5 rounded-full inline-block">
                    High Yield Opportunity
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Prime Real Estate Fund
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xs">
                    Institutional-grade real estate assets with consistent quarterly payouts.
                  </p>
                </div>

                <div className="relative z-10 pt-4">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] shadow-lg shadow-[#F3B233]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Opportunity</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </div>
  );
}