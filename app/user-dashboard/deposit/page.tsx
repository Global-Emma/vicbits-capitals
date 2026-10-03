"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import api from "@/utils/axios";
import DashboardLayout from "@/components/Sidebar";

interface CryptoAsset {
  _id: string;
  asset: string;
  name: string;
  address: string;
  network: string;
  minimumUsdAmount: number;
  confirmations: number;
}

interface RecentDeposit {
  id: string;
  date: string;
  amount: number;
  status: string;
  reference: string;
  externalReference: string;
  asset: string;
}

export default function VicBitsDepositPage() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<RecentDeposit[]>([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    Promise.all([api.get("/api/portal/deposit-methods"), api.get("/api/portal/deposits")])
      .then(([methodResponse, depositResponse]) => {
        setCryptoAssets(methodResponse.data.data);
        setSelectedAsset((current) => current || methodResponse.data.data[0]?.asset || "");
        setRecentDeposits(depositResponse.data.data);
      })
      .catch((error) => console.error("Could not load deposit data:", error));
  }, []);

  const currentAsset = cryptoAssets.find((asset) => asset.asset === selectedAsset);

  const handleCopyAddress = () => {
    if (!currentAsset) return;
    navigator.clipboard.writeText(currentAsset.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitDepositRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/portal/deposits", {
        asset: selectedAsset,
        amount: Number(depositAmount),
        txHash: transactionHash,
      });
      setRecentDeposits((previous) => [data.data, ...previous]);
      setRequestMessage("Deposit submitted for verification.");
      setDepositAmount("");
      setTransactionHash("");
    } catch {
      setRequestMessage("Deposit request could not be submitted. Check the amount and transaction hash.");
    }
  };

  return (
<DashboardLayout defaultTab="Deposits">

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
              {cryptoAssets.map((asset) => {
                const isSelected = selectedAsset === asset.asset;

                return (
                  <button
                    key={asset._id}
                    onClick={() => setSelectedAsset(asset.asset)}
                    className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "border-[#1E6BF3] bg-blue-50/50 text-[#1E6BF3] shadow-sm ring-1 ring-[#1E6BF3]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[9px] flex items-center justify-center">{asset.asset.slice(0, 3)}</span>
                    <span>{asset.name}</span>
                  </button>
                );
              })}
            </div>

            {/* DEPOSIT ADDRESS CARD */}
            {currentAsset ? <motion.div
              key={selectedAsset}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6"
            >
              {/* Asset Header Title */}
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span>{currentAsset.name} ({currentAsset.asset}) Deposit Address</span>
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
                    <span className="font-bold text-slate-800">${currentAsset.minimumUsdAmount} USD</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block mb-0.5 font-medium">
                      Confirmation Required
                    </span>
                    <span className="font-bold text-slate-800">{currentAsset.confirmations} Confirmations</span>
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
                  <span className="font-bold">{currentAsset.asset}</span> to this address.
                  Sending other assets may result in permanent loss.
                </p>
              </div>
              <form onSubmit={submitDepositRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="number" min={currentAsset.minimumUsdAmount} step="any" required value={depositAmount} onChange={(event) => setDepositAmount(event.target.value)} placeholder="USD amount for verification" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                <input type="text" required value={transactionHash} onChange={(event) => setTransactionHash(event.target.value)} placeholder="Blockchain transaction hash" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                <button type="submit" className="sm:col-span-2 rounded-lg bg-[#1E6BF3] px-4 py-2.5 text-xs font-bold text-white">Submit deposit for review</button>
                {requestMessage && <p className="sm:col-span-2 text-xs text-slate-600">{requestMessage}</p>}
              </form>
            </motion.div> : <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">No deposit method is configured yet. Please contact support.</div>}

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
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">${item.amount.toLocaleString()} USD ({item.asset})</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-block ${
                              item.status === "Completed"
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
                            <span>{item.externalReference || item.reference}</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                    {recentDeposits.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-500">No deposit requests yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        </DashboardLayout>
  );
}