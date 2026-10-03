"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  LogOut,
  Menu,
  Search,
  Bell,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  History,
  Settings,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "@/utils/useApp";
import { useRouter } from "next/navigation";

export interface NavItem {
  name: string;
  icon: LucideIcon;
  href?: string;
}

// Default navigation items if none are passed
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: '/user-dashboard' },
  { name: "Investments", icon: TrendingUp, href: '/user-dashboard/investments' },
  { name: "Portfolio", icon: Wallet, href: '/user-dashboard/portfolio' },
  { name: "Withdrawals", icon: ArrowUpRight, href: '/user-dashboard/withdrawals' },
  { name: "Transactions", icon: History, href: '/user-dashboard/transactions' },
  { name: "Settings", icon: Settings, href: '/user-dashboard/settings' },
];

// const navItems = [
//     { name: "Deposits", icon: ArrowDownLeft },
//     { name: "Profile", icon: User },
//     { name: "Support", icon: Headphones },
//   ];

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  defaultTab?: string;
  onTabChange?: (tabName: string) => void;
}

export default function DashboardLayout({
  children,
  navItems = DEFAULT_NAV_ITEMS,
  defaultTab = "Dashboard",
  onTabChange,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");

  // Consume user data and logout function directly from AppContext
  const { user, logout } = useApp();
  const router = useRouter();

  const handleTabClick = (tabName: string, link?: string) => {
    setActiveTab(tabName);
    if (onTabChange) onTabChange(tabName);
    setMobileSidebarOpen(false); // Auto-close sidebar on mobile after selecting an item

    if (link) {
      router.push(link);
    }
  };

  // Helper for rendering user initials if no custom avatar image exists
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "VB";

  return (
    <div className="min-h-screen bg-[#040D1A] flex text-slate-100">
      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#061224] border-r border-slate-800/80 flex flex-col justify-between h-max-full transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* LOGO HEADER */}
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
              type="button"
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-4 space-y-1.5" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleTabClick(item.name, item.href)}
                  className={`w-full flex cursor-pointer items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-slate-400"}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-800/60">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
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
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            {/* SEARCH BAR */}
            <div className="relative w-48 sm:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search investments, transactions..."
                className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E6BF3] focus:ring-1 focus:ring-[#1E6BF3] transition-all"
              />
            </div>
          </div>

          {/* RIGHT TOP PROFILE ACTIONS */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Notification Icon */}
            <button
              type="button"
              className="relative p-2 rounded-xl bg-[#09172c] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#061224]" />
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800/80">
              {user?.avatar ? (
                <div
                  style={{ backgroundImage: `url('${user.avatar}')` }}
                  className="w-9 h-9 rounded-full bg-cover bg-center border border-[#F3B233] flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#1E6BF3]/20 border border-[#1E6BF3] text-[#1E6BF3] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {userInitials}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <h2 className="text-xs font-bold text-white leading-snug">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Investor Account"}
                </h2>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* INNER PAGE BODY */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}