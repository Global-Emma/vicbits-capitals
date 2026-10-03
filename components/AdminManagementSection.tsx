"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import api from "@/utils/axios";
import { useApp } from "@/utils/useApp";

type Section = "users" | "deposits" | "withdrawals" | "investments" | "transactions" | "plans" | "settings" | "reports";

interface Investor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number | string;
  totalInvested?: number | string;
  createdAt: string;
}

interface Transaction {
  id: string;
  user: { id: string; name: string; email: string } | null;
  reference: string;
  description: string;
  eventType: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  asset?: string;
  paymentMethod?: string;
  externalReference?: string;
}

interface AdminInvestment {
  id: string;
  user: { id: string; name: string; email: string } | null;
  name: string;
  symbol: string;
  planSlug: string;
  investedAmount: number;
  currentValue: number;
  status: "Active" | "Matured" | "Locked";
  createdAt: string;
}

interface Plan {
  _id: string;
  name: string;
  slug: string;
  symbol: string;
  category: string;
  price: number;
  expectedApy: number;
  minInvestment: number;
  riskLevel: string;
  description: string;
  tags: string[];
  active: boolean;
}

interface DepositMethod {
  _id: string;
  asset: string;
  name: string;
  network: string;
  address: string;
  minimumUsdAmount: number;
  confirmations: number;
  active: boolean;
}

const sections: Array<{ id: Section | "overview"; label: string; href: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { id: "users", label: "Investors", href: "/admin-dashboard/users", icon: Users },
  { id: "deposits", label: "Deposits", href: "/admin-dashboard/deposits", icon: ArrowDownLeft },
  { id: "withdrawals", label: "Withdrawals", href: "/admin-dashboard/withdrawals", icon: ArrowUpRight },
  { id: "investments", label: "Investments", href: "/admin-dashboard/investments", icon: TrendingUp },
  { id: "transactions", label: "Transactions", href: "/admin-dashboard/transactions", icon: History },
  { id: "plans", label: "Plans", href: "/admin-dashboard/plans", icon: Layers },
  { id: "settings", label: "Settings", href: "/admin-dashboard/settings", icon: Layers },
  { id: "reports", label: "Reports", href: "/admin-dashboard/reports", icon: FileText },
];

const numberValue = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value: unknown) => `$${numberValue(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const errorMessage = (error: unknown) => (
  isAxiosError(error)
    ? error.response?.data?.message || error.message
    : error instanceof Error ? error.message : "An unexpected error occurred."
);

const panelClass = "rounded-2xl border border-slate-800/80 bg-[#09172c]/90 p-5";
const inputClass = "w-full rounded-lg border border-slate-700 bg-[#061224] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";
const buttonClass = "rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminManagementSection({ section }: { section: Section }) {
  const { user, loading: authLoading, logout } = useApp();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<AdminInvestment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [methods, setMethods] = useState<DepositMethod[]>([]);
  const [overview, setOverview] = useState<{ metrics: Record<string, number> } | null>(null);
  const [search, setSearch] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [userActivity, setUserActivity] = useState<{ transactions: Transaction[]; investments: AdminInvestment[] } | null>(null);
  const [balanceForm, setBalanceForm] = useState({ direction: "credit", amount: "", reason: "" });
  const [planForm, setPlanForm] = useState({ name: "", slug: "", symbol: "", category: "crypto", price: "0", expectedApy: "0", minInvestment: "", riskLevel: "Medium", description: "", tags: "" });
  const [editingPlanId, setEditingPlanId] = useState("");
  const [methodForm, setMethodForm] = useState({ asset: "", name: "", network: "", address: "", minimumUsdAmount: "0", confirmations: "1" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role !== "admin") router.replace("/user-dashboard");
  }, [authLoading, router, user?.role]);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setError("");
    setNotice("");
    try {
      if (section === "users") {
        const { data } = await api.get("/api/portal/admin/users");
        setInvestors(data.data);
      } else if (section === "deposits" || section === "withdrawals" || section === "transactions") {
        const eventType = section === "transactions" ? "" : section.slice(0, -1);
        const { data } = await api.get("/api/portal/admin/transactions", eventType ? { params: { eventType } } : undefined);
        setTransactions(data.data);
      } else if (section === "investments") {
        const { data } = await api.get("/api/portal/admin/investments");
        setInvestments(data.data);
      } else if (section === "plans") {
        const { data } = await api.get("/api/portal/plans");
        setPlans(data.data);
      } else if (section === "settings") {
        const { data } = await api.get("/api/portal/deposit-methods");
        setMethods(data.data);
      } else if (section === "reports") {
        const [overviewResponse, transactionResponse, investmentResponse, usersResponse] = await Promise.all([
          api.get("/api/portal/admin/overview"),
          api.get("/api/portal/admin/transactions"),
          api.get("/api/portal/admin/investments"),
          api.get("/api/portal/admin/users"),
        ]);
        setOverview(overviewResponse.data.data);
        setTransactions(transactionResponse.data.data);
        setInvestments(investmentResponse.data.data);
        setInvestors(usersResponse.data.data);
      }
    } catch (loadFailure) {
      console.error(`Could not load admin ${section}:`, loadFailure);
      setError(errorMessage(loadFailure));
    } finally {
      setLoadingData(false);
    }
  }, [section]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredInvestors = useMemo(() => investors.filter((investor) => (
    `${investor.firstName} ${investor.lastName} ${investor.email}`.toLowerCase().includes(search.toLowerCase())
  )), [investors, search]);
  const filteredTransactions = useMemo(() => transactions.filter((transaction) => (
    `${transaction.user?.name || ""} ${transaction.user?.email || ""} ${transaction.reference} ${transaction.description}`.toLowerCase().includes(search.toLowerCase())
  )), [transactions, search]);
  const filteredInvestments = useMemo(() => investments.filter((investment) => (
    `${investment.user?.name || ""} ${investment.user?.email || ""} ${investment.name} ${investment.symbol}`.toLowerCase().includes(search.toLowerCase())
  )), [investments, search]);

  const selectInvestor = async (investor: Investor) => {
    setSelectedInvestor(investor);
    setUserActivity(null);
    setError("");
    try {
      const { data } = await api.get(`/api/portal/admin/users/${investor._id}`);
      setUserActivity(data.data);
      setSelectedInvestor(data.data.user);
    } catch (failure) {
      setError(errorMessage(failure));
    }
  };

  const submitBalanceAdjustment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedInvestor) return;
    setBusyId(selectedInvestor._id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch(`/api/portal/admin/users/${selectedInvestor._id}/balance`, {
        ...balanceForm,
        amount: Number(balanceForm.amount),
      });
      setSelectedInvestor(data.data.user);
      setInvestors((current) => current.map((investor) => investor._id === selectedInvestor._id ? data.data.user : investor));
      setBalanceForm({ direction: "credit", amount: "", reason: "" });
      setNotice("Balance updated and adjustment recorded in investor transactions.");
      await selectInvestor(data.data.user);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const reviewRequest = async (transaction: Transaction, status: "Completed" | "Failed") => {
    setBusyId(transaction.id);
    setError("");
    setNotice("");
    try {
      await api.patch(`/api/portal/requests/${transaction.id}/status`, { status });
      setNotice(`Request ${status === "Completed" ? "approved" : "rejected"}.`);
      await loadData();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const updateInvestmentStatus = async (investment: AdminInvestment, status: AdminInvestment["status"]) => {
    setBusyId(investment.id);
    setError("");
    try {
      await api.patch(`/api/portal/admin/investments/${investment.id}/status`, { status });
      setInvestments((current) => current.map((item) => item.id === investment.id ? { ...item, status } : item));
      setNotice(`${investment.name} marked ${status.toLowerCase()}.`);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const savePlan = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusyId("plan");
    setError("");
    setNotice("");
    const payload = {
      ...planForm,
      price: Number(planForm.price),
      expectedApy: Number(planForm.expectedApy),
      minInvestment: Number(planForm.minInvestment),
      tags: planForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    try {
      if (editingPlanId) await api.put(`/api/portal/plans/${editingPlanId}`, payload);
      else await api.post("/api/portal/plans", payload);
      setPlanForm({ name: "", slug: "", symbol: "", category: "crypto", price: "0", expectedApy: "0", minInvestment: "", riskLevel: "Medium", description: "", tags: "" });
      setEditingPlanId("");
      setNotice("Investment plan saved.");
      await loadData();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const deactivatePlan = async (plan: Plan) => {
    setBusyId(plan._id);
    setError("");
    try {
      await api.delete(`/api/portal/plans/${plan._id}`);
      setNotice(`${plan.name} deactivated.`);
      await loadData();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const saveDepositMethod = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusyId("method");
    setError("");
    try {
      await api.post("/api/portal/deposit-methods", {
        ...methodForm,
        minimumUsdAmount: Number(methodForm.minimumUsdAmount),
        confirmations: Number(methodForm.confirmations),
        active: true,
      });
      setMethodForm({ asset: "", name: "", network: "", address: "", minimumUsdAmount: "0", confirmations: "1" });
      setNotice("Deposit method created.");
      await loadData();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const toggleMethod = async (method: DepositMethod) => {
    setBusyId(method._id);
    setError("");
    try {
      await api.put(`/api/portal/deposit-methods/${method._id}`, { active: !method.active });
      setMethods((current) => current.map((item) => item._id === method._id ? { ...item, active: !item.active } : item));
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusyId("");
    }
  };

  const exportTransactions = () => {
    const csvRows = [
      ["Date", "Investor", "Email", "Reference", "Event", "Description", "Amount", "Status"],
      ...transactions.map((item) => [item.date, item.user?.name || "", item.user?.email || "", item.reference, item.eventType, item.description, String(item.amount), item.status]),
    ];
    const csv = csvRows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `vicbits-${section}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const pageTitle = sections.find((item) => item.id === section)?.label || "Investors";
  const metrics = overview?.metrics || {};
  const totalInvested = investments.reduce((sum, item) => sum + numberValue(item.investedAmount), 0);
  const completedDeposits = transactions.filter((item) => item.eventType === "deposit" && item.status === "Completed").reduce((sum, item) => sum + numberValue(item.amount), 0);
  const completedWithdrawals = transactions.filter((item) => item.eventType === "withdrawal" && item.status === "Completed").reduce((sum, item) => sum + numberValue(item.amount), 0);

  if (authLoading || user?.role !== "admin") return <main className="min-h-screen bg-[#040B18]" />;

  return (
    <div className="min-h-screen bg-[#040B18] text-slate-100 lg:flex">
      <aside className="w-full border-b border-slate-800 bg-[#061224] p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
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
                <span>
            <small className="text-[10px] uppercase tracking-wider text-amber-400">Admin Portal</small></span>
        <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
          {sections.map(({ id, label, href, icon: Icon }) => (
            <Link key={id} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${section === id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-300 lg:mt-10">
          <LogOut size={16} /> Log out
        </button>
      </aside>

      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
            <p className="mt-1 text-xs text-slate-400">Review and manage investor platform activity.</p>
          </div>
          <div className="flex gap-2">
            {section !== "plans" && section !== "settings" && (
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records..." className={`${inputClass} max-w-xs`} />
            )}
            <button onClick={() => void loadData()} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white" aria-label="Refresh data">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </header>

        {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{notice}</p>}
        {loadingData ? <p className="text-sm text-slate-400">Loading {pageTitle.toLowerCase()}...</p> : null}

        {section === "users" && (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className={`${panelClass} overflow-x-auto`}>
              <h2 className="mb-4 text-sm font-bold text-white">Investor accounts ({filteredInvestors.length})</h2>
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="text-slate-400"><tr><th className="p-2">Investor</th><th className="p-2">Email</th><th className="p-2">Cash balance</th><th className="p-2">Joined</th></tr></thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredInvestors.map((investor) => <tr key={investor._id} onClick={() => void selectInvestor(investor)} className={`cursor-pointer hover:bg-slate-800/30 ${selectedInvestor?._id === investor._id ? "bg-blue-500/10" : ""}`}>
                    <td className="p-2 font-semibold text-white">{investor.firstName} {investor.lastName}</td><td className="p-2 text-slate-400">{investor.email}</td><td className="p-2 text-emerald-300">{money(investor.balance)}</td><td className="p-2 text-slate-400">{new Date(investor.createdAt).toLocaleDateString()}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            {selectedInvestor ? <div className={`${panelClass} space-y-5`}>
              <div><h2 className="text-lg font-bold text-white">{selectedInvestor.firstName} {selectedInvestor.lastName}</h2><p className="text-xs text-slate-400">{selectedInvestor.email}</p><p className="mt-3 text-sm">Available cash: <strong className="text-emerald-300">{money(selectedInvestor.balance)}</strong></p></div>
              <form onSubmit={submitBalanceAdjustment} className="space-y-3 border-t border-slate-800 pt-4">
                <h3 className="text-sm font-semibold text-white">Adjust balance</h3>
                <select className={inputClass} value={balanceForm.direction} onChange={(event) => setBalanceForm({ ...balanceForm, direction: event.target.value })}><option value="credit">Credit cash</option><option value="debit">Debit cash</option></select>
                <input className={inputClass} type="number" min="0.01" step="0.01" required placeholder="Amount (USD)" value={balanceForm.amount} onChange={(event) => setBalanceForm({ ...balanceForm, amount: event.target.value })} />
                <textarea className={inputClass} required minLength={3} placeholder="Reason (recorded in transaction history)" value={balanceForm.reason} onChange={(event) => setBalanceForm({ ...balanceForm, reason: event.target.value })} />
                <button className={buttonClass} disabled={busyId === selectedInvestor._id}>{busyId === selectedInvestor._id ? "Saving..." : "Save adjustment"}</button>
              </form>
              <div className="border-t border-slate-800 pt-4">
                <h3 className="mb-2 text-sm font-semibold text-white">Recent investments</h3>
                {userActivity?.investments?.length ? userActivity.investments.map((item) => <p key={item.id} className="py-1 text-xs text-slate-300">{item.name} · {money(item.investedAmount)} · {item.status}</p>) : <p className="text-xs text-slate-500">No investments found.</p>}
                <h3 className="mb-2 mt-4 text-sm font-semibold text-white">Recent transactions</h3>
                {userActivity?.transactions?.slice(0, 6).map((item) => <p key={item.id} className="py-1 text-xs text-slate-300">{item.description} · {money(item.amount)} · {item.status}</p>)}
              </div>
            </div> : <div className={`${panelClass} flex items-center text-sm text-slate-400`}>Select an investor to view activity and manage their available cash.</div>}
          </div>
        )}

        {(section === "deposits" || section === "withdrawals" || section === "transactions") && (
          <div className={`${panelClass} overflow-x-auto`}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold text-white">{transactions.length} records</h2><button onClick={exportTransactions} className="text-xs font-semibold text-blue-300 hover:text-white">Export CSV</button></div>
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="text-slate-400"><tr><th className="p-2">Date</th><th className="p-2">Investor</th><th className="p-2">Activity</th><th className="p-2">Amount</th><th className="p-2">Status</th><th className="p-2">Reference</th><th className="p-2">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredTransactions.map((item) => <tr key={item.id}>
                  <td className="p-2 text-slate-400">{new Date(item.date).toLocaleDateString()}</td><td className="p-2"><Link href="/admin-dashboard/users" className="font-semibold text-blue-300 hover:underline">{item.user?.name || "Unknown"}<span className="block font-normal text-slate-500">{item.user?.email || ""}</span></Link></td><td className="p-2 text-slate-300">{item.description}</td><td className="p-2 text-white">{money(item.amount)}</td><td className="p-2"><span className={item.status === "Completed" ? "text-emerald-300" : item.status === "Failed" ? "text-rose-300" : "text-amber-300"}>{item.status}</span></td><td className="p-2 text-slate-400">{item.reference}</td>
                  <td className="p-2">{item.status === "Pending" && (item.eventType === "deposit" || item.eventType === "withdrawal") ? <span className="flex gap-2"><button disabled={busyId === item.id} onClick={() => void reviewRequest(item, "Completed")} className="font-bold text-emerald-300 disabled:opacity-50">Approve</button><button disabled={busyId === item.id} onClick={() => void reviewRequest(item, "Failed")} className="font-bold text-rose-300 disabled:opacity-50">Reject</button></span> : <span className="text-slate-500">—</span>}</td>
                </tr>)}
              </tbody>
            </table>
            {!filteredTransactions.length && !loadingData && <p className="py-8 text-center text-sm text-slate-500">No matching activity.</p>}
          </div>
        )}

        {section === "investments" && <div className={`${panelClass} overflow-x-auto`}>
          <h2 className="mb-4 text-sm font-bold text-white">{filteredInvestments.length} investor positions</h2>
          <table className="w-full min-w-[850px] text-left text-xs"><thead className="text-slate-400"><tr><th className="p-2">Investor</th><th className="p-2">Investment</th><th className="p-2">Invested</th><th className="p-2">Current value</th><th className="p-2">Status</th><th className="p-2">Change status</th></tr></thead><tbody className="divide-y divide-slate-800/70">
            {filteredInvestments.map((item) => <tr key={item.id}><td className="p-2 text-white">{item.user?.name || "Unknown"}<span className="block text-slate-500">{item.user?.email}</span></td><td className="p-2 text-slate-300">{item.name} ({item.symbol})</td><td className="p-2">{money(item.investedAmount)}</td><td className="p-2">{money(item.currentValue)}</td><td className="p-2">{item.status}</td><td className="p-2"><select disabled={busyId === item.id} value={item.status} onChange={(event) => void updateInvestmentStatus(item, event.target.value as AdminInvestment["status"])} className={inputClass}><option>Active</option><option>Matured</option><option>Locked</option></select></td></tr>)}
          </tbody></table>
        </div>}

        {section === "plans" && <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={savePlan} className={`${panelClass} space-y-3`}>
            <h2 className="text-sm font-bold text-white">{editingPlanId ? "Edit investment plan" : "Create investment plan"}</h2>
            <input className={inputClass} required placeholder="Plan name" value={planForm.name} onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })} />
            <div className="grid grid-cols-2 gap-3"><input className={inputClass} required placeholder="Slug" value={planForm.slug} onChange={(event) => setPlanForm({ ...planForm, slug: event.target.value })} /><input className={inputClass} required placeholder="Symbol" value={planForm.symbol} onChange={(event) => setPlanForm({ ...planForm, symbol: event.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3"><select className={inputClass} value={planForm.category} onChange={(event) => setPlanForm({ ...planForm, category: event.target.value })}><option value="crypto">Crypto</option><option value="realestate">Real estate</option><option value="gold">Gold</option><option value="etfs">ETFs</option><option value="nfts">NFTs</option></select><select className={inputClass} value={planForm.riskLevel} onChange={(event) => setPlanForm({ ...planForm, riskLevel: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div className="grid grid-cols-3 gap-3"><input className={inputClass} type="number" min="0" step="any" placeholder="Price" value={planForm.price} onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })} /><input className={inputClass} type="number" min="0" step="any" placeholder="APY %" value={planForm.expectedApy} onChange={(event) => setPlanForm({ ...planForm, expectedApy: event.target.value })} /><input className={inputClass} required type="number" min="0" step="any" placeholder="Minimum" value={planForm.minInvestment} onChange={(event) => setPlanForm({ ...planForm, minInvestment: event.target.value })} /></div>
            <textarea className={inputClass} required placeholder="Description" value={planForm.description} onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })} />
            <input className={inputClass} placeholder="Tags (comma separated)" value={planForm.tags} onChange={(event) => setPlanForm({ ...planForm, tags: event.target.value })} />
            <div className="flex gap-2"><button className={buttonClass} disabled={busyId === "plan"}>{editingPlanId ? "Save plan" : "Create plan"}</button>{editingPlanId && <button type="button" onClick={() => { setEditingPlanId(""); setPlanForm({ name: "", slug: "", symbol: "", category: "crypto", price: "0", expectedApy: "0", minInvestment: "", riskLevel: "Medium", description: "", tags: "" }); }} className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300">Cancel</button>}</div>
          </form>
          <div className={`${panelClass} overflow-x-auto`}><h2 className="mb-4 text-sm font-bold text-white">Investment plans</h2><table className="w-full min-w-[650px] text-left text-xs"><thead className="text-slate-400"><tr><th className="p-2">Plan</th><th className="p-2">APY</th><th className="p-2">Minimum</th><th className="p-2">Availability</th><th className="p-2">Actions</th></tr></thead><tbody className="divide-y divide-slate-800/70">{plans.map((plan) => <tr key={plan._id}><td className="p-2 font-semibold text-white">{plan.name}<span className="block text-slate-500">{plan.slug} · {plan.symbol}</span></td><td className="p-2">{plan.expectedApy}%</td><td className="p-2">{money(plan.minInvestment)}</td><td className="p-2">{plan.active ? "Active" : "Inactive"}</td><td className="p-2"><button onClick={() => { setEditingPlanId(plan._id); setPlanForm({ name: plan.name, slug: plan.slug, symbol: plan.symbol, category: plan.category, price: String(plan.price), expectedApy: String(plan.expectedApy), minInvestment: String(plan.minInvestment), riskLevel: plan.riskLevel, description: plan.description, tags: plan.tags.join(", ") }); }} className="mr-3 font-bold text-blue-300">Edit</button>{plan.active && <button disabled={busyId === plan._id} onClick={() => void deactivatePlan(plan)} className="font-bold text-rose-300">Deactivate</button>}</td></tr>)}</tbody></table></div>
        </div>}

        {section === "settings" && <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={saveDepositMethod} className={`${panelClass} space-y-3`}><h2 className="text-sm font-bold text-white">Add deposit method</h2>
            {(["asset", "name", "network", "address"] as const).map((key) => <input key={key} required className={inputClass} placeholder={key[0].toUpperCase() + key.slice(1)} value={methodForm[key]} onChange={(event) => setMethodForm({ ...methodForm, [key]: event.target.value })} />)}
            <div className="grid grid-cols-2 gap-3"><input className={inputClass} type="number" min="0" step="any" placeholder="Minimum USD" value={methodForm.minimumUsdAmount} onChange={(event) => setMethodForm({ ...methodForm, minimumUsdAmount: event.target.value })} /><input className={inputClass} type="number" min="1" step="1" placeholder="Confirmations" value={methodForm.confirmations} onChange={(event) => setMethodForm({ ...methodForm, confirmations: event.target.value })} /></div>
            <button className={buttonClass} disabled={busyId === "method"}>Add method</button>
          </form>
          <div className={`${panelClass} space-y-3`}><h2 className="text-sm font-bold text-white">Deposit methods</h2>{methods.map((method) => <div key={method._id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 p-4 sm:flex-row sm:items-center"><div><strong className="text-sm text-white">{method.name} ({method.asset})</strong><p className="mt-1 text-xs text-slate-400">{method.network} · min {money(method.minimumUsdAmount)} · {method.confirmations} confirmations</p><p className="mt-1 break-all text-xs text-slate-500">{method.address}</p></div><button disabled={busyId === method._id} onClick={() => void toggleMethod(method)} className={`rounded-lg border px-3 py-2 text-xs font-bold ${method.active ? "border-emerald-500/30 text-emerald-300" : "border-slate-700 text-slate-400"}`}>{method.active ? "Active · Disable" : "Inactive · Enable"}</button></div>)}</div>
        </div>}

        {section === "reports" && <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
            ["Investors", numberValue(metrics.totalUsers)],
            ["Completed deposits", completedDeposits],
            ["Completed withdrawals", completedWithdrawals],
            ["Invested capital", totalInvested],
          ].map(([label, value]) => <div key={String(label)} className={panelClass}><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{typeof value === "number" && String(label) !== "Investors" ? money(value) : numberValue(value).toLocaleString()}</p></div>)}</div>
          <div className={`${panelClass} overflow-x-auto`}><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold text-white">Platform activity (latest 500)</h2><button onClick={exportTransactions} className="text-xs font-semibold text-blue-300 hover:text-white">Export CSV</button></div><table className="w-full min-w-[750px] text-left text-xs"><thead className="text-slate-400"><tr><th className="p-2">Date</th><th className="p-2">Investor</th><th className="p-2">Activity</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead><tbody className="divide-y divide-slate-800/70">{filteredTransactions.map((item) => <tr key={item.id}><td className="p-2 text-slate-400">{new Date(item.date).toLocaleDateString()}</td><td className="p-2 text-white">{item.user?.name || "Unknown"}<span className="block text-slate-500">{item.user?.email}</span></td><td className="p-2 text-slate-300">{item.description}</td><td className="p-2">{money(item.amount)}</td><td className="p-2">{item.status}</td></tr>)}</tbody></table></div>
        </div>}
      </main>
    </div>
  );
}
