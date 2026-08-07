import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { ReceiptMock } from '../../services/mockData';
import { X, Plus, Landmark, Banknote, CreditCard, Sparkles } from 'lucide-react';

import ReceiptsHeader from '../../components/finance/e-receipts/ReceiptsHeader';
import ReceiptStats from '../../components/finance/e-receipts/ReceiptStats';
import ReceiptFilters from '../../components/finance/e-receipts/ReceiptFilters';
import ReceiptTable from '../../components/finance/e-receipts/ReceiptTable';
import ReceiptPreview from '../../components/finance/e-receipts/ReceiptPreview';

export default function FinanceEReceiptsPage() {
  const { currentTenant, isOnline } = useApp();
  const [receipts, setReceipts] = useState<ReceiptMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedMethod, setSelectedMethod] = useState('All Payment Methods');
  const [selectedDate, setSelectedDate] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Receipt Preview
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptMock | null>(null);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [category, setCategory] = useState('Tithes');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Bank Transfer' | 'Card' | 'Online'>('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Load receipts from local storage / API
  const loadReceipts = async () => {
    if (!currentTenant) return;
    setLoading(false); // Make sure it sets loading to false
    try {
      const data = await apiService.getReceipts(currentTenant.id);
      setReceipts(data);
      if (data.length > 0) {
        // Set first receipt as active preview by default if none is selected
        setSelectedReceipt((prev) => {
          if (prev) {
            const found = data.find((r) => r.id === prev.id);
            return found || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedReceipt(null);
      }
    } catch (err) {
      console.error('Error loading receipts:', err?.message || 'Error occurred');
    }
  };

  useEffect(() => {
    loadReceipts();
  }, [currentTenant, isOnline]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedMethod('All Payment Methods');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Unique categories and methods for filter dropdowns
  const uniqueCategories = Array.from(new Set(receipts.map((r) => r.category)));
  const uniqueMethods = Array.from(new Set(receipts.map((r) => r.method)));

  // Filter processing
  const filteredReceipts = receipts.filter((item) => {
    const matchesSearch =
      item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.memberEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;

    const matchesMethod =
      selectedMethod === 'All Payment Methods' || item.method === selectedMethod;

    const matchesDate = selectedDate === '' || item.date === selectedDate;

    return matchesSearch && matchesCategory && matchesMethod && matchesDate;
  });

  // Calculate pages
  const totalPages = Math.ceil(filteredReceipts.length / pageSize);

  // Paginated subset
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page if page count decreases
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Handle row selection
  const handleSelectReceipt = (item: ReceiptMock) => {
    setSelectedReceipt(item);
  };

  // Add new receipt handler
  const handleOpenModal = () => {
    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setCategory('Tithes');
    setAmount('');
    setMethod('Cash');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Determine the next receipt number sequentially
    const currentYear = new Date().getFullYear();
    const prefix = `RCP-${currentYear}-`;
    const numberedReceipts = receipts
      .filter((r) => r.receiptNo.startsWith(prefix))
      .map((r) => parseInt(r.receiptNo.replace(prefix, ''), 10))
      .filter((num) => !isNaN(num));

    const nextNumber = numberedReceipts.length > 0 ? Math.max(...numberedReceipts) + 1 : 1000;
    const receiptNo = `${prefix}${nextNumber}`;

    const newReceipt: ReceiptMock = {
      id: `rcp-${Date.now()}`,
      receiptNo,
      date,
      memberName,
      memberEmail,
      memberPhone: memberPhone || 'N/A',
      category,
      amount: parsedAmount,
      method,
      status: 'Emailed', // Default status upon creation
      receivedBy: 'Pastor John', // Default receptionist
      description: description || `${category} contribution`,
      tenantId: currentTenant.id
    };

    try {
      await apiService.saveReceipt(newReceipt);
      setIsModalOpen(false);
      await loadReceipts();
      setSelectedReceipt(newReceipt); // Preview the newly added receipt
      setCurrentPage(1); // Go back to first page to see the new receipt
    } catch (err) {
      console.error('Error saving receipt:', err?.message || 'Error occurred');
    }
  };

  const handleExport = () => {
    // Generate clean CSV of filtered receipts
    const headers = ['Receipt No', 'Date', 'Member Name', 'Member Email', 'Category', 'Amount (Rs)', 'Method', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredReceipts.map((r) =>
        [
          r.receiptNo,
          r.date,
          `"${r.memberName.replace(/"/g, '""')}"`,
          r.memberEmail,
          r.category,
          r.amount,
          r.method,
          r.status
        ].join(',')
      )
    ];

    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `E-Receipts-Export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      <ReceiptsHeader onCreateReceiptClick={handleOpenModal} onExportClick={handleExport} />
      
      <ReceiptStats receipts={receipts} />

      <ReceiptFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClearFilters={handleClearFilters}
        categories={uniqueCategories}
        methods={uniqueMethods}
      />

      <div className="grid lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Receipts Table List */}
        <div className="lg:col-span-8 xl:col-span-9 h-full">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-150 shadow-sm">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading e-receipts...</p>
            </div>
          ) : (
            <ReceiptTable
              receipts={paginatedReceipts}
              allReceiptsCount={filteredReceipts.length}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              selectedReceiptId={selectedReceipt?.id || ''}
              onSelectReceipt={handleSelectReceipt}
              onViewDetails={handleSelectReceipt}
            />
          )}
        </div>

        {/* Selected Receipt preview slit */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-6">
          <ReceiptPreview item={selectedReceipt} />
        </div>
      </div>

      {/* Create New Receipt Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">Create New Receipt</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Member Name */}
              <div className="space-y-1.5">
                <label htmlFor="form-member-name" className="text-xs font-bold text-gray-400 uppercase">Member Name</label>
                <input
                  id="form-member-name"
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Saman Perera"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                />
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Member Email */}
                <div className="space-y-1.5">
                  <label htmlFor="form-member-email" className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    id="form-member-email"
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="saman@email.com"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>

                {/* Member Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="form-member-phone" className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    id="form-member-phone"
                    type="text"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Amount */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="form-receipt-category" className="text-xs font-bold text-gray-400 uppercase">Category</label>
                  <select
                    id="form-receipt-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Tithes">Tithes</option>
                    <option value="Offerings">Offerings</option>
                    <option value="Donations">Donations</option>
                    <option value="Thanksgiving">Thanksgiving</option>
                    <option value="Event">Event</option>
                    <option value="Other Income">Other Income</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="form-receipt-amount" className="text-xs font-bold text-gray-400 uppercase">Amount (Rs.)</label>
                  <input
                    id="form-receipt-amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Method & Date */}
              <div className="grid grid-cols-2 gap-4">
                {/* Method */}
                <div className="space-y-1.5">
                  <label htmlFor="form-receipt-method" className="text-xs font-bold text-gray-400 uppercase">Payment Method</label>
                  <select
                    id="form-receipt-method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="form-receipt-date" className="text-xs font-bold text-gray-400 uppercase">Billing Date</label>
                  <input
                    id="form-receipt-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="form-receipt-desc" className="text-xs font-bold text-gray-400 uppercase">Description / Memo</label>
                <input
                  id="form-receipt-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Sunday Tithes - May 2025"
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
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  Create Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
