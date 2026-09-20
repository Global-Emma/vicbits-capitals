"use client";

import React, { useState } from "react";
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
  Search,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// Types
type CryptoAssetKey = "BTC" | "USDT" | "ETH" | "BNB";

interface CryptoAsset {
  key: CryptoAssetKey;
  name: string;
  symbol: string;
  address: string;
  network: string;
  minDeposit: string;
  confirmations: string;
  badgeBg: string;
  textColor: string;
  svgIcon: React.ReactNode;
}

interface RecentDeposit {
  id: string;
  date: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Failed";
  txHash: string;
}

export default function VicBitsDepositPage() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAssetKey>("BTC");
  const [copied, setCopied] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Asset Metadata Dictionary
  const cryptoAssets: Record<CryptoAssetKey, CryptoAsset> = {
    BTC: {
      key: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      address: "bc1qvy2kgdygs9x2l8p703kdq9w7f5e9",
      network: "Bitcoin (BTC)",
      minDeposit: "0.001 BTC",
      confirmations: "3 Confirmations",
      badgeBg: "bg-amber-500",
      textColor: "text-amber-500",
      svgIcon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.24 15.538.362 9.11 1.962 2.67 8.475-1.24 14.902.362c6.43 1.605 10.342 8.115 8.736 14.542zM15.86 10.12c.245-1.643-.996-2.522-2.695-3.111l.551-2.21-1.345-.335-.536 2.152c-.354-.088-.718-.17-1.08-.25l.54-2.164-1.346-.336-.551 2.21c-.292-.067-.58-.135-.862-.206l-1.856-.464-.358 1.437s1.002.23 1 .243c.547.137.646.498.63.785l-.631 2.533c.038.01.087.023.14.045l-.142-.036-.885 3.548c-.067.166-.237.416-.62.321.014.02-1-.25-1-.25l-.668 1.54 1.751.437c.326.082.646.168.963.25l-.558 2.242 1.345.335.552-2.214c.368.1.724.19 1.072.274l-.55 2.207 1.346.336.558-2.237c2.298.435 4.026.26 4.752-1.819.585-1.674-.029-2.64-1.24-3.267.882-.204 1.547-.785 1.724-1.986z" />
        </svg>
      ),
    },
    USDT: {
      key: "USDT",
      name: "USDT",
      symbol: "USDT",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      network: "Tron (TRC20) / ERC20",
      minDeposit: "10 USDT",
      confirmations: "12 Confirmations",
      badgeBg: "bg-emerald-500",
      textColor: "text-emerald-500",
      svgIcon: (
        <span className="font-bold text-xs bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          ₮
        </span>
      ),
    },
    ETH: {
      key: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      network: "Ethereum (ERC20)",
      minDeposit: "0.01 ETH",
      confirmations: "12 Confirmations",
      badgeBg: "bg-indigo-500",
      textColor: "text-indigo-500",
      svgIcon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.37 4.35zm.056-17.97L4.58 12.22l7.42 4.39 7.417-4.39L12 0z" />
        </svg>
      ),
    },
    BNB: {
      key: "BNB",
      name: "BNB",
      symbol: "BNB",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      network: "BNB Smart Chain (BEP20)",
      minDeposit: "0.05 BNB",
      confirmations: "15 Confirmations",
      badgeBg: "bg-yellow-500",
      textColor: "text-yellow-500",
      svgIcon: (
        <span className="font-black text-[10px] bg-yellow-500 text-black rounded-full w-5 h-5 flex items-center justify-center">
          B
        </span>
      ),
    },
  };

  // Recent Deposit Transactions matching the UI
  const recentDeposits: RecentDeposit[] = [
    {
      id: "1",
      date: "Apr 18, 2026",
      amount: "0.005 BTC",
      status: "Confirmed",
      txHash: "0x3f8a...b91c",
    },
    {
      id: "2",
      date: "Apr 15, 2026",
      amount: "0.01 BTC",
      status: "Confirmed",
      txHash: "0x7e2d...a4f0",
    },
    {
      id: "3",
      date: "Apr 10, 2026",
      amount: "0.002 BTC",
      status: "Pending",
      txHash: "0x1b9c...e882",
    },
  ];

  const currentAsset = cryptoAssets[selectedAsset];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAsset.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Investments", icon: TrendingUp, active: true },
    { name: "Deposits", icon: ArrowDownLeft },
    { name: "Withdrawals", icon: ArrowUpRight },
    { name: "Transactions", icon: History },
    { name: "Portfolio", icon: Briefcase },
    { name: "Profile", icon: User },
    { name: "Support", icon: HelpCircle },
  ];

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

          {/* SIDEBAR NAVIGATION */}
          <nav className="p-4 space-y-1">
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
        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-800/80 bg-[#061224]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2"
            >
              <Menu size={22} />
            </button>

            {/* Global Search Bar */}
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
                className="w-full bg-[#09172c] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3] transition-colors"
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER (LIGHT THEME PANEL MATCHING UI SCREENSHOT) */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 bg-[#040B18]">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-100">
            {/* HEADING SECTION */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Deposit Crypto</h1>
              <p className="text-xs text-slate-500 mt-1">
                Send crypto to the address below to fund your account.
              </p>
            </div>

            {/* ASSET SELECTOR TABS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {(Object.keys(cryptoAssets) as CryptoAssetKey[]).map((key) => {
                const asset = cryptoAssets[key];
                const isSelected = selectedAsset === key;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAsset(key)}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "border-[#1E6BF3] bg-blue-50/50 text-[#1E6BF3] shadow-sm ring-1 ring-[#1E6BF3]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {asset.svgIcon}
                    <span>{asset.name}</span>
                  </button>
                );
              })}
            </div>

            {/* DEPOSIT ADDRESS CARD */}
            <motion.div
              key={selectedAsset}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6"
            >
              {/* Asset Header Title */}
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                {currentAsset.svgIcon}
                <span>{currentAsset.name} ({currentAsset.symbol}) Deposit Address</span>
              </div>

              {/* QR Code & Address Metadata Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* QR Code Block */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                    {/* Generated QR Code SVG pattern placeholder */}
                    <svg
                      className="w-36 h-36"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0h40v40H0V0zm10 10v20h20V10H10zm50-10h40v40H60V0zm10 10v20h20V10H70zM0 60h40v40H0V60zm10 10v20h20V70H10zm50 0h10v10H60V70zm20 0h20v10H80V70zm-10 10h10v20H70V80zm20 10h10v10H90V90zm-30 0h10v10H60V90zm0-20h10v10H60V70zm10-10h20v10H70V60z"
                        fill="#0F172A"
                      />
                    </svg>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block mb-0.5 font-medium">Network</span>
                    <span className="font-bold text-slate-800">{currentAsset.network}</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block mb-0.5 font-medium">Minimum Deposit</span>
                    <span className="font-bold text-slate-800">{currentAsset.minDeposit}</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block mb-0.5 font-medium">
                      Confirmation Required
                    </span>
                    <span className="font-bold text-slate-800">{currentAsset.confirmations}</span>
                  </div>
                </div>
              </div>

              {/* Deposit Address Input with Copy Button */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 pl-4 shadow-sm">
                <span className="text-xs font-mono font-medium text-slate-600 truncate flex-1">
                  {currentAsset.address}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="bg-[#1E6BF3] hover:bg-blue-600 active:scale-95 text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Warning Notice Box */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-amber-800">Important:</span> Send only{" "}
                  <span className="font-bold">{currentAsset.symbol}</span> to this address.
                  Sending other assets may result in permanent loss.
                </p>
              </div>
            </motion.div>

            {/* RECENT DEPOSITS TABLE */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Recent Deposits</h2>
                <button className="text-xs font-bold text-[#1E6BF3] hover:underline flex items-center gap-0.5">
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentDeposits.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{item.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.amount}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block ${
                              item.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href="#"
                            className="text-[#1E6BF3] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}