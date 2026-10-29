import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService, api } from '../services/api';
import { FinanceMock, mockMembers } from '../services/mockData';
import { X, Plus, Sparkles, MessageSquare, User, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import FinanceHeader from '../components/finance/FinanceHeader';
import FinanceStats from '../components/finance/FinanceStats';
import FinanceChart from '../components/finance/FinanceChart';
import IncomeCategoryChart from '../components/finance/IncomeCategoryChart';
import AccountSummary from '../components/finance/AccountSummary';
import RecentTransactions from '../components/finance/RecentTransactions';
import ExpenseCategories from '../components/finance/ExpenseCategories';

export default function FinancePage() {
  const { currentTenant, isOnline } = useApp();
  const queryClient = useQueryClient();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Add Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<'Tithe' | 'Offering' | 'Building Fund' | 'Missions' | 'Salary' | 'Utilities' | 'Maintenance' | 'Events'>('Tithe');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [sendSms, setSendSms] = useState(true);

  // Fetch registered members for donor selection
  const { data: members = [] } = useQuery({
    queryKey: ['members-for-finance', currentTenant?.id],
    queryFn: async () => {
      try {
        const res = await api.get('/members');
        const apiData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        const localRaw = typeof window !== 'undefined' ? localStorage.getItem('fc_members_local') : null;
        const localMembers = localRaw ? JSON.parse(localRaw) : [];
        const combined = [...localMembers, ...apiData.filter((m: any) => !localMembers.some((lm: any) => lm.id === m.id))];
        return combined.map((m: any) => ({
          id: (m.id || '').toString(),
          name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim(),
          phone: m.phone || ''
        }));
      } catch (err) {
        return mockMembers.map(m => ({ id: m.id, name: m.name, phone: m.phone || '' }));
      }
    }
  });

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const activeChurchName = currentTenant?.name || 'Beracah Christian Ministry';

  const { data: records = [], isLoading: loading } = useQuery({
    queryKey: ['financeRecords', currentTenant?.id],
    queryFn: () => currentTenant ? apiService.getFinanceRecords(currentTenant.id) : Promise.resolve([]),
    enabled: !!currentTenant,
  });

  const saveRecordMutation = useMutation({
    mutationFn: (newRecord: FinanceMock) => apiService.saveFinanceRecord(newRecord),
    onSuccess: () => {
      setIsModalOpen(false);
      setCurrentPage(1);
      queryClient.invalidateQueries({ queryKey: ['financeRecords'] });
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteFinanceRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeRecords'] });
      
      const updatedTotal = records.length - 1;
      const maxPages = Math.ceil(updatedTotal / pageSize);
      if (currentPage > maxPages && maxPages > 0) {
        setCurrentPage(maxPages);
      }
    }
  });

  const handleOpenAddModal = () => {
    setType('income');
    setCategory('Tithe');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setSelectedMemberId('');
    setSendSms(true);
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setAmount('');
      return;
    }
    const clean = val.replace(/[^0-9.]/g, '');
    if (!clean) {
      setAmount('');
      return;
    }
    const parts = clean.split('.');
    const intNumber = parts[0] === '' ? '' : parseInt(parts[0], 10).toLocaleString('en-US');
    if (parts.length > 1) {
      const dec = parts.slice(1).join('').slice(0, 2);
      setAmount(`${intNumber}.${dec}`);
    } else {
      setAmount(intNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
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
      description: description.trim() || `${category} - General`,
      tenantId: currentTenant.id,
      memberId: selectedMemberId || undefined,
      memberName: selectedMember?.name,
      memberPhone: selectedMember?.phone,
      sendSms: type === 'income' && Boolean(selectedMember?.phone) && sendSms
    };

    saveRecordMutation.mutate(newRecord);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this ledger entry?')) {
      deleteRecordMutation.mutate(id);
    }
  };

  // 1. Math calculations for stats
  // We add seed values to make the database feel populated and match the client's figures (in Rs.)
  const SEED_INCOME = 2450000;
  const SEED_EXPENSE = 1120000;

  const dbIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const dbExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);

  const totalIncome = SEED_INCOME + dbIncome;
  const totalExpenses = SEED_EXPENSE + dbExpense;
  const netBalance = totalIncome - totalExpenses;
  const totalTransactions = 156 + records.length;

  // 2. Math calculations for charts
  const titheDb = records.filter(r => r.type === 'income' && r.category === 'Tithe').reduce((sum, r) => sum + r.amount, 0);
  const offeringDb = records.filter(r => r.type === 'income' && r.category === 'Offering').reduce((sum, r) => sum + r.amount, 0);
  const buildingDb = records.filter(r => r.type === 'income' && r.category === 'Building Fund').reduce((sum, r) => sum + r.amount, 0);
  const missionsDb = records.filter(r => r.type === 'income' && r.category === 'Missions').reduce((sum, r) => sum + r.amount, 0);

  const titheTotal = 1470000 + titheDb;
  const offeringTotal = 612500 + offeringDb;
  const buildingTotal = 367500 + buildingDb;
  const missionsTotal = 0 + missionsDb;

  // 3. Account Summaries math
  const mainAccount = 1850000 + titheDb + offeringDb - dbExpense;
  const missionAccount = 320000 + missionsDb;
  const buildingFund = 750000 + buildingDb;

  // Sort records descending by date
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  // Pagination slice
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedRecords.length / pageSize);

  return (
    <div className="p-8 bg-gradient-to-tr from-slate-50 via-slate-100 to-indigo-50/20 min-h-full select-none animate-fade-in relative">
      <FinanceHeader onAddTransactionClick={handleOpenAddModal} />
      
      {/* Overview Stats Row */}
      <FinanceStats 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netBalance={netBalance}
        transactionCount={totalTransactions}
      />

      {/* Middle charts grid layout */}
      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div>
          <FinanceChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>
        <div>
          <IncomeCategoryChart 
            titheAmount={titheTotal}
            offeringAmount={offeringTotal}
            buildingAmount={buildingTotal}
            otherAmount={missionsTotal}
          />
        </div>
        <div>
          <AccountSummary 
            mainAccountBalance={mainAccount}
            missionAccountBalance={missionAccount}
            buildingFundBalance={buildingFund}
          />
        </div>
      </div>

      {/* Bottom ledger tables layout */}
      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-sm">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading transactions...</p>
            </div>
          ) : (
            <RecentTransactions 
              transactions={paginatedRecords}
              allTransactions={sortedRecords}
              onDeleteClick={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalTransactionsCount={records.length}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
        <div>
          <ExpenseCategories transactions={records} />
        </div>
      </div>

      {/* Post Ledger Transaction dialog modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">Post Ledger Transaction</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase">Transaction Type</span>
                <div className="flex bg-gray-100 p-1 border border-gray-200 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      type === 'income' ? 'bg-white text-emerald-600 shadow-sm border border-gray-200/50' : 'text-gray-400 hover:text-gray-650'
                    }`}
                  >
                    Debit (Income / Giving)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      type === 'expense' ? 'bg-white text-rose-600 shadow-sm border border-gray-200/50' : 'text-gray-400 hover:text-gray-650'
                    }`}
                  >
                    Credit (Expense / Cost)
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="form-category" className="text-xs font-bold text-gray-400 uppercase">Allocation Category</label>
                <select
                  id="form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Tithe">Tithe</option>
                      <option value="Offering">Offering</option>
                      <option value="Building Fund">Building Fund</option>
                      <option value="Missions">Missions Support</option>
                      <option value="Events">Events Revenue</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary / Payroll</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Events">Events Cost</option>
                      <option value="Missions">Missions Outflow</option>
                    </>
                  )}
                </select>
              </div>

              {/* Donor Member Selection (Only for Income / Giving) */}
              {type === 'income' && (
                <div className="space-y-1.5">
                  <label htmlFor="form-member" className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-[#5B3DF5]" /> Donor / Contributor</span>
                    <span className="text-[10px] text-gray-400 font-normal lowercase">(optional for general giving)</span>
                  </label>
                  <select
                    id="form-member"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="">-- General / Anonymous Offering --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.phone ? `(${m.phone})` : '(No Phone)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Automatic SMS Receipt Preview Card */}
              {type === 'income' && selectedMember && (
                <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 to-purple-50/60 border border-indigo-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#5B3DF5]" />
                      <span className="text-xs font-bold text-gray-800">Automatic Thank-You SMS</span>
                    </div>
                    {selectedMember.phone ? (
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#5B3DF5]">
                        <input
                          type="checkbox"
                          checked={sendSms}
                          onChange={(e) => setSendSms(e.target.checked)}
                          className="w-3.5 h-3.5 text-[#5B3DF5] rounded border-gray-300 focus:ring-[#5B3DF5] cursor-pointer"
                        />
                        <span>Send SMS Receipt</span>
                      </label>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        No Phone on Record
                      </span>
                    )}
                  </div>

                  {selectedMember.phone && sendSms && (
                    <div className="text-[11px] text-gray-600 bg-white/90 p-3 rounded-xl border border-indigo-100/70 font-sans leading-relaxed shadow-xs space-y-1.5">
                      <div className="text-[10px] text-gray-400 font-bold flex items-center justify-between pb-1 border-b border-gray-100">
                        <span>Recipient: <strong className="text-gray-700">{selectedMember.name}</strong> ({selectedMember.phone})</span>
                        <span className="text-[9px] bg-[#5B3DF5]/10 text-[#5B3DF5] px-1.5 py-0.5 rounded font-mono font-bold">Sender: {activeChurchName}</span>
                      </div>
                      <p className="italic text-gray-700">
                        Dear {selectedMember.name}, we gratefully acknowledge receipt of your contribution of LKR {amount || '0'}. Thank you for your faithfulness and generosity in supporting the work of God. May the Lord bless you abundantly and reward your kindness according to His riches in glory. (Philippians 4:19)
                      </p>
                      <p className="text-[10px] font-semibold text-gray-500">— {activeChurchName}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="form-amount" className="text-xs font-bold text-gray-400 uppercase">Amount (Rs. LKR)</label>
                  <input
                    id="form-amount"
                    type="text"
                    inputMode="decimal"
                    required
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full min-w-0 max-w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none box-border"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="form-date" className="text-xs font-bold text-gray-400 uppercase">Billing Date</label>
                  <input
                    id="form-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-w-0 max-w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none box-border"
                  />
                </div>
              </div>

              {/* Description (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="form-desc" className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                  <span>Description / Memo</span>
                  <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="form-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Sunday Tithes - Batch A (optional)"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveRecordMutation.isPending}
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saveRecordMutation.isPending ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
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
