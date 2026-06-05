import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { FinanceMock } from '../services/mockData';
import { CircleDollarSign, Plus, Calendar, Filter, Trash2, ArrowUpRight, ArrowDownRight, FileSpreadsheet } from 'lucide-react';

export default function FinancePage() {
  const { currentTenant, isOnline } = useApp();
  const [records, setRecords] = useState<FinanceMock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form input fields
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<'Tithe' | 'Offering' | 'Building Fund' | 'Missions' | 'Salary' | 'Utilities' | 'Maintenance' | 'Events'>('Tithe');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const loadFinanceRecords = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await apiService.getFinanceRecords(currentTenant.id);
      setRecords(data);
    } catch (err) {
      console.error('Error loading finance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceRecords();
  }, [currentTenant, isOnline]);

  const handleOpenAddModal = () => {
    setType('income');
    setCategory('Tithe');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setIsModalOpen(true);
  };

  // Adjust categories automatically when type toggles
  useEffect(() => {
    if (type === 'income') {
      setCategory('Tithe');
    } else {
      setCategory('Salary');
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newRecord: FinanceMock = {
      id: `fin-${Date.now()}`,
      type,
      category,
      amount: parsedAmount,
      date,
      description,
      tenantId: currentTenant.id
    };

    try {
      await apiService.saveFinanceRecord(newRecord);
      setIsModalOpen(false);
      loadFinanceRecords();
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this ledger entry?')) {
      try {
        await apiService.deleteFinanceRecord(id);
        loadFinanceRecords();
      } catch (err) {
        console.error('Error deleting finance record:', err);
      }
    }
  };

  // Calculate stats
  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

  // Filter lists
  const filteredRecords = records.filter(r => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            General Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">Audit church funds, Tithes, and Ministry expenditures.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Post Ledger Entry</span>
        </button>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Debits (Income)</span>
            <p className="text-lg font-bold text-emerald-400">+${totalIncome.toFixed(2)}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-emerald-500" />
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Credits (Expenses)</span>
            <p className="text-lg font-bold text-rose-400">-${totalExpense.toFixed(2)}</p>
          </div>
          <ArrowDownRight className="h-5 w-5 text-rose-500" />
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Standing</span>
            <p className={`text-lg font-bold ${balance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
          <CircleDollarSign className="h-5 w-5 text-cyan-500" />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex bg-slate-900/40 border border-slate-800/60 p-3 rounded-xl items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Filter View:</span>
        </div>
        <div className="flex space-x-1.5">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                filterType === type
                  ? 'bg-slate-800 text-white border border-slate-700/60'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <FileSpreadsheet className="h-10 w-10 text-slate-655 mx-auto" />
            <p className="text-sm font-semibold">No transactions posted yet</p>
            <p className="text-xs text-slate-605">Create your first ledger entry to populate the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Fund/Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 pl-6 text-slate-400 flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      <span>{record.date}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        record.type === 'income'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{record.description}</td>
                    <td className={`p-4 font-extrabold text-sm ${record.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-400 transition-colors"
                        title="Remove Entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post Ledger Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-lg font-bold text-white">Post Ledger Transaction</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select a category and log financial audits locally.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400">Transaction Type</span>
                <div className="flex bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      type === 'income' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    Debit (Income / Giving)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      type === 'expense' ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400' : 'text-slate-500'
                    }`}
                  >
                    Credit (Expense / Cost)
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="form-category" className="text-xs font-bold text-slate-400">Allocation Category</label>
                <select
                  id="form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Tithe">Tithe</option>
                      <option value="Offering">Offering</option>
                      <option value="Building Fund">Building Fund</option>
                      <option value="Missions">Missions</option>
                      <option value="Events">Events</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Events">Events</option>
                      <option value="Missions">Missions</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="form-amount" className="text-xs font-bold text-slate-400">Amount ($ USD)</label>
                  <input
                    id="form-amount"
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="form-date" className="text-xs font-bold text-slate-400">Billing Date</label>
                  <input
                    id="form-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="form-desc" className="text-xs font-bold text-slate-400">Description / Memo</label>
                <input
                  id="form-desc"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Weekly tithe or utility pay"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-white text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
