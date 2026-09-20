"use client";

import React, { useState } from "react";
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

// Types
interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Growth" | "Premium";
  status: "Active" | "Inactive" | "Pending";
}

interface DepositRecord {
  id: string;
  user: string;
  amount: string;
  asset: "BTC" | "USDT" | "ETH";
  status: "Confirming" | "Pending" | "Completed";
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
  const [activeTab, setActiveTab] = useState("Admin Dashboard");
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navItems = [
    { name: "Admin Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Deposits", icon: ArrowDownLeft },
    { name: "Withdrawals", icon: ArrowUpRight },
    { name: "Investments", icon: TrendingUp },
    { name: "Transactions", icon: History },
    { name: "Plans", icon: Layers },
    { name: "Settings", icon: Settings },
    { name: "Reports", icon: FileText },
  ];

  // Data matching the uploaded UI screenshot
  const recentUsers: UserRecord[] = [
    { id: "1", name: "John Doe", email: "john@example.com", plan: "Premium", status: "Active" },
    { id: "2", name: "Sarah Okafor", email: "sarah@gmail.com", plan: "Growth", status: "Active" },
    { id: "3", name: "Michael Brown", email: "mike@gmail.com", plan: "Starter", status: "Active" },
    { id: "4", name: "Emeka Nwa", email: "emeka@gmail.com", plan: "Growth", status: "Active" },
    { id: "5", name: "Blessing Uche", email: "blessing@gmail.com", plan: "Premium", status: "Active" },
  ];

  const pendingDeposits: DepositRecord[] = [
    { id: "d1", user: "David K", amount: "$500", asset: "BTC", status: "Confirming" },
    { id: "d2", user: "Chiemeka A", amount: "$1,000", asset: "USDT", status: "Pending" },
    { id: "d3", user: "Peter S", amount: "$250", asset: "ETH", status: "Pending" },
    { id: "d4", user: "Ngozi E", amount: "$750", asset: "BTC", status: "Pending" },
    { id: "d5", user: "James T", amount: "$300", asset: "USDT", status: "Confirming" },
  ];

  const metrics = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12%",
      isPositive: true,
      icon: UserCheck,
      iconBg: "bg-blue-500/15 text-blue-400",
    },
    {
      title: "Total Deposits",
      value: "$25,430",
      change: "+8.4%",
      isPositive: true,
      icon: Wallet,
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
      title: "Total Withdrawals",
      value: "$12,180",
      change: "+15.2%",
      isPositive: true,
      icon: ShieldAlert,
      iconBg: "bg-indigo-500/15 text-indigo-400",
    },
    {
      title: "Active Investments",
      value: "892",
      change: "+12.5%",
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

          {/* NAV ITEMS */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileSidebarOpen(false);
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-xl transition-colors">
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
                  Admin
                </h2>
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  Super Admin
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

          {/* TABLES SECTION: RECENT USERS & PENDING DEPOSITS */}
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
                  <button className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
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
                      {recentUsers.map((user) => (
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
                <button className="text-xs font-bold text-[#1E6BF3] hover:underline">
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
                    Pending Deposits
                  </h3>
                  <button className="text-[11px] font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                    <span>View All</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-semibold border-b border-slate-800/60">
                        <th className="py-3 px-2">User</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2">Asset</th>
                        <th className="py-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {pendingDeposits.map((dep) => (
                        <tr
                          key={dep.id}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3.5 px-2 font-bold text-white">
                            {dep.user}
                          </td>
                          <td className="py-3.5 px-2 font-bold text-slate-200">
                            {dep.amount}
                          </td>
                          <td className="py-3.5 px-2 text-slate-400 font-semibold">
                            {dep.asset}
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                                dep.status === "Confirming"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {dep.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-center">
                <button className="text-xs font-bold text-[#1E6BF3] hover:underline">
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