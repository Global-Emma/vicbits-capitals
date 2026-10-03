"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShieldCheck,
  Search,
  Filter,
  PlusCircle,
  ArrowRightLeft,
  Download,
  Coins,
  Building2,
  Gem,
  BarChart3,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/Sidebar";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

// Asset Category Type
type CategoryType = "crypto" | "realestate" | "gold" | "etfs" | "nfts" | "cash";

// Single Portfolio Asset Holding Interface
export interface PortfolioHolding {
  id: string;
  name: string;
  symbol: string;
  category: CategoryType;
  unitsHeld: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedProfit: number;
  profitPercentage: number;
  change24h: number;
  allocationPercentage: number;
}

// Activity / Transaction Log Interface
export interface ActivityItem {
  id: string;
  type: "Buy" | "Deposit" | "Yield Payout" | "Rebalance";
  assetName: string;
  amount: string;
  valueUsd: number;
  date: string;
  status: "Completed" | "Pending";
}

// CATEGORIES CONFIG
const CATEGORY_MAP = {
  all: { name: "All Assets", icon: Layers, color: "text-[#1E6BF3]" },
  crypto: { name: "Crypto", icon: Coins, color: "text-amber-400" },
  realestate: { name: "Real Estate", icon: Building2, color: "text-blue-400" },
  gold: { name: "Gold & Metals", icon: Gem, color: "text-[#F3B233]" },
  etfs: { name: "ETFs & Stocks", icon: BarChart3, color: "text-purple-400" },
  nfts: { name: "NFT Pass", icon: Zap, color: "text-pink-400" },
  cash: { name: "Liquid Cash", icon: Wallet, color: "text-emerald-400" },
};

export default function PortfolioPage() {
  const router = useRouter();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"value" | "profit" | "name">("value");

  useEffect(() => {
    api.get("/api/portal/portfolio").then(({ data }) => {
      setHoldings(data.data.holdings);
      setActivities(data.data.activities.map((item: { id: string; eventType: string; description: string; amount: number; date: string; status: string; type: string }) => ({
        id: item.id,
        type: item.eventType === "investment" ? "Buy" : item.eventType === "deposit" ? "Deposit" : "Rebalance",
        assetName: item.description,
        amount: `${item.type === "Income" ? "+" : "-"}$${item.amount.toFixed(2)} USD`,
        valueUsd: item.amount,
        date: new Date(item.date).toLocaleDateString(),
        status: item.status === "Completed" ? "Completed" : "Pending",
      })));
    }).catch((error) => console.error("Could not load portfolio:", error));
  }, []);

  // Calculated Portfolio Summary Numbers
  const summary = useMemo(() => {
    const totalNetWorth = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalProfit = holdings.reduce((sum, h) => sum + h.unrealizedProfit, 0);
    const initialCostBasis = totalNetWorth - totalProfit;
    const allTimeProfitPercent = initialCostBasis > 0 ? (totalProfit / initialCostBasis) * 100 : 0;

    const liquidCash = holdings.find((h) => h.category === "cash")?.totalValue || 0;
    const investedCapital = totalNetWorth - liquidCash;

    // Daily Gain weighted average estimate
    const dailyGainUsd = holdings.reduce(
      (sum, h) => sum + (h.totalValue * h.change24h) / 100,
      0
    );
    const dailyGainPercent = totalNetWorth > 0 ? (dailyGainUsd / totalNetWorth) * 100 : 0;

    return {
      totalNetWorth,
      totalProfit,
      allTimeProfitPercent,
      liquidCash,
      investedCapital,
      dailyGainUsd,
      dailyGainPercent,
    };
  }, [holdings]);

  // Asset Allocation Distribution Calculation
  const allocationBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    holdings.forEach((h) => {
      categories[h.category] = (categories[h.category] || 0) + h.totalValue;
    });

    return Object.entries(categories).map(([catKey, value]) => {
      const percentage = (value / summary.totalNetWorth) * 100;
      return {
        key: catKey,
        name: CATEGORY_MAP[catKey as CategoryType]?.name || catKey,
        value,
        percentage,
      };
    }).sort((a, b) => b.value - a.value);
  }, [holdings, summary.totalNetWorth]);

  // Filtered Holdings
  const filteredHoldings = useMemo(() => {
    return holdings
      .filter((h) => {
        const matchesCat = selectedCategory === "all" || h.category === selectedCategory;
        const matchesSearch =
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "value") return b.totalValue - a.totalValue;
        if (sortBy === "profit") return b.profitPercentage - a.profitPercentage;
        return a.name.localeCompare(b.name);
      });
  }, [holdings, selectedCategory, searchQuery, sortBy]);

  return (
    <DashboardLayout defaultTab="Portfolio">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E6BF3] mb-1">
              <ShieldCheck size={16} />
              <span>Verified Institutional Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Portfolio & Wealth Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time multi-asset valuation, allocation balance, and risk profile insights.
            </p>
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/user-dashboard/deposit")} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E6BF3] hover:bg-[#1859cc] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#1E6BF3]/25 transition-all">
              <PlusCircle size={15} />
              <span>Deposit Funds</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#061224] hover:bg-slate-800 border border-slate-800/80 text-slate-200 rounded-xl text-xs font-bold transition-all">
              <ArrowRightLeft size={15} className="text-[#F3B233]" />
              <span>Rebalance</span>
            </button>
            <button className="p-2.5 bg-[#061224] hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white rounded-xl text-xs transition-all">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* TOP METRICS & NET WORTH OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* NET WORTH CARD */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Total Net Worth</span>
              <Wallet size={16} className="text-[#1E6BF3]" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${summary.totalNetWorth.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-xs pt-1">
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  summary.dailyGainPercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {summary.dailyGainPercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(summary.dailyGainPercent).toFixed(2)}%
              </span>
              <span className="text-slate-500">24h Gain</span>
            </div>
          </div>

          {/* ALL TIME EARNINGS */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">All-Time Net Profit</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              +${summary.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                +{summary.allTimeProfitPercent.toFixed(2)}%
              </span>
              <span>Overall Portfolio ROI</span>
            </div>
          </div>

          {/* CAPITAL ALLOCATED */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Invested Capital</span>
              <Building2 size={16} className="text-[#F3B233]" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${summary.investedCapital.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 pt-1">
              Allocated in 5 Yield-Bearing Vaults
            </div>
          </div>

          {/* LIQUID CASH */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Uninvested Cash</span>
              <DollarSign size={16} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${summary.liquidCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Ready for investment</span>
              <button className="text-[#1E6BF3] font-bold text-[11px] hover:underline">Deploy</button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: PERFORMANCE CHART + ASSET ALLOCATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PERFORMANCE HISTORICAL ANALYTICS */}
          <div className="lg:col-span-2 bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-[#1E6BF3]" />
                  <span>Current Portfolio Value</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Investment positions and available cash stored in your account
                </p>
              </div>

            </div>

            <div className="min-h-48 w-full bg-[#09172c] border border-slate-800/80 rounded-xl p-6 flex flex-col justify-center">
              <p className="text-3xl font-extrabold text-white">${summary.totalNetWorth.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              <p className="mt-2 text-xs text-slate-400">Historical valuation points will appear after they are recorded.</p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-400">Invested</span><p className="mt-1 font-bold text-white">${summary.investedCapital.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p></div>
                <div><span className="text-slate-400">Unrealized return</span><p className="mt-1 font-bold text-emerald-400">${summary.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p></div>
              </div>
            </div>

          </div>

          {/* ASSET ALLOCATION BREAKDOWN */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieIcon size={18} className="text-[#F3B233]" />
                  <span>Asset Allocation</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">{allocationBreakdown.length} categories</span>
              </div>

              {/* PROGRESS BAR BANDS */}
              <div className="space-y-3">
                {allocationBreakdown.map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-white font-bold">
                        ${item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#09172c] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E6BF3] rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor:
                            item.key === "crypto"
                              ? "#F59E0B"
                              : item.key === "gold"
                              ? "#F3B233"
                              : item.key === "realestate"
                              ? "#3B82F6"
                              : item.key === "etfs"
                              ? "#A855F7"
                              : item.key === "nfts"
                              ? "#EC4899"
                              : "#10B981",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#09172c] border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-400">
              <Sparkles size={18} className="text-[#F3B233] shrink-0" />
              <span>
                Your portfolio is well-balanced across hard assets, digital currencies, and equities.
              </span>
            </div>
          </div>
        </div>

        {/* DETAILED HOLDINGS TABLE & ACTIVITY TABS */}
        <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          {/* TOOLBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h3 className="text-lg font-bold text-white">Your Asset Holdings</h3>
              <p className="text-xs text-slate-400">
                Detailed listing of all positions, entry prices, live market values, and ROI.
              </p>
            </div>

            {/* CATEGORY FILTER BUTTONS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Object.entries(CATEGORY_MAP).map(([key, config]) => {
                const Icon = config.icon;
                const isActive = selectedCategory === key;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#1E6BF3] text-white shadow-md shadow-[#1E6BF3]/20"
                        : "bg-[#09172c] text-slate-400 hover:text-white border border-slate-800/80"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-white" : config.color} />
                    <span>{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEARCH & SORT BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search holding name or symbol..."
                className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Filter size={13} /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "value" | "profit" | "name")}
                className="bg-[#09172c] border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#1E6BF3]"
              >
                <option value="value">Highest Total Value</option>
                <option value="profit">Highest Return (% P&L)</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* HOLDINGS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Holdings / Balance</th>
                  <th className="py-3 px-4">Avg Buy Price</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">24h Change</th>
                  <th className="py-3 px-4">Unrealized P&L</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredHoldings.length > 0 ? (
                  filteredHoldings.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#09172c]/60 transition-colors group"
                    >
                      {/* ASSET NAME */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#09172c] border border-slate-800 flex items-center justify-center font-bold text-xs text-[#1E6BF3]">
                            {item.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#1E6BF3] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">
                              {item.symbol} • {item.allocationPercentage}% of portfolio
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* UNITS HELD */}
                      <td className="py-4 px-4 font-semibold text-white">
                        {item.unitsHeld.toLocaleString()} {item.symbol}
                      </td>

                      {/* AVG BUY PRICE */}
                      <td className="py-4 px-4 text-slate-300">
                        ${item.avgBuyPrice.toLocaleString()}
                      </td>

                      {/* CURRENT PRICE */}
                      <td className="py-4 px-4 font-semibold text-white">
                        ${item.currentPrice.toLocaleString()}
                      </td>

                      {/* TOTAL VALUE */}
                      <td className="py-4 px-4 font-extrabold text-white">
                        ${item.totalValue.toLocaleString()}
                      </td>

                      {/* 24H CHANGE */}
                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold flex items-center gap-0.5 ${
                            item.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {item.change24h >= 0 ? "+" : ""}
                          {item.change24h}%
                        </span>
                      </td>

                      {/* UNREALIZED P&L */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-emerald-400">
                          +${item.unrealizedProfit.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-emerald-400/80 font-semibold">
                          (+{item.profitPercentage}%)
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="py-4 px-4 text-right">
                        <button className="px-3 py-1.5 bg-[#09172c] hover:bg-[#1E6BF3] border border-slate-800 hover:border-[#1E6BF3] text-slate-300 hover:text-white rounded-lg font-bold text-[11px] transition-all">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No asset holdings found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: RECENT ACTIVITY & AUDIT TRAIL */}
        <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-[#1E6BF3]" />
                <span>Recent Portfolio Transactions</span>
              </h3>
              <p className="text-xs text-slate-400">Audit trail of asset purchases, deposits, and automated yield payouts.</p>
            </div>
            <button className="text-xs text-[#1E6BF3] font-bold hover:underline flex items-center gap-1">
              <span>View Full History</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between bg-[#09172c] border border-slate-800/80 rounded-xl p-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#061224] border border-slate-800 flex items-center justify-center text-[#1E6BF3]">
                    {act.type === "Yield Payout" && <Coins size={15} className="text-emerald-400" />}
                    {act.type === "Buy" && <ArrowUpRight size={15} className="text-[#1E6BF3]" />}
                    {act.type === "Deposit" && <Wallet size={15} className="text-[#F3B233]" />}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{act.assetName}</span>
                    <span className="text-[10px] text-slate-400">{act.type} • {act.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-400 block">{act.amount}</span>
                  <span className="text-[10px] text-slate-400">
                    Status: <strong className="text-emerald-400">{act.status}</strong>
                  </span>
                </div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-xs text-slate-400">No portfolio activity yet.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}