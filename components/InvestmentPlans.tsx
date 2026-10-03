"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Coins,
  Gem,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface InvestmentsSectionProps {
  setSelectedPlanForDeposit: (planName: string) => void;
  handleClaimBonus: () => void;
}

export default function InvestmentsSection({
  setSelectedPlanForDeposit,
  handleClaimBonus,
}: InvestmentsSectionProps) {
  const assetClasses = [
    {
      id: "real-estate",
      title: "Real Estate REITs",
      yieldText: "Up to 1.8% Daily Yield",
      description:
        "Fractional investment in luxury commercial, residential, and hotel developments across Dubai, London, and Miami.",
      icon: Building2,
      planName: "Real Estate REIT",
      features: [
        "Physical property asset backed",
        "Quarterly equity appreciation",
      ],
    },
    {
      id: "crypto",
      title: "Crypto Growth Fund",
      yieldText: "Up to 3.2% Daily Yield",
      description:
        "Algorithmic liquidity provision, proof-of-stake node validation, and automated arbitrage strategies on top-tier assets.",
      icon: Coins,
      planName: "Crypto Growth Fund",
      features: [
        "Instant automated payouts",
        "Zero lock-in flexibility options",
      ],
    },
    {
      id: "gold",
      title: "Physical Gold",
      yieldText: "Up to 1.2% Daily Yield",
      description:
        "Allocated, audited London Good Delivery gold bullion stored securely in Zurich and Singapore vaults.",
      icon: Gem,
      planName: "Gold Bullion Reserve",
      features: [
        "Physical redemption guaranteed",
        "Inflation hedge stability",
      ],
    },
    {
      id: "etfs",
      title: "Global Index ETFs",
      yieldText: "Up to 2.1% Daily Yield",
      description:
        "Diversified institutional index exposure covering S&P 500, Nasdaq-100, and global commodity baskets with automated rebalancing.",
      icon: TrendingUp,
      planName: "Global Index ETFs",
      features: [
        "Institutional index coverage",
        "Low-volatility steady gains",
      ],
    },
    {
      id: "nfts",
      title: "NFTs & Digital Assets",
      yieldText: "Up to 4.5% Daily Yield",
      description:
        "Fractional ownership of blue-chip NFT collections, metaverse real estate, and high-liquidity digital asset funds.",
      icon: Sparkles,
      planName: "NFT & Digital Assets",
      features: [
        "Curated blue-chip portfolio",
        "High-liquidity fractional market",
      ],
    },
  ];

  return (
    <section id="investments" className="py-20 lg:py-28 bg-[#040C18] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F3B233] bg-[#F3B233]/10 px-3.5 py-1.5 rounded-full border border-[#F3B233]/30">
            Curated Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Elite Asset Classes Designed for Maximum Yield
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Choose from institutional-grade investment portfolios tailored for wealth preservation, high ROI, and market cycle resilience.
          </p>
        </div>

        {/* 5-Column Responsive Asset Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-14">
          {assetClasses.map((asset) => {
            const Icon = asset.icon;
            return (
              <motion.div
                key={asset.id}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#F3B233]/50 p-6 flex flex-col justify-between relative shadow-xl overflow-hidden group transition-all"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3B233]/15 border border-[#F3B233]/30 flex items-center justify-center text-[#F3B233]">
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block">
                      {asset.yieldText}
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-3">
                      {asset.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed min-h-[50px]">
                    {asset.description}
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {asset.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#F3B233] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanForDeposit(asset.planName);
                    handleClaimBonus();
                  }}
                  className="mt-6 w-full py-3 cursor-pointer rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#F3B233] to-[#E5A422] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
                >
                  <span>Invest in {asset.title.split(" ")[0]}</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}