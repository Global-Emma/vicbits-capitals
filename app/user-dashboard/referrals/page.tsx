"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import api from "@/utils/axios";
import DashboardLayout from "@/components/Sidebar";

interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredAt: string;
  hasInvested: boolean;
  investmentCount: number;
  totalInvested: number;
  firstInvestmentAt: string | null;
  rewardEarned: boolean;
  rewardAmount: number;
}

interface ReferralSummary {
  referrals: Referral[];
  totalReferrals: number;
  investedReferrals: number;
  totalEarned: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ReferralsPage() {
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/portal/referrals")
      .then(({ data }) => setSummary(data.data))
      .catch((requestError: unknown) => {
        console.error("Could not load referral activity:", requestError);
        setError("Referral activity could not be loaded. Please try again later.");
      });
  }, []);

  return (
    <DashboardLayout defaultTab="Referrals">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-white">Referral activity</h1>
          <p className="mt-1 text-sm text-slate-400">
            Follow signups from your code, see who has invested, and track your rewards.
          </p>
        </header>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!summary && !error && (
          <div className="rounded-2xl border border-slate-800 bg-[#09172c] p-8 text-center text-sm text-slate-400">
            Loading your referrals...
          </div>
        )}

        {summary && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-800 bg-[#09172c] p-5">
                <p className="text-xs font-medium text-slate-400">Registered referrals</p>
                <p className="mt-2 text-2xl font-bold text-white">{summary.totalReferrals}</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-[#09172c] p-5">
                <p className="text-xs font-medium text-slate-400">Referrals who invested</p>
                <p className="mt-2 text-2xl font-bold text-white">{summary.investedReferrals}</p>
              </article>
              <article className="rounded-2xl border border-[#F3B233]/20 bg-[#F3B233]/5 p-5">
                <p className="text-xs font-medium text-slate-400">Referral rewards earned</p>
                <p className="mt-2 text-2xl font-bold text-[#F3B233]">{formatCurrency(summary.totalEarned)}</p>
              </article>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#09172c]">
              <div className="border-b border-slate-800 p-5">
                <h2 className="font-semibold text-white">People you invited</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Your $20 reward is credited after each referred friend invests for the first time.
                </p>
              </div>
              {summary.referrals.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#040D1A]/70 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Referral</th>
                        <th className="px-5 py-3 font-semibold">Registered</th>
                        <th className="px-5 py-3 font-semibold">Investment status</th>
                        <th className="px-5 py-3 font-semibold">Total invested</th>
                        <th className="px-5 py-3 font-semibold">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {summary.referrals.map((referral) => (
                        <tr key={referral.id}>
                          <td className="px-5 py-4">
                            <p className="font-medium text-white">{referral.firstName} {referral.lastName}</p>
                            <p className="mt-1 text-xs text-slate-500">{referral.email}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-300">{formatDate(referral.registeredAt)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              referral.hasInvested
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-300"
                            }`}>
                              {referral.hasInvested ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                              {referral.hasInvested
                                ? `Invested${referral.investmentCount > 1 ? ` (${referral.investmentCount})` : ""}`
                                : "No investment yet"}
                            </span>
                            {referral.firstInvestmentAt && (
                              <p className="mt-1 text-xs text-slate-500">
                                First investment {formatDate(referral.firstInvestmentAt)}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-200">{formatCurrency(referral.totalInvested)}</td>
                          <td className="px-5 py-4">
                            {referral.rewardEarned ? (
                              <span className="font-semibold text-emerald-400">{formatCurrency(referral.rewardAmount)} earned</span>
                            ) : referral.hasInvested ? (
                              <span className="text-xs text-amber-300">Reward processing</span>
                            ) : (
                              <span className="text-xs text-slate-500">Pending investment</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <UsersRound size={28} className="mx-auto text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">No referrals yet</p>
                  <p className="mt-1 text-xs text-slate-500">Share your referral code from the dashboard to get started.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
