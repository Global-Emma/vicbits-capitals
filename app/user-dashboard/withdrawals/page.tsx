"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Wallet,
  Building2,
  Coins,
  CreditCard,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Info,
  Lock,
  ArrowRight,
  Check,
  RefreshCw,
  Zap,
} from "lucide-react";
import DashboardLayout from "@/components/Sidebar";
import api from "@/utils/axios";
import { useApp } from "@/utils/useApp";

// Payout Method Type
type PayoutMethod = "bank" | "crypto" | "card";

// Crypto Network Options
type CryptoNetwork = "TRC20" | "ERC20" | "BEP20" | "BITCOIN";

// Historical Withdrawal Interface
export interface WithdrawalRecord {
  id: string;
  referenceId: string;
  method: string;
  destination: string;
  amountUsd: number;
  feeUsd: number;
  netAmountUsd: number;
  requestDate: string;
  status: "Completed" | "Pending" | "Failed";
}

export default function WithdrawalsPage() {
  const { user, refetchData } = useApp();
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>([]);
  const [dailyLimitUsed, setDailyLimitUsed] = useState(0);
  const [requestError, setRequestError] = useState("");
  const withdrawableBalance = Number(user?.balance || 0);
  const dailyLimitTotal = Number(user?.withdrawalLimit || 50000);
  const dailyLimitRemaining = dailyLimitTotal - dailyLimitUsed;

  useEffect(() => {
    api.get("/api/portal/withdrawals")
      .then(({ data }) => {
        setWithdrawalHistory(data.data.withdrawals);
        setDailyLimitUsed(data.data.dailyLimitUsed);
      })
      .catch((error) => console.error("Could not load withdrawal history:", error));
  }, []);

  // Form State
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("bank");
  const [amountInput, setAmountInput] = useState<string>("");
  
  // Bank Form State
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");

  // Crypto Form State
  const [cryptoAsset, setCryptoAsset] = useState<string>("USDT");
  const [cryptoNetwork, setCryptoNetwork] = useState<CryptoNetwork>("TRC20");
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Card Form State
  const [selectedCard, setSelectedCard] = useState<string>("");

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<boolean>(false);

  // Transaction Fee & Net Amount Calculations
  const calculatedFee = useMemo(() => {
    const numericAmount = parseFloat(amountInput) || 0;
    if (numericAmount <= 0) return 0;

    if (payoutMethod === "bank") return 25.0; // Fixed wire fee
    if (payoutMethod === "crypto") {
      if (cryptoNetwork === "TRC20") return 1.5;
      if (cryptoNetwork === "ERC20") return 12.0;
      if (cryptoNetwork === "BITCOIN") return 8.0;
      return 2.0;
    }
    if (payoutMethod === "card") return numericAmount * 0.015; // 1.5% instant card fee
    return 0;
  }, [amountInput, payoutMethod, cryptoNetwork]);

  const netPayoutAmount = useMemo(() => {
    const numericAmount = parseFloat(amountInput) || 0;
    const net = numericAmount - calculatedFee;
    return net > 0 ? net : 0;
  }, [amountInput, calculatedFee]);

  // Handle Quick Amount Select
  const handleQuickAmount = (percentage: number) => {
    const calculated = (withdrawableBalance * percentage).toFixed(2);
    setAmountInput(calculated);
  };

  // Submit Handler
  const handleInitiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || parseFloat(amountInput) <= 0 || parseFloat(amountInput) > withdrawableBalance) return;
    if (payoutMethod === "bank" && (!bankName || !accountHolder || !accountNumber)) {
      setRequestError("Enter the bank beneficiary details before continuing.");
      return;
    }
    if (payoutMethod === "crypto" && !walletAddress) {
      setRequestError("Enter the destination wallet address before continuing.");
      return;
    }
    if (payoutMethod === "card" && !selectedCard) {
      setRequestError("Enter the payout card reference before continuing.");
      return;
    }
    setRequestError("");
    setShowConfirmModal(true);
  };

  // Final Confirmation
  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    const destination = payoutMethod === "bank"
      ? `${bankName} - ${accountHolder} - account ending ${accountNumber.slice(-4)}${swiftCode ? ` - ${swiftCode}` : ""}`
      : payoutMethod === "crypto"
        ? `${cryptoAsset} (${cryptoNetwork}): ${walletAddress}`
        : selectedCard;
    try {
      const { data } = await api.post("/api/portal/withdrawals", {
        amount: Number(amountInput),
        method: payoutMethod,
        network: payoutMethod === "crypto" ? cryptoNetwork : undefined,
        destination,
      });
      setWithdrawalHistory((previous) => [data.data, ...previous]);
      setDailyLimitUsed((previous) => previous + Number(amountInput));
      await refetchData();
      setShowConfirmModal(false);
      setWithdrawalSuccess(true);
      setAmountInput("");
    } catch {
      setRequestError("Withdrawal could not be submitted. Check your available balance and daily limit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout defaultTab="Withdrawals">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E6BF3] mb-1">
              <ShieldCheck size={16} />
              <span>Multi-Signature Vault Security Enforced</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Withdraw Funds
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Transfer available cash to a bank account or digital wallet. Requests are held for administrator review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#061224] border border-slate-800/80 px-4 py-2 rounded-xl flex items-center gap-3 text-xs">
              <Lock size={15} className="text-[#F3B233]" />
              <div>
                <span className="text-[10px] text-slate-400 block">Request Status</span>
                <span className="font-bold text-emerald-400">Admin review required</span>
              </div>
            </div>
          </div>
        </div>

        {/* LIQUID BALANCE & LIMIT OVERVIEW METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AVAILABLE LIQUID BALANCE */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Withdrawable Liquid Cash</span>
              <Wallet size={16} className="text-[#1E6BF3]" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${withdrawableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">
              Unencumbered capital available for instant transfer.
            </p>
          </div>

          {/* DAILY WITHDRAWAL LIMIT */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">24-Hour Withdrawal Limit</span>
              <Clock size={16} className="text-[#F3B233]" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              ${dailyLimitRemaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Used: ${dailyLimitUsed.toLocaleString()}</span>
                <span>Max: ${dailyLimitTotal.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full bg-[#09172c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1E6BF3] rounded-full"
                  style={{ width: `${(dailyLimitUsed / dailyLimitTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* PROCESSING ESTIMATE */}
          <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Average Processing Speed</span>
              <Zap size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              Administrator review
            </div>
            <p className="text-xs text-slate-500">
              Automated institutional clearing for verified payout methods.
            </p>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {withdrawalSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-4">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-bold text-white">Withdrawal Request Submitted Successfully</h4>
              <p className="text-xs text-slate-300">
                Your transaction has been dispatched to the vault processing module. A confirmation email and transaction receipt have been generated.
              </p>
            </div>
            <button
              onClick={() => setWithdrawalSuccess(false)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}
        {requestError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">{requestError}</p>}

        {/* MAIN SECTION: WITHDRAWAL FORM + POLICY CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* WITHDRAWAL FORM (LEFT - 2 COLS) */}
          <div className="lg:col-span-2 bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Select Payout Medium</h3>
              <p className="text-xs text-slate-400">Choose where you would like to receive your settlement funds.</p>
            </div>

            {/* METHOD TAB SELECTOR */}
            <div className="grid grid-cols-3 gap-3">
              {/* BANK WIRE */}
              <button
                type="button"
                onClick={() => setPayoutMethod("bank")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-semibold transition-all gap-2 ${
                  payoutMethod === "bank"
                    ? "bg-[#1E6BF3]/10 border-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/10"
                    : "bg-[#09172c] border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Building2 size={22} className={payoutMethod === "bank" ? "text-[#1E6BF3]" : "text-slate-400"} />
                <span>Bank Wire (Fiat)</span>
              </button>

              {/* CRYPTO WALLET */}
              <button
                type="button"
                onClick={() => setPayoutMethod("crypto")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-semibold transition-all gap-2 ${
                  payoutMethod === "crypto"
                    ? "bg-[#1E6BF3]/10 border-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/10"
                    : "bg-[#09172c] border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Coins size={22} className={payoutMethod === "crypto" ? "text-[#F3B233]" : "text-slate-400"} />
                <span>Crypto Wallet</span>
              </button>

              {/* DEBIT / CREDIT CARD */}
              <button
                type="button"
                onClick={() => setPayoutMethod("card")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-xs font-semibold transition-all gap-2 ${
                  payoutMethod === "card"
                    ? "bg-[#1E6BF3]/10 border-[#1E6BF3] text-white shadow-lg shadow-[#1E6BF3]/10"
                    : "bg-[#09172c] border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard size={22} className={payoutMethod === "card" ? "text-emerald-400" : "text-slate-400"} />
                <span>Instant Card Payout</span>
              </button>
            </div>

            <form onSubmit={handleInitiateWithdrawal} className="space-y-6 pt-2">
              {/* DYNAMIC FORM FIELDS BASED ON METHOD */}

              {/* 1. BANK WIRE FIELDS */}
              {payoutMethod === "bank" && (
                <div className="space-y-4 bg-[#09172c] border border-slate-800/80 p-4 rounded-xl text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Building2 size={15} className="text-[#1E6BF3]" /> Payout Destination
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Bank details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Beneficiary Name</label>
                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Account Number / IBAN</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">SWIFT / BIC Code (optional)</label>
                      <input type="text" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]" />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CRYPTO WALLET FIELDS */}
              {payoutMethod === "crypto" && (
                <div className="space-y-4 bg-[#09172c] border border-slate-800/80 p-4 rounded-xl text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Select Asset</label>
                      <select
                        value={cryptoAsset}
                        onChange={(e) => setCryptoAsset(e.target.value)}
                        className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                      >
                        <option value="USDT">Tether USD (USDT)</option>
                        <option value="USDC">USD Coin (USDC)</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Transfer Network</label>
                      <select
                        value={cryptoNetwork}
                        onChange={(e) => setCryptoNetwork(e.target.value as CryptoNetwork)}
                        className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                      >
                        <option value="TRC20">Tron (TRC20) - Low Fee ($1.50)</option>
                        <option value="ERC20">Ethereum (ERC20) - ($12.00)</option>
                        <option value="BEP20">Binance Smart Chain (BEP20)</option>
                        <option value="BITCOIN">Bitcoin Mainnet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Destination Wallet Address</label>
                    <input
                      type="text"
                      placeholder={`Enter your ${cryptoAsset} (${cryptoNetwork}) address...`}
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#1E6BF3]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* 3. CARD PAYOUT FIELDS */}
              {payoutMethod === "card" && (
                <div className="space-y-4 bg-[#09172c] border border-slate-800/80 p-4 rounded-xl text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Saved Payout Card</label>
                    <input
                      type="text"
                      value={selectedCard}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      placeholder="Enter a tokenized payout card reference"
                      className="w-full bg-[#061224] border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#1E6BF3]"
                    />
                  </div>
                </div>
              )}

              {/* WITHDRAWAL AMOUNT INPUT */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-300">Enter Withdrawal Amount ($ USD)</label>
                  <span className="text-slate-400">
                    Available: <strong className="text-white">${withdrawableBalance.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#09172c] border border-slate-800/80 rounded-xl pl-9 pr-24 py-3.5 text-xl font-extrabold text-white focus:outline-none focus:border-[#1E6BF3]"
                    required
                  />

                  {/* QUICK SHORTCUT BUTTONS */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleQuickAmount(pct)}
                        className="px-2 py-1 bg-[#061224] hover:bg-[#1E6BF3] text-slate-300 hover:text-white rounded text-[10px] font-bold transition-all border border-slate-800"
                      >
                        {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BREAKDOWN BOX (FEES & NET AMOUNT) */}
              <div className="bg-[#09172c] border border-slate-800/80 rounded-xl p-4 text-xs space-y-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Requested Amount:</span>
                  <span className="font-semibold text-white">
                    ${(parseFloat(amountInput) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processing / Network Fee:</span>
                  <span className="font-semibold text-amber-400">
                    -${calculatedFee.toFixed(2)} USD
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>You Receive (Net):</span>
                  <span className="text-emerald-400">
                    ${netPayoutAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={!amountInput || parseFloat(amountInput) <= 0 || parseFloat(amountInput) > withdrawableBalance}
                className="w-full py-4 bg-[#1E6BF3] hover:bg-[#1859cc] disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#1E6BF3]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Initiate Withdrawal Request</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* POLICY & SECURITY ADVISORY (RIGHT - 1 COL) */}
          <div className="space-y-6">
            <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Info size={16} className="text-[#1E6BF3]" />
                <span>Withdrawal Policy Highlights</span>
              </h4>

              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Processing fees are shown before you submit and are included in the net payout amount.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Requests remain pending until an administrator approves or rejects them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Provide an accurate destination. Bank details are stored with this request for review.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-5 space-y-3 text-xs text-slate-400">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Institutional Security Protocol</span>
              </h4>
              <p>Withdrawal requests reserve the requested amount until an administrator completes or rejects the request.</p>
            </div>
          </div>
        </div>

        {/* WITHDRAWAL HISTORY & AUDIT LOG */}
        <div className="bg-[#061224] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-[#1E6BF3]" />
                <span>Withdrawal History</span>
              </h3>
              <p className="text-xs text-slate-400">Historical transfer audit log and payout receipts.</p>
            </div>
            <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
              <RefreshCw size={12} /> Refresh Log
            </button>
          </div>

          {/* HISTORY TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Payout Method</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Requested</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {withdrawalHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#09172c]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-300 font-bold">{row.referenceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-white">{row.method}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{row.destination}</td>
                    <td className="py-3.5 px-4 text-slate-300">${row.amountUsd.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-400">${row.feeUsd.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-white">${row.netAmountUsd.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.requestDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : row.status === "Failed" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {withdrawalHistory.length === 0 && <p className="py-6 text-center text-xs text-slate-400">No withdrawal requests yet.</p>}
          </div>
        </div>

        {/* 2FA VERIFICATION MODAL */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#061224] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock size={18} className="text-[#F3B233]" />
                  <span>Confirm Withdrawal Request</span>
                </h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  You are confirming a withdrawal of{" "}
                  <strong className="text-white">${parseFloat(amountInput).toLocaleString()} USD</strong> via{" "}
                  <strong className="text-white">{payoutMethod.toUpperCase()}</strong>.
                </p>

                <div className="bg-[#09172c] p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Settled Amount:</span>
                    <span className="font-bold text-emerald-400">${netPayoutAmount.toLocaleString()} USD</span>
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-1/2 py-3 bg-[#09172c] hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalConfirm}
                  disabled={isSubmitting}
                  className="w-1/2 py-3 bg-[#1E6BF3] hover:bg-[#1859cc] disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-xs transition-all flex justify-center items-center gap-2"
                >
                  {isSubmitting ? "Clearing..." : "Confirm Payout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}