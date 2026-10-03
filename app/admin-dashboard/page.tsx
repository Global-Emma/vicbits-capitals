"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  History,
  Layers,
  Settings,
  FileText,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Bell,
  UserCheck,
  Wallet,
  ShieldAlert,
  Coins,
  ChevronRight,
} from "lucide-react";
import { isAxiosError } from "axios";
import api from "@/utils/axios";
import { useApp } from "@/utils/useApp";

// Types
interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Growth" | "Premium";
  status: "Active" | "Inactive" | "Pending";
}

interface PendingRequest {
  id: string;
  user: string;
  amount: number;
  asset: string;
  status: string;
  eventType: "deposit" | "withdrawal";
  reference: string;
  paymentMethod?: string;
}

interface AdminOverview {
  metrics: { totalUsers: number; totalDeposits: number; totalWithdrawals: number; activeInvestments: number };
  recentUsers: UserRecord[];
  pendingRequests: PendingRequest[];
}

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function VicbitsAdminDashboard() {
  const { user, logout, loading } = useApp();
  const router = useRouter();
  const activeTab = "Admin Dashboard";
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!loading && user?.role !== "admin") router.replace("/user-dashboard");
  }, [loading, router, user?.role]);

  useEffect(() => {
    api.get("/api/portal/admin/overview")
      .then(({ data }) => setOverview(data.data))
      .catch((error) => console.error("Could not load admin overview:", error));
  }, []);

  const reviewRequest = async (id: string, status: "Completed" | "Failed") => {
    setReviewError("");
    try {
      await api.patch(`/api/portal/requests/${id}/status`, { status });
      const { data } = await api.get("/api/portal/admin/overview");
      setOverview(data.data);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.error || error.message
        : error instanceof Error ? error.message : "Unknown error";
      console.error("Could not review request:", message, error);
      setReviewError(`Could not review this request: ${message}`);
    }
  };

  const navItems = [
    { name: "Admin Dashboard", icon: LayoutDashboard, href: "/admin-dashboard" },
    { name: "Users", icon: Users, href: "/admin-dashboard/users" },
    { name: "Deposits", icon: ArrowDownLeft, href: "/admin-dashboard/deposits" },
    { name: "Withdrawals", icon: ArrowUpRight, href: "/admin-dashboard/withdrawals" },
    { name: "Investments", icon: TrendingUp, href: "/admin-dashboard/investments" },
    { name: "Transactions", icon: History, href: "/admin-dashboard/transactions" },
    { name: "Plans", icon: Layers, href: "/admin-dashboard/plans" },
    { name: "Settings", icon: Settings, href: "/admin-dashboard/settings" },
    { name: "Reports", icon: FileText, href: "/admin-dashboard/reports" },
  ];

  const metrics = [
    {
      title: "Total Users",
      value: (overview?.metrics.totalUsers || 0).toLocaleString(),
      change: "",
      isPositive: true,
      icon: UserCheck,
      iconBg: "bg-blue-500/15 text-blue-400",
    },
    {
      title: "Total Deposits",
      value: `$${(overview?.metrics.totalDeposits || 0).toLocaleString()}`,
      change: "",
      isPositive: true,
      icon: Wallet,
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
      title: "Total Withdrawals",
      value: `$${(overview?.metrics.totalWithdrawals || 0).toLocaleString()}`,
      change: "",
      isPositive: true,
      icon: ShieldAlert,
      iconBg: "bg-indigo-500/15 text-indigo-400",
    },
    {
      title: "Active Investments",
      value: (overview?.metrics.activeInvestments || 0).toLocaleString(),
      change: "",
      isPositive: true,
      icon: Coins,
      iconBg: "bg-amber-500/15 text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040B18] text-slate-100 flex font-sans antialiased selection:bg-[#F3B233] selection:text-slate-950">
      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#061224] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* BRAND LOGO */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/60">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="VicBits Capitals"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* NAV ITEMS */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    router.push(item.href);
                  }}
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

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-800/60">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-xl transition-colors">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 border-b border-slate-800/80 bg-[#061224]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2"
            >
              <Menu size={22} />
            </button>

            {/* Global Search */}
            <div className="relative w-64 sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything..."
                className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3] transition-colors"
              />
            </div>
          </div>

          {/* Admin Profile Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-[#09172c] border border-slate-800 text-slate-300 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F3B233]" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-800/80">
              <div
                aria-label="Admin Profile"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80')",
                }}
                className="w-9 h-9 rounded-full bg-cover bg-center border border-[#F3B233]"
              />
              <div className="hidden sm:block text-left">
                <h2 className="text-xs font-bold text-white leading-snug">
                  {user?.firstName || "Admin"}
                </h2>
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  {user?.role === "admin" ? "Administrator" : ""}
                  <ChevronDown size={12} className="text-slate-500" />
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* TITLE & TIMEFRAME FILTER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage users, investments and platform activities.
              </p>
            </div>

            {/* Time Filter Dropdown */}
            <div className="relative inline-block text-left self-start sm:self-auto">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-[#09172c] border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:border-[#1E6BF3] cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* 4 METRIC OVERVIEW CARDS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${m.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">
                      {m.title}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mt-0.5">
                      {m.value}
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-400 inline-block mt-0.5">
                      {m.change}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

            {/* TABLES SECTION: RECENT USERS & PENDING REQUESTS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* RECENT USERS TABLE (Col 6) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <h3 className="text-sm font-bold text-white">Recent Users</h3>
                  <button onClick={() => router.push("/admin-dashboard/users")} className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                    <span>View All</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-800/60">
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Email</th>
                        <th className="py-3 px-2">Plan</th>
                        <th className="py-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {(overview?.recentUsers || []).map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3.5 px-2 font-bold text-white">
                            {user.name}
                          </td>
                          <td className="py-3.5 px-2 text-slate-400">
                            {user.email}
                          </td>
                          <td className="py-3.5 px-2 font-medium text-slate-300">
                            {user.plan}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block">
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-center">
                <button onClick={() => router.push("/admin-dashboard/users")} className="text-xs font-bold text-[#1E6BF3] hover:underline">
                  View All
                </button>
              </div>
            </motion.div>

            {/* PENDING DEPOSITS TABLE (Col 6) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-6 bg-[#09172c]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                    <h3 className="text-sm font-bold text-white">
                    Pending Requests
                  </h3>
                  <button onClick={() => router.push("/admin-dashboard/deposits")} className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                    <span>View All</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                {reviewError && (
                  <p role="alert" className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                    {reviewError}
                  </p>
                )}

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-800/60">
                        <th className="py-3 px-2">User</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2">Asset</th>
                        <th className="py-3 px-2 text-right">Status</th>
                        <th className="py-3 px-2 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {(overview?.pendingRequests || []).map((dep) => (
                        <tr
                          key={dep.id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3.5 px-2 font-bold text-white">
                            {dep.user}
                          </td>
                          <td className="py-3.5 px-2 font-bold text-slate-200">
                            ${dep.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-2 text-slate-400 font-semibold">
                            {dep.eventType === "deposit" ? dep.asset : dep.paymentMethod || "Withdrawal"}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                                dep.status === "Completed"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {dep.eventType} · {dep.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex cursor-pointer justify-end gap-2">
                              <button onClick={() => reviewRequest(dep.id, "Completed")} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300">Approve</button>
                              <button onClick={() => reviewRequest(dep.id, "Failed")} className="text-[10px] cursor-pointer font-bold text-rose-400 hover:text-rose-300">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-center">
                <button onClick={() => router.push("/admin-dashboard/deposits")} className="text-xs font-bold text-[#1E6BF3] hover:underline">
                  View All
                </button>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}