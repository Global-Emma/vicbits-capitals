"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, X, CheckCircle2, LucideIcon } from "lucide-react";

// --- Types ---
type ActionType = "investment" | "withdrawal";

interface ActionConfig {
  type: ActionType;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
}

interface ActivityItem {
  id: number;
  name: string;
  action: ActionConfig;
  asset: string;
  amount: string;
  timeAgo: string;
}

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// --- Dynamic Name Pool Generator (Over 300+ Combinations) ---
const FIRST_NAMES = [
  "Emmanuel", "Richard", "Sophia", "David", "Chloe", "Marcus", "Elena", "Alexander",
  "Fatima", "Liam", "Noah", "Olivia", "Lucas", "Amelia", "Ethan", "Isabella",
  "Mason", "Mia", "Oliver", "Harper", "James", "Evelyn", "Benjamin", "Charlotte",
  "Henry", "Abigail", "Sebastian", "Emily", "Jack", "Elizabeth", "Samuel", "Mila",
  "Daniel", "Ella", "Matthew", "Avery", "Jackson", "Sofia", "Mateo", "Camila",
  "Yuki", "Lars", "Aisha", "Chen", "Carlos", "Zainab", "Dmitri", "Kwame"
];

const LAST_INITIALS = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "K.", "L.", "M.", "N.", "O.", "P.", "R.", "S.", "T.", "V.", "W.", "Z."];

const ASSETS = [
  "Bitcoin Vault",
  "Dubai Commercial REIT",
  "Swiss Vault Gold",
  "Ethereum Staking Pool",
  "S&P 500 ETF",
  "VicBits Apex Access NFT",
  "Global Tech & AI ETF",
  "Manhattan Tech Center",
  "Solana Liquidity Node",
  "London Luxury Residential"
];

const ACTIONS: Record<ActionType, ActionConfig> = {
  investment: {
    type: "investment",
    label: "invested in",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: TrendingUp,
  },
  withdrawal: {
    type: "withdrawal",
    label: "withdrew",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: ArrowUpRight,
  },
};

const generateRandomActivity = (): ActivityItem => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastInitial = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
  const name = `${firstName} ${lastInitial}`;

  const actionType: ActionType = Math.random() > 0.35 ? "investment" : "withdrawal";
  const action = ACTIONS[actionType];
  const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];

  const rawAmount =
    actionType === "investment"
      ? Math.floor(Math.random() * 95 + 1) * 100
      : Math.floor(Math.random() * 50 + 1) * 100;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rawAmount);

  return {
    id: Date.now(),
    name,
    action,
    asset,
    amount: formattedAmount,
    timeAgo: "Just now",
  };
};

export const LiveActivityPopup: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  // Keep SSR and hydration consistent, then enable client-only UI.
  const isMounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  const triggerNewNotification = useCallback(() => {
    if (isDismissed) return;
    setCurrentActivity(generateRandomActivity());
  }, [isDismissed]);

  useEffect(() => {
    if (!isMounted || isDismissed) return;

    // Initial popup after 2 seconds
    const initialTimer = setTimeout(() => {
      triggerNewNotification();
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [isMounted, isDismissed, triggerNewNotification]);

  useEffect(() => {
    if (!isMounted || isDismissed || isPaused) return;

    // Cycle activity every 7 seconds
    const interval = setInterval(() => {
      triggerNewNotification();
    }, 7000);

    return () => clearInterval(interval);
  }, [isMounted, isPaused, isDismissed, triggerNewNotification]);

  if (!isMounted || isDismissed || !currentActivity) return null;

  const { action } = currentActivity;
  const IconComponent = action.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-5 left-5 z-50 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity.id}
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`pointer-events-auto relative flex items-center gap-3.5 p-4 rounded-xl backdrop-blur-md bg-gray-900/90 border ${action.border} shadow-2xl text-white`}
        >
          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1 rounded-md"
            title="Close live activity updates"
          >
            <X size={14} />
          </button>

          {/* Action Icon Badge */}
          <div className={`p-2.5 rounded-lg shrink-0 ${action.bg} ${action.color}`}>
            <IconComponent size={20} />
          </div>

          {/* Activity Content */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-0.5">
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              <span>Verified Investor Activity</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">{currentActivity.timeAgo}</span>
            </div>

            <p className="text-sm font-medium leading-snug">
              <strong className="text-white font-semibold">{currentActivity.name}</strong>{" "}
              <span className="text-gray-300">{action.label}</span>{" "}
              <span className={`font-bold ${action.color}`}>{currentActivity.amount}</span>
            </p>

            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {currentActivity.asset}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
