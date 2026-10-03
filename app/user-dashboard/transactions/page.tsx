'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Receipt,
  CreditCard,
  DollarSign,
  Copy,
  Check,
} from 'lucide-react';
import DashboardLayout from '@/components/Sidebar';
import api from '@/utils/axios';

type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
type TransactionType = 'Income' | 'Expense' | 'Transfer' | 'Refund';

interface Transaction {
  id: string;
  reference: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  time: string;
  paymentMethod: string;
  fee: number;
  senderRecipient: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState({ totalVolume: 0, totalIncome: 0, totalExpenses: 0, pendingCount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedRef, setCopiedRef] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    api.get('/api/portal/transactions').then(({ data }) => {
      setTransactions(data.data.transactions);
      setMetrics(data.data.metrics);
    }).catch((error) => console.error('Could not load transactions:', error));
  }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.senderRecipient.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || txn.type === selectedType;
      const matchesStatus = selectedStatus === 'All' || txn.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, selectedType, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Metrics Summary
  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Reference,Description,Amount,Type,Status,Date,Payment Method\n';
    const rows = filteredTransactions
      .map((t) => `"${t.id}","${t.reference}","${t.description}",${t.amount},"${t.type}","${t.status}","${t.date}","${t.paymentMethod}"`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout defaultTab="Transactions">
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Transactions</h1>
            <p className="text-slate-400 text-sm mt-1">
              Monitor, filter, and manage all inbound and outbound account activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Volume</span>
              <DollarSign size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">${metrics.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Income</span>
              <ArrowDownLeft size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">${metrics.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Expenses</span>
              <ArrowUpRight size={18} className="text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white">${metrics.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Approvals</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{metrics.pendingCount} Items</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search description, reference, or counterparty..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Type Dropdown */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400 hidden sm:block" />
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Transfer">Transfer</option>
                <option value="Refund">Refund</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Transaction</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            txn.type === 'Income' ? 'bg-emerald-500/10 text-emerald-400' :
                            txn.type === 'Expense' ? 'bg-rose-500/10 text-rose-400' :
                            txn.type === 'Refund' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {txn.type === 'Income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                            <div className="font-medium text-slate-100">{txn.description}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{txn.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        <div>{txn.date}</div>
                        <div>{txn.time}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={14} className="text-slate-400" />
                          <span>{txn.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        <span className={
                          txn.type === 'Income' || txn.type === 'Refund' ? 'text-emerald-400' : 'text-slate-100'
                        }>
                          {txn.type === 'Income' || txn.type === 'Refund' ? '+' : '-'}
                          ${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No transactions matched your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing <span className="font-medium text-slate-200">{filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
              <span className="font-medium text-slate-200">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{' '}
              <span className="font-medium text-slate-200">{filteredTransactions.length}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-2 font-medium text-slate-300">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt className="text-blue-400" size={20} />
                  <h3 className="font-semibold text-slate-100">Transaction Details</h3>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center pb-4 border-b border-slate-800/80">
                  <div className="text-xs uppercase text-slate-400 tracking-wider mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-white">
                    ${selectedTxn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-2 inline-block">
                    <StatusBadge status={selectedTxn.status} />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Description</span>
                    <span className="text-slate-200 font-medium">{selectedTxn.description}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Counterparty</span>
                    <span className="text-slate-200 font-medium">{selectedTxn.senderRecipient}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Reference ID</span>
                    <button
                      onClick={() => handleCopyReference(selectedTxn.reference)}
                      className="flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:text-blue-300"
                    >
                      <span>{selectedTxn.reference}</span>
                      {copiedRef ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Date & Time</span>
                    <span className="text-slate-200">{selectedTxn.date} at {selectedTxn.time}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Payment Method</span>
                    <span className="text-slate-200">{selectedTxn.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between py-1 border-t border-slate-800/60 pt-3">
                    <span className="text-slate-400">Processing Fee</span>
                    <span className="text-slate-200">${selectedTxn.fee.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={12} />
          Completed
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock size={12} />
          Pending
        </span>
      );
    case 'Failed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle size={12} />
          Failed
        </span>
      );
  }
}