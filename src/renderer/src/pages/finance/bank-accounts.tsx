import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { BankAccountMock, FinanceMock } from '../../services/mockData';

import BankStats from '../../components/finance/bank-accounts/BankStats';
import BankFilters from '../../components/finance/bank-accounts/BankFilters';
import BankAccountsTable from '../../components/finance/bank-accounts/BankAccountsTable';
import BankAccountDetails from '../../components/finance/bank-accounts/BankAccountDetails';
import AccountSummary from '../../components/finance/bank-accounts/AccountSummary';
import CategoriesPagination from '../../components/finance/categories/CategoriesPagination';

export default function FinanceBankAccountsPage() {
  const { currentTenant } = useApp();
  const [accounts, setAccounts] = useState<BankAccountMock[]>([]);
  const [financeRecords, setFinanceRecords] = useState<FinanceMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedAccount, setSelectedAccount] = useState<BankAccountMock | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');

  // Form Fields
  const [formBankName, setFormBankName] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountType, setFormAccountType] = useState<'Current' | 'Savings'>('Current');
  const [formBalance, setFormBalance] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formCurrency, setFormCurrency] = useState('LKR');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const bankAccounts = await apiService.getBankAccounts(currentTenant.id);
      const records = await apiService.getFinanceRecords(currentTenant.id);
      setAccounts(bankAccounts);
      setFinanceRecords(records);

      if (bankAccounts.length > 0) {
        setSelectedAccount(bankAccounts[0]);
      } else {
        setSelectedAccount(null);
      }
    } catch (err) {
      console.error('Error loading bank accounts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Apply filters
  const filteredAccounts = accounts.filter(a => {
    const matchesSearch =
      a.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.includes(searchTerm);

    const matchesType = typeFilter === 'all' || a.accountType === typeFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort alphabetically
  const sortedAccounts = [...filteredAccounts].sort((a, b) => a.bankName.localeCompare(b.bankName));
  const totalPages = Math.max(1, Math.ceil(sortedAccounts.length / pageSize));
  const paginatedAccounts = sortedAccounts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Keep selection synced
  useEffect(() => {
    if (paginatedAccounts.length > 0) {
      const isStillVisible = paginatedAccounts.some(a => a.id === selectedAccount?.id);
      if (!isStillVisible) {
        setSelectedAccount(paginatedAccounts[0]);
      }
    } else {
      setSelectedAccount(null);
    }
  }, [searchTerm, typeFilter, statusFilter, currentPage, accounts]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormBankName('');
    setFormAccountName('');
    setFormAccountNumber('');
    setFormAccountType('Current');
    setFormBalance('');
    setFormBranch('');
    setFormCurrency('LKR');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: BankAccountMock) => {
    setModalMode('edit');
    setEditId(acc.id);
    setFormBankName(acc.bankName);
    setFormAccountName(acc.accountName);
    setFormAccountNumber(acc.accountNumber);
    setFormAccountType(acc.accountType);
    setFormBalance(acc.balance.toString());
    setFormBranch(acc.branch);
    setFormCurrency(acc.currency);
    setFormStatus(acc.status);
    setIsModalOpen(true);
  };

  const handleToggleAccountStatus = async (acc: BankAccountMock) => {
    if (!currentTenant) return;
    const newStatus = acc.status === 'Active' ? 'Inactive' : 'Active';
    const confirmMsg = newStatus === 'Inactive'
      ? `Are you sure you want to deactivate the account: "${acc.bankName} - ${acc.accountName}"?`
      : `Are you sure you want to reactivate the account: "${acc.bankName} - ${acc.accountName}"?`;

    if (confirm(confirmMsg)) {
      try {
        const updatedAccount: BankAccountMock = {
          ...acc,
          status: newStatus
        };
        await apiService.saveBankAccount(updatedAccount);
        const bankAccounts = await apiService.getBankAccounts(currentTenant.id);
        setAccounts(bankAccounts);
        
        // Sync detail pane selection
        if (selectedAccount?.id === acc.id) {
          setSelectedAccount(bankAccounts.find(a => a.id === acc.id) || null);
        }
      } catch (err) {
        console.error('Error toggling bank account status:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formBankName.trim() || !formAccountName.trim() || !formAccountNumber.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const parsedBalance = parseFloat(formBalance);
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      alert('Please enter a valid initial balance.');
      return;
    }

    // Duplicate account number check
    const isDuplicate = accounts.some(
      a => a.accountNumber.trim().replace(/\s/g, '') === formAccountNumber.trim().replace(/\s/g, '') && a.id !== editId
    );
    if (isDuplicate) {
      alert(`An account with the account number "${formAccountNumber.trim()}" already exists.`);
      return;
    }

    const originalAccount = accounts.find(a => a.id === editId);

    const accountData: BankAccountMock = {
      id: modalMode === 'add' ? `bank-${Date.now()}` : editId,
      bankName: formBankName.trim(),
      accountName: formAccountName.trim(),
      accountNumber: formAccountNumber.trim(),
      accountType: formAccountType,
      balance: parsedBalance,
      status: formStatus,
      branch: formBranch.trim() || 'Main Branch',
      currency: formCurrency,
      ledgerBalance: parsedBalance, // Sync ledger balance by default
      lastStatementDate: originalAccount?.lastStatementDate || new Date().toISOString().split('T')[0],
      createdOn: originalAccount?.createdOn || new Date().toISOString().split('T')[0],
      createdBy: originalAccount?.createdBy || 'Pastor John',
      tenantId: currentTenant.id
    };

    try {
      await apiService.saveBankAccount(accountData);
      const bankAccounts = await apiService.getBankAccounts(currentTenant.id);
      setAccounts(bankAccounts);
      setIsModalOpen(false);

      const target = bankAccounts.find(a => a.id === accountData.id);
      if (target) {
        setSelectedAccount(target);
      }
    } catch (err) {
      console.error('Error saving bank account:', err);
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Bank Accounts
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/finance" className="hover:text-gray-600">Finance</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Bank Accounts</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Add New Bank Account
        </button>
      </div>

      {/* Stats Cards */}
      <BankStats accounts={accounts} financeRecords={financeRecords} />

      {/* Filters Panel */}
      <BankFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden animate-fade-in">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading accounts...</p>
            </div>
          ) : (
            <>
              <BankAccountsTable
                accounts={paginatedAccounts}
                selectedAccount={selectedAccount}
                onSelectAccount={setSelectedAccount}
                onEditAccount={handleOpenEditModal}
                onToggleAccountStatus={handleToggleAccountStatus}
              />
              <CategoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalCategoriesCount={sortedAccounts.length}
              />
            </>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-4">
          <BankAccountDetails
            account={selectedAccount}
            onEdit={() => selectedAccount && handleOpenEditModal(selectedAccount)}
            onToggleStatus={() => selectedAccount && handleToggleAccountStatus(selectedAccount)}
            onViewTransactions={() => {
              if (selectedAccount) {
                alert(`Redirecting to transaction ledger details for ${selectedAccount.bankName}...`);
              }
            }}
          />
        </div>
      </div>

      {/* Account Portfolio Summary section */}
      {!loading && accounts.length > 0 && (
        <div className="mt-6">
          <AccountSummary accounts={accounts} />
        </div>
      )}

      {/* Add / Edit Bank Account Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {modalMode === 'add' ? 'Add New Bank Account' : 'Edit Bank Account'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Bank Name */}
              <div className="space-y-1.5">
                <label htmlFor="bank-name" className="text-xs font-bold text-gray-400 uppercase">
                  Bank Name
                </label>
                <input
                  id="bank-name"
                  type="text"
                  required
                  value={formBankName}
                  onChange={(e) => setFormBankName(e.target.value)}
                  placeholder="e.g. Hatton National Bank"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Account Name */}
              <div className="space-y-1.5">
                <label htmlFor="account-name" className="text-xs font-bold text-gray-400 uppercase">
                  Account Name
                </label>
                <input
                  id="account-name"
                  type="text"
                  required
                  value={formAccountName}
                  onChange={(e) => setFormAccountName(e.target.value)}
                  placeholder="e.g. Building Fund Account"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1.5">
                <label htmlFor="account-number" className="text-xs font-bold text-gray-400 uppercase">
                  Account Number
                </label>
                <input
                  id="account-number"
                  type="text"
                  required
                  value={formAccountNumber}
                  onChange={(e) => setFormAccountNumber(e.target.value)}
                  placeholder="e.g. 1210 1200 1234 567"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none font-mono"
                />
              </div>

              {/* Account Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="account-type" className="text-xs font-bold text-gray-400 uppercase">
                    Account Type
                  </label>
                  <select
                    id="account-type"
                    value={formAccountType}
                    onChange={(e) => setFormAccountType(e.target.value as 'Current' | 'Savings')}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="account-status" className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    id="account-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Branch and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="account-branch" className="text-xs font-bold text-gray-400 uppercase">
                    Branch Location
                  </label>
                  <input
                    id="account-branch"
                    type="text"
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    placeholder="e.g. Colombo 03 Branch"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="account-currency" className="text-xs font-bold text-gray-400 uppercase">
                    Currency
                  </label>
                  <input
                    id="account-currency"
                    type="text"
                    required
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>
              </div>

              {/* Balance */}
              <div className="space-y-1.5">
                <label htmlFor="account-balance" className="text-xs font-bold text-gray-400 uppercase">
                  Balance (LKR)
                </label>
                <input
                  id="account-balance"
                  type="number"
                  step="0.01"
                  required
                  value={formBalance}
                  onChange={(e) => setFormBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-855 focus:outline-none"
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
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Create Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
