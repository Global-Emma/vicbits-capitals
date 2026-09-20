"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Briefcase,
  User,
  HelpCircle,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Eye,
  CheckCircle2,
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  Building2,
  Sparkles,
} from "lucide-react";

// Types
type TransactionType =
  | "Deposit (BTC)"
  | "Investment (Real Estate)"
  | "Return"
  | "Investment (Gold)"
  | "Withdrawal"
  | "Deposit (USDT)";

type TransactionStatus = "Confirmed" | "Completed" | "Pending" | "Credited";

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: "deposit" | "investment" | "return" | "withdrawal";
  amount: number; // positive for credit, negative for debit
  status: TransactionStatus;
  txHash?: string;
  reference: string;
  fee: string;
}

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function VicBitsTransactionHistory() {
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTxModal, setActiveTxModal] = useState<Transaction | null>(null);

  // Exact data pre-populated from your screenshot
  const transactions: Transaction[] = [
    {
      id: "tx-101",
      date: "Apr 18, 2026",
      type: "Deposit (BTC)",
      category: "deposit",
      amount: 1000.0,
      status: "Confirmed",
      txHash: "0x8f2d...9a12",
      reference: "DEP-20260418-01",
      fee: "$0.00",
    },
    {
      id: "tx-102",
      date: "Apr 15, 2026",
      type: "Investment (Real Estate)",
      category: "investment",
      amount: -2500.0,
      status: "Completed",
      reference: "INV-20260415-88",
      fee: "$0.00",
    },
    {
      id: "tx-103",
      date: "Apr 12, 2026",
      type: "Return",
      category: "return",
      amount: 180.0,
      status: "Credited",
      reference: "RET-20260412-04",
      fee: "$0.00",
    },
    {
      id: "tx-104",
      date: "Apr 10, 2026",
      type: "Investment (Gold)",
      category: "investment",
      amount: -1500.0,
      status: "Completed",
      reference: "INV-20260410-12",
      fee: "$0.00",
    },
    {
      id: "tx-105",
      date: "Apr 8, 2026",
      type: "Withdrawal",
      category: "withdrawal",
      amount: -850.0,
      status: "Pending",
      txHash: "0x1b4c...e770",
      reference: "WTH-20260408-09",
      fee: "$2.50",
    },
    {
      id: "tx-106",
      date: "Apr 5, 2026",
      type: "Deposit (USDT)",
      category: "deposit",
      amount: 1000.0,
      status: "Confirmed",
      txHash: "0x3e9a...f411",
      reference: "DEP-20260405-02",
      fee: "$0.00",
    },
  ];

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filter by type
      if (
        selectedType !== "All Types" &&
        !tx.type.toLowerCase().includes(selectedType.toLowerCase())
      ) {
        return false;
      }
      // Filter by status
      if (selectedStatus !== "All Statuses" && tx.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [transactions, selectedType, selectedStatus]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Investments", icon: TrendingUp },
    { name: "Deposits", icon: ArrowDownLeft },
    { name: "Withdrawals", icon: ArrowUpRight },
    { name: "Transactions", icon: History, active: true },
    { name: "Portfolio", icon: Briefcase },
    { name: "Profile", icon: User },
    { name: "Support", icon: HelpCircle },
  ];

  // Helper to render type icons matching the image style
  const renderTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "Deposit (BTC)":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Coins size={16} />
          </div>
        );
      case "Investment (Real Estate)":
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>
        );
      case "Return":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
        );
      case "Investment (Gold)":
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center justify-center shrink-0">
            <Coins size={16} />
          </div>
        );
      case "Withdrawal":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ArrowUpCircle size={16} />
          </div>
        );
      case "Deposit (USDT)":
        return (
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
            <ArrowDownCircle size={16} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
            <History size={16} />
          </div>
        );
    }
  };

  // Helper to render status badges
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
      case "Credited":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
            <CheckCircle2 size={10} />
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
            <Clock size={10} />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#040B18] text-slate-100 flex font-sans antialiased selection:bg-[#1E6BF3] selection:text-white">
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

      {/* LEFT SIDEBAR */}
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

          {/* SIDEBAR NAVIGATION */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    item.active
                      ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon size={18} className={item.active ? "text-white" : "text-slate-400"} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE HEADER BAR */}
        <div className="lg:hidden h-16 border-b border-slate-800/80 bg-[#061224] px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-slate-400 hover:text-white p-2"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-sm font-bold text-white">VicBits Capitals</h1>
          </div>
        </div>

        {/* PAGE CONTENT BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">
          {/* PAGE TITLE & SUBTITLE */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Transaction History
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track all your deposits, investments, withdrawals and more.
            </p>
          </div>

          {/* FILTERS & EXPORT CONTROL BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#09172c] border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1E6BF3] cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Deposit">Deposits</option>
                <option value="Investment">Investments</option>
                <option value="Return">Returns</option>
                <option value="Withdrawal">Withdrawals</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#09172c] border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1E6BF3] cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Credited">Credited</option>
                <option value="Pending">Pending</option>
              </select>

              {/* Date Range Selector Pill */}
              <div className="bg-[#09172c] border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-4 py-2.5 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>Apr 1, 2026 - Apr 18, 2026</span>
              </div>
            </div>

            {/* Export Button */}
            <button className="bg-[#09172c] border border-slate-800 hover:border-[#1E6BF3] text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm self-start md:self-auto">
              <Download size={14} className="text-slate-400" />
              <span>Export</span>
            </button>
          </div>

          {/* MAIN TRANSACTIONS TABLE */}
          <div className="bg-[#09172c]/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-800/80 bg-[#061224]/50">
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-right">Details</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-slate-800/40"
                >
                  {filteredTransactions.map((tx) => {
                    const isCredit = tx.amount > 0;
                    const formattedAmount = `${isCredit ? "+" : ""}$${Math.abs(
                      tx.amount
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`;

                    return (
                      <motion.tr
                        key={tx.id}
                        variants={rowVariants}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Date Column */}
                        <td className="py-4 px-5 text-slate-300 font-medium whitespace-nowrap">
                          {tx.date}
                        </td>

                        {/* Type Column */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {renderTypeIcon(tx.type)}
                            <span className="font-bold text-white">
                              {tx.type}
                            </span>
                          </div>
                        </td>

                        {/* Amount Column */}
                        <td
                          className={`py-4 px-5 font-extrabold whitespace-nowrap ${
                            isCredit ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {formattedAmount}
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          {renderStatusBadge(tx.status)}
                        </td>

                        {/* Details Action Button Column */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setActiveTxModal(tx)}
                            className="bg-[#1E6BF3]/10 hover:bg-[#1E6BF3] text-[#1E6BF3] hover:text-white border border-[#1E6BF3]/30 px-4 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-center gap-2 bg-[#061224]/30">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-[#09172c] border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-[#1E6BF3] text-white shadow-md shadow-[#1E6BF3]/30"
                      : "bg-[#09172c] border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                disabled={currentPage === 5}
                className="w-8 h-8 rounded-lg bg-[#09172c] border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      <AnimatePresence>
        {activeTxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveTxModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#061224] border border-slate-800 rounded-2xl p-6 w-full max-w-md z-10 shadow-2xl text-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <h3 className="text-base font-bold text-white">
                  Transaction Details
                </h3>
                <button
                  onClick={() => setActiveTxModal(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-6 space-y-4 text-xs">
                <div className="text-center pb-4 border-b border-slate-800/40">
                  <span className="text-slate-400 block mb-1">
                    Total Amount
                  </span>
                  <span
                    className={`text-3xl font-extrabold ${
                      activeTxModal.amount > 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {activeTxModal.amount > 0 ? "+" : ""}$
                    {Math.abs(activeTxModal.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Type</span>
                  <span className="font-bold text-white">
                    {activeTxModal.type}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status</span>
                  <div>{renderStatusBadge(activeTxModal.status)}</div>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Date</span>
                  <span className="font-medium text-slate-200">
                    {activeTxModal.date}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Reference ID</span>
                  <span className="font-mono text-slate-300">
                    {activeTxModal.reference}
                  </span>
                </div>

                {activeTxModal.txHash && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Tx Hash</span>
                    <span className="font-mono text-[#1E6BF3]">
                      {activeTxModal.txHash}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Transaction Fee</span>
                  <span className="font-medium text-slate-200">
                    {activeTxModal.fee}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTxModal(null)}
                  className="w-full bg-[#1E6BF3] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-[#1E6BF3]/30"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}