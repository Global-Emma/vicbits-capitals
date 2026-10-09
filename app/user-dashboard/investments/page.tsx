"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  ShieldCheck,
  Zap,
  Building2,
  Coins,
  Gem,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  X,
  Info,
  Wallet,
  PlusCircle,
  Clock,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { isAxiosError } from "axios";
import DashboardLayout from "@/components/Sidebar";
import api from "@/utils/axios";
import { useApp } from "@/utils/useApp";

// Active Investment (Investor's Portfolio) Interface
export interface ActiveInvestment {
  id: string;
  assetId: string;
  name: string;
  symbol: string;
  category: "crypto" | "realestate" | "gold" | "etfs" | "nfts";
  investedAmount: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
  expectedReturns: number;
  yieldType: "weekly" | "monthly";
  yieldPercent: number;
  startDate: string;
  nextPayoutDate: string;
  payoutAmount: number;
  paidOutAt?: string | null;
  status: "Active" | "Matured" | "Locked";
}

// Marketplace Asset Interface
export interface InvestmentAsset {
  id: string;
  name: string;
  symbol: string;
  category: "crypto" | "realestate" | "gold" | "etfs" | "nfts";
  price: number;
  priceDisplay: string;
  change24h: number;
  yieldType: "weekly" | "monthly";
  yieldPercent: number;
  expectedReturns: number;
  payoutIntervalDays: number;
  payoutDate?: string | null;
  minInvestment: number;
  riskLevel: "Low" | "Medium" | "High";
  badge?: string;
  description: string;
  tags: string[];
}

const toFiniteNumber = (value: unknown): number => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
};

const money = (value: number): string => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const estimatedPayout = (asset: InvestmentAsset, amount: number): number => {
  const payout = asset.minInvestment > 0
    ? amount * asset.expectedReturns / asset.minInvestment
    : amount * (1 + asset.yieldPercent / 100);
  return Number(payout.toFixed(2));
};

const payoutSchedule = (asset: InvestmentAsset): string => {
  const configuredDate = asset.payoutDate ? new Date(asset.payoutDate) : null;
  if (configuredDate && configuredDate.getTime() > Date.now()) {
    return `Payout date ${configuredDate.toLocaleDateString()}`;
  }
  return `Payout within ${asset.payoutIntervalDays} days of investment`;
};

// Category Configuration
const CATEGORIES = [
  { id: "all", name: "All Assets", icon: Sparkles },
  { id: "crypto", name: "Crypto", icon: Coins },
  { id: "realestate", name: "Real Estate", icon: Building2 },
  { id: "gold", name: "Gold & Metals", icon: Gem },
  { id: "etfs", name: "ETFs & Stocks", icon: BarChart3 },
  { id: "nfts", name: "NFTs", icon: Zap },
];

export default function InvestmentsPage() {
  const [viewMode, setViewMode] = useState<"marketplace" | "active">("marketplace");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "apy" | "price">("popular");

  // State for active investments
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([]);
  const [assets, setAssets] = useState<InvestmentAsset[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const { refetchData } = useApp();

  // Investment Modal State
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset | null>(null);
  const [investAmount, setInvestAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadInvestmentData = async () => {
      try {
        const [planResponse, investmentResponse, dashboardResponse] = await Promise.all([
          api.get("/api/portal/plans"),
          api.get("/api/portal/investments"),
          api.get("/api/portal/dashboard"),
        ]);
        const plans = planResponse.data.data || [];
        const investments = investmentResponse.data.data || [];

        setAssets(plans.map((plan: InvestmentAsset & { _id: string; slug: string }) => ({
          ...plan,
          id: plan.slug,
          price: toFiniteNumber(plan.price),
          priceDisplay: `$${toFiniteNumber(plan.price).toLocaleString()}`,
          change24h: toFiniteNumber(plan.change24h),
          yieldType: plan.yieldType || "monthly",
          yieldPercent: toFiniteNumber(plan.yieldPercent),
          expectedReturns: toFiniteNumber(plan.expectedReturns),
          payoutIntervalDays: toFiniteNumber(plan.payoutIntervalDays) || 30,
          minInvestment: toFiniteNumber(plan.minInvestment),
          tags: Array.isArray(plan.tags) ? plan.tags : [],
        })));
        setActiveInvestments(investments.map((investment: ActiveInvestment & { startDate: string }) => ({
          ...investment,
          investedAmount: toFiniteNumber(investment.investedAmount),
          currentValue: toFiniteNumber(investment.currentValue),
          totalProfit: toFiniteNumber(investment.totalProfit),
          profitPercentage: toFiniteNumber(investment.profitPercentage),
          expectedReturns: toFiniteNumber(investment.expectedReturns),
          yieldType: investment.yieldType || "monthly",
          yieldPercent: toFiniteNumber(investment.yieldPercent),
          payoutAmount: toFiniteNumber(investment.payoutAmount),
          startDate: investment.startDate ? new Date(investment.startDate).toISOString().slice(0, 10) : "",
        })));
        setAvailableBalance(toFiniteNumber(dashboardResponse.data.data?.balance));
        setTotalReturns(toFiniteNumber(dashboardResponse.data.data?.totalReturns));
        setLoadError("");
      } catch (error) {
        console.error("Could not load investment data:", error);
        setLoadError("Investment data could not be loaded. Please refresh and try again.");
      }
    };

    void loadInvestmentData();
  }, []);

  // Portfolio Totals Calculation
  const portfolioSummary = useMemo(() => {
    const activePositions = activeInvestments.filter((investment) => investment.status === "Active");
    const totalInvested = activePositions.reduce((acc, curr) => acc + toFiniteNumber(curr.investedAmount), 0);
    const currentValue = activePositions.reduce((acc, curr) => acc + toFiniteNumber(curr.currentValue), 0);
    const totalProfit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage,
      activeCount: activePositions.length,
    };
  }, [activeInvestments]);

  // Filtered Assets for Marketplace
  const filteredMarketAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory =
        selectedCategory === "all" || asset.category === selectedCategory;
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "apy") return b.yieldPercent - a.yieldPercent;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });
  }, [assets, selectedCategory, searchQuery, sortBy]);

  // Handle New Investment
  const handleConfirmInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investAmount);
    if (!selectedAsset || !Number.isFinite(amount) || amount <= 0) return;
    if (amount < selectedAsset.minInvestment) {
      setSubmissionError(`Minimum investment for this plan is $${selectedAsset.minInvestment}.`);
      return;
    }
    if (amount > availableBalance) {
      setSubmissionError("Investment amount exceeds your available cash balance.");
      return;
    }

    setSubmissionError("");
    setIsSubmitting(true);
    try {
      await api.post("/api/portal/investments", { planSlug: selectedAsset.id, amount });
      const [investmentResponse, dashboardResponse] = await Promise.all([
        api.get("/api/portal/investments"),
        api.get("/api/portal/dashboard"),
      ]);
      setActiveInvestments(investmentResponse.data.data.map((investment: ActiveInvestment & { startDate: string }) => ({
        ...investment,
        investedAmount: toFiniteNumber(investment.investedAmount),
        currentValue: toFiniteNumber(investment.currentValue),
        totalProfit: toFiniteNumber(investment.totalProfit),
        profitPercentage: toFiniteNumber(investment.profitPercentage),
        expectedReturns: toFiniteNumber(investment.expectedReturns),
        yieldType: investment.yieldType || "monthly",
        yieldPercent: toFiniteNumber(investment.yieldPercent),
        payoutAmount: toFiniteNumber(investment.payoutAmount),
        startDate: investment.startDate ? new Date(investment.startDate).toISOString().slice(0, 10) : "",
      })));
      setAvailableBalance(toFiniteNumber(dashboardResponse.data.data?.balance));
      setTotalReturns(toFiniteNumber(dashboardResponse.data.data?.totalReturns));
      await refetchData();
      setIsSuccess(true);
      window.setTimeout(() => {
        setIsSuccess(false);
        setSelectedAsset(null);
        setInvestAmount("");
        setViewMode("active");
      }, 1200);
    } catch (error) {
      console.error("Investment request failed:", error);
      const responseMessage = isAxiosError(error) ? error.response?.data?.message : null;
      setSubmissionError(responseMessage || "Investment could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout defaultTab="Investments">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* HEADER & PORTFOLIO OVERVIEW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#1E6BF3] mb-1">
              <ShieldCheck size={16} />
              <span>VicBits Institutional Capital</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Investment Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your active positions or explore new vaults in Crypto, Real Estate, Gold, ETFs & NFTs.
            </p>
          </div>

          {/* VIEW TAB SWITCHER */}
          <div className="flex items-center bg-[#061224] border border-slate-800/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode("marketplace")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "marketplace"
                  ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase size={15} />
              <span>Explore Vaults</span>
            </button>

            <button
              onClick={() => setViewMode("active")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                viewMode === "active"
                  ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet size={15} />
              <span>My Investments</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F3B233] text-black">
                {portfolioSummary.activeCount}
              </span>
            </button>
          </div>
        </div>

        {loadError && (
          <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {loadError}
          </p>
        )}

        {/* ACTIVE PORTFOLIO METRICS SUMMARY BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total Invested</span>
              <DollarSign size={16} className="text-[#1E6BF3]" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${Number(portfolioSummary?.totalInvested)?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Capital Allocated</span>
          </div>

          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Projected value of active positions</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${Number(portfolioSummary.currentValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
              +${Number(portfolioSummary.totalProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })} ({Number(portfolioSummary.profitPercentage).toFixed(2)}%)
            </span>
          </div>

          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total Net Earnings</span>
              <ArrowUpRight size={16} className="text-[#F3B233]" />
            </div>
            <p className="text-2xl font-bold text-[#F3B233]">
              ${totalReturns.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Realized & Un-realized</span>
          </div>

          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active Vaults</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{Number(portfolioSummary.activeCount).toLocaleString("en-US")} Positions</p>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">All Systems Active</span>
          </div>
        </div>

        {/* MODE 1: MY ACTIVE HOLDINGS (EXISTING INVESTMENTS) */}
        {viewMode === "active" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Your Investment Positions</h2>
                <p className="text-xs text-slate-400">
                  Track invested capital, projected payout, payout date, and settlement status.
                </p>
              </div>

              <button
                onClick={() => setViewMode("marketplace")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E6BF3]/10 hover:bg-[#1E6BF3]/20 border border-[#1E6BF3]/30 text-[#1E6BF3] rounded-xl text-xs font-bold transition-all"
              >
                <PlusCircle size={15} />
                <span>Add New Investment</span>
              </button>
            </div>

            {activeInvestments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeInvestments.map((holding) => (
                  <div
                    key={holding.id}
                    className="bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-5 hover:border-[#1E6BF3]/40 transition-all"
                  >
                    {/* CARD TOP BAR */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#09172c] border border-slate-800 flex items-center justify-center font-bold text-sm text-[#1E6BF3]">
                          {holding.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">{holding.name}</h3>
                          <span className="text-xs text-slate-400 uppercase font-medium">
                            {holding.symbol} · {holding.category} · Started {holding.startDate}
                          </span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1 ${holding.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : holding.status === "Matured" ? "bg-blue-500/10 text-blue-300 border-blue-500/20" : "bg-amber-500/10 text-amber-300 border-amber-500/20"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${holding.status === "Active" ? "bg-emerald-400 animate-pulse" : holding.status === "Matured" ? "bg-blue-300" : "bg-amber-300"}`} />
                        {holding.status}
                      </span>
                    </div>

                    {/* FINANCIAL HIGHLIGHTS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#09172c] border border-slate-800/80 p-4 rounded-xl text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Initial Invested</span>
                        <span className="text-sm font-bold text-white">{money(holding.investedAmount)}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Current Value</span>
                        <span className="text-sm font-bold text-white">{money(holding.currentValue)}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">Expected payout</span>
                        <span className="text-sm font-bold text-white">{money(holding.payoutAmount)}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">{holding.status === "Matured" ? "Realized profit" : "Projected profit"}</span>
                        <span className="text-sm font-bold text-emerald-400">{money(holding.totalProfit)} ({holding.profitPercentage.toFixed(2)}%)</span>
                      </div>
                    </div>

                    {/* PAYOUT DETAILS & ACTIONS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={15} className="text-[#F3B233]" />
                        <span>{holding.status === "Matured" ? "Paid out" : "Payout date"}: <strong className="text-white">{holding.status === "Matured" && holding.paidOutAt ? new Date(holding.paidOutAt).toLocaleDateString() : holding.nextPayoutDate}</strong></span>
                      </div>
                      <span className="text-[11px] text-slate-400">{holding.yieldPercent}% {holding.yieldType} yield</span>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            const foundAsset = assets.find((asset) => asset.id === holding.assetId);
                            if (foundAsset) {
                              setSelectedAsset(foundAsset);
                              setInvestAmount(foundAsset.minInvestment.toString());
                              setSubmissionError("");
                            }
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#1E6BF3] hover:bg-[#1859cc] text-white rounded-xl font-bold text-xs shadow-md shadow-[#1E6BF3]/20 transition-all"
                        >
                          Top Up
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
                <Briefcase size={36} className="mx-auto text-slate-500" />
                <h3 className="text-base font-bold text-white">No Active Investments Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven&apos;t invested in any vaults yet. Browse our high-yielding opportunities to get started.
                </p>
                <button
                  onClick={() => setViewMode("marketplace")}
                  className="px-5 py-2.5 bg-[#1E6BF3] text-xs font-bold text-white rounded-xl shadow-lg shadow-[#1E6BF3]/30"
                >
                  Explore Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: EXPLORE MARKETPLACE (NEW INVESTMENTS) */}
        {viewMode === "marketplace" && (
          <div className="space-y-6">
            {/* CATEGORY & FILTER TOOLBAR */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/25 ring-1 ring-[#1E6BF3]"
                          : "bg-[#061224] text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800/40"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* SEARCH & SORT */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#061224] border border-slate-800/80 p-3 rounded-2xl">
                <div className="relative w-full sm:w-80">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Crypto, Gold, REITs, ETFs..."
                    className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                    <Filter size={14} /> Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "popular" | "apy" | "price")}
                    className="bg-[#09172c] border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#1E6BF3] cursor-pointer"
                  >
                    <option value="popular">Popularity</option>
                    <option value="apy">Highest yield</option>
                    <option value="price">Asset Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MARKETPLACE GRID */}
            {filteredMarketAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarketAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group bg-[#061224] hover:bg-[#07172e] border border-slate-800/80 hover:border-[#1E6BF3]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#1E6BF3]/5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#09172c] border border-slate-800 flex items-center justify-center font-bold text-xs text-[#1E6BF3]">
                            {asset.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-[#1E6BF3] transition-colors">
                              {asset.name}
                            </h3>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {asset.symbol} · {asset.category}
                            </span>
                          </div>
                        </div>

                        {asset.badge && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3B233]/10 text-[#F3B233] border border-[#F3B233]/20">
                            {asset.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {asset.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {asset.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/50 text-slate-300 border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-800/60 pt-4 mt-2 space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Unit Price</span>
                          <span className="font-bold text-white">{asset.priceDisplay}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Expected Yield</span>
                          <span className="font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                            {asset.yieldPercent}% {asset.yieldType} <TrendingUp size={12} />
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                        <span>Min. entry: <strong className="text-slate-200">{money(asset.minInvestment)}</strong></span>
                        <span className="text-right">24h: <strong className={asset.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>{asset.change24h >= 0 ? "+" : ""}{asset.change24h}%</strong></span>
                        <span>Expected total payout at minimum (includes capital): <strong className="text-white">{money(asset.expectedReturns)}</strong></span>
                        <span className="text-right">Risk: <strong className={asset.riskLevel === "Low" ? "text-emerald-400" : asset.riskLevel === "Medium" ? "text-amber-400" : "text-red-400"}>{asset.riskLevel}</strong></span>
                        <span className="col-span-2">{payoutSchedule(asset)}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setInvestAmount(asset.minInvestment.toString());
                          setSubmissionError("");
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#1E6BF3] hover:bg-[#1859cc] text-white shadow-md shadow-[#1E6BF3]/20 transition-all"
                      >
                        <span>Invest Now</span>
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
                <Info size={32} className="mx-auto text-slate-500" />
                <h3 className="text-base font-bold text-white">No Investment Vaults Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  We couldn&apos;t find any assets matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-slate-800 text-xs text-white rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT / INVESTMENT MODAL */}
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#061224] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl space-y-5">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setSubmissionError("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#09172c] border border-slate-800 flex items-center justify-center font-bold text-sm text-[#1E6BF3]">
                  {selectedAsset.symbol.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAsset.name}</h3>
                  <span className="text-xs text-slate-400">Expected yield: <strong className="text-emerald-400">{selectedAsset.yieldPercent}% {selectedAsset.yieldType}</strong></span>
                </div>
              </div>

              {isSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-400 animate-bounce" />
                  <h4 className="text-lg font-bold text-white">Investment Confirmed!</h4>
                  <p className="text-xs text-slate-400">
                    You have successfully invested <strong>${investAmount}</strong> in {selectedAsset.name}. Redirecting to your active holdings...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmInvestment} className="space-y-4">
                  <div className="bg-[#09172c] border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Available Balance:</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <Wallet size={12} /> ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                      </span>
                    </div>

                    {submissionError && (
                      <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                        {submissionError}
                      </p>
                    )}

                    <label className="block">
                      <span className="text-[11px] text-slate-400 font-medium block mb-1">
                        Investment Amount (USD)
                      </span>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          min={selectedAsset.minInvestment}
                          step="any"
                          value={investAmount}
                          onChange={(e) => {
                            setInvestAmount(e.target.value);
                            setSubmissionError("");
                          }}
                          required
                          className="w-full bg-[#061224] border border-slate-800 rounded-xl pl-8 pr-16 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#1E6BF3]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setInvestAmount(selectedAsset.minInvestment.toString());
                            setSubmissionError("");
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1E6BF3] hover:underline"
                        >
                          Minimum
                        </button>
                      </div>
                    </label>

                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Minimum required: ${selectedAsset.minInvestment}</span>
                      <span>Estimated payout: <strong className="text-emerald-400">{money(estimatedPayout(selectedAsset, toFiniteNumber(investAmount)))}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Projected profit</span>
                      <span className="text-emerald-400 font-semibold">{money(estimatedPayout(selectedAsset, toFiniteNumber(investAmount)) - toFiniteNumber(investAmount))}</span>
                    </div>
                    <div className="flex justify-between text-slate-400"><span>Payout schedule</span><span className="text-white">{payoutSchedule(selectedAsset)}</span></div>
                    <div className="flex justify-between text-slate-400">
                      <span>Risk Profile</span>
                      <span className="text-white">{selectedAsset.riskLevel}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#1E6BF3] hover:bg-[#1859cc] text-white font-bold text-xs shadow-lg shadow-[#1E6BF3]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirm Investment</span>
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


// Ok now using the pattern we have been working with for the backend, I want you to create the backend controllers, routes, models, middleware, authentications and all that is needed to make sure that the data from for the frontend, aligns and is controlled with the backend instead of just being hard-coded;

// you can create all the needed files and folders but at the end the front end datas should all be generated from the vicbits-backend and all stoed in the mongoose database