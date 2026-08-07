import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { LetterMock } from '../services/mockData';

import LetterStats from '../components/letters/LetterStats';
import LetterFilters from '../components/letters/LetterFilters';
import LettersTable from '../components/letters/LettersTable';
import LetterDetails from '../components/letters/LetterDetails';
import CategoriesPagination from '../components/finance/categories/CategoriesPagination';

// Form Auto-Templates based on Letter Type
const LETTER_TEMPLATES = {
  Confirmation: `Dear [Recipient],\n\nWe are pleased to confirm your membership at Kingdom Connect Church. We look forward to growing together in faith and serving the Lord as one family.\n\nMay God bless you abundantly.`,
  Approval: `Dear [Recipient],\n\nWe are pleased to inform you that your request for holy baptism has been approved. The baptism service will be scheduled soon.\n\nGod bless you on this spiritual journey.`,
  Appreciation: `Dear [Recipient],\n\nOn behalf of Kingdom Connect Church, we express our sincere appreciation for your recent donation. Your generous support helps us continue our ministries and serve our community.\n\nThank you for your faithfulness.`,
  Invitation: `Dear [Recipient],\n\nYou are cordially invited to our upcoming Family Fellowship Night. Join us for an evening of food, games, and fellowship.\n\nHope to see you all there!`,
  Condolence: `Dear [Recipient] Family,\n\nWe are deeply saddened to hear about the passing of your beloved family member. Please accept our heartfelt condolences. Our thoughts and prayers are with you during this difficult time.\n\nWith love and prayers.`,
  Appointment: `Dear [Recipient],\n\nWe are pleased to officially appoint you to the designated volunteer team. We believe God has gifted you for this role and look forward to your service.\n\nIn His service.`,
  Notice: `Dear Members,\n\nPlease note that our next weekly prayer meeting will be held on Wednesday at 6:30 PM in the main chapel.\n\nBlessings.`
};

export default function LettersPage() {
  const { currentTenant } = useApp();
  const [letters, setLetters] = useState<LetterMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedLetter, setSelectedLetter] = useState<LetterMock | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<LetterMock['type']>('Confirmation');
  const [formRecipient, setFormRecipient] = useState('');
  const [formRecipientEmail, setFormRecipientEmail] = useState('');
  const [formRecipientPhone, setFormRecipientPhone] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState<LetterMock['status']>('Draft');
  const [formContent, setFormContent] = useState('');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const list = await apiService.getLetters(currentTenant.id);
      setLetters(list);

      // Default select the first letter in the raw list
      if (list.length > 0) {
        setSelectedLetter(list[0]);
      } else {
        setSelectedLetter(null);
      }
    } catch (err) {
      console.error('Error loading letters:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter letters
  const filteredLetters = letters.filter(l => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || l.date === dateFilter;
    const matchesType = typeFilter === 'all' || l.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  // Sort by Letter ID descending (newest first)
  const sortedLetters = [...filteredLetters].sort((a, b) => b.id.localeCompare(a.id));

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(sortedLetters.length / pageSize));
  const paginatedLetters = sortedLetters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sync selected details pane on filter or list change
  useEffect(() => {
    if (paginatedLetters.length > 0) {
      const isStillVisible = paginatedLetters.some(l => l.id === selectedLetter?.id);
      if (!isStillVisible) {
        setSelectedLetter(paginatedLetters[0]);
      }
    } else {
      setSelectedLetter(null);
    }
  }, [searchTerm, dateFilter, typeFilter, statusFilter, currentPage, letters]);

  // Handle template auto-population when form type is changed
  const handleTypeChange = (newType: LetterMock['type']) => {
    setFormType(newType);
    
    // Auto populate template body only if not editing or if content is empty
    const tpl = LETTER_TEMPLATES[newType];
    const namePlaceholder = formRecipient || '[Recipient]';
    const resolvedTpl = tpl.replace('[Recipient]', namePlaceholder);
    setFormContent(resolvedTpl);
  };

  // Keep template synced when recipient name changes
  const handleRecipientChange = (newRecipient: string) => {
    setFormRecipient(newRecipient);
    
    // Update content placeholder if content is still a default template
    const tpl = LETTER_TEMPLATES[formType];
    if (formContent === tpl || formContent.includes('[Recipient]')) {
      const resolvedTpl = tpl.replace('[Recipient]', newRecipient || '[Recipient]');
      setFormContent(resolvedTpl);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormTitle('');
    setFormType('Confirmation');
    setFormRecipient('');
    setFormRecipientEmail('');
    setFormRecipientPhone('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Draft');
    setFormContent(LETTER_TEMPLATES.Confirmation.replace('[Recipient]', '[Recipient]'));
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (letter: LetterMock) => {
    setModalMode('edit');
    setEditId(letter.id);
    setFormTitle(letter.title);
    setFormType(letter.type);
    setFormRecipient(letter.recipient);
    setFormRecipientEmail(letter.recipientEmail);
    setFormRecipientPhone(letter.recipientPhone);
    setFormDate(letter.date);
    setFormStatus(letter.status);
    setFormContent(letter.content);
    setIsModalOpen(true);
  };

  const handleDeleteLetter = async (letter: LetterMock) => {
    if (!currentTenant) return;
    if (confirm(`Are you sure you want to delete this letter: "${letter.title}" (${letter.id})?`)) {
      try {
        await apiService.deleteLetter(letter.id);
        const list = await apiService.getLetters(currentTenant.id);
        setLetters(list);

        if (selectedLetter?.id === letter.id) {
          setSelectedLetter(list.length > 0 ? list[0] : null);
        }
      } catch (err) {
        console.error('Error deleting letter:', err?.message || 'Error occurred');
      }
    }
  };

  const handleSendStatusChange = async (id: string, newStatus: 'Sent') => {
    const target = letters.find(l => l.id === id);
    if (!target) return;
    const updated: LetterMock = { ...target, status: newStatus };
    try {
      await apiService.saveLetter(updated);
      const list = await apiService.getLetters(currentTenant!.id);
      setLetters(list);
      setSelectedLetter(updated);
    } catch (err) {
      console.error('Error updating status:', err?.message || 'Error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formTitle.trim()) {
      alert('Please enter a letter name.');
      return;
    }
    if (!formRecipient.trim()) {
      alert('Please enter a recipient.');
      return;
    }
    if (!formContent.trim()) {
      alert('Please enter letter content.');
      return;
    }

    let letterId = '';
    if (modalMode === 'add') {
      // Find highest number in existing LTR-2025-XXXX
      const pattern = /^LTR-2025-(\d+)$/;
      let maxNum = 0;
      letters.forEach(l => {
        const match = l.id.match(pattern);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = (maxNum + 1).toString().padStart(4, '0');
      letterId = `LTR-2025-${nextNum}`;
    } else {
      letterId = editId;
    }

    const letterData: LetterMock = {
      id: letterId,
      title: formTitle.trim(),
      type: formType,
      recipient: formRecipient.trim(),
      recipientEmail: formRecipientEmail.trim(),
      recipientPhone: formRecipientPhone.trim(),
      date: formDate || new Date().toISOString().split('T')[0],
      status: formStatus,
      sentBy: 'Pastor John',
      content: formContent.trim(),
      tenantId: currentTenant.id,
      createdOn: modalMode === 'add' ? new Date().toISOString().split('T')[0] : letters.find(l => l.id === editId)?.createdOn || new Date().toISOString().split('T')[0]
    };

    try {
      await apiService.saveLetter(letterData);
      const list = await apiService.getLetters(currentTenant.id);
      setLetters(list);
      setIsModalOpen(false);

      const target = list.find(l => l.id === letterData.id);
      if (target) {
        setSelectedLetter(target);
      }
    } catch (err) {
      console.error('Error saving letter:', err?.message || 'Error occurred');
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Letters
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Letters</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Create New Letter
        </button>
      </div>

      {/* Stats Cards */}
      <LetterStats letters={letters} />

      {/* Filters Panel */}
      <LetterFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => { setDateFilter(val); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Table & Pagination Column */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading letters...</p>
            </div>
          ) : (
            <>
              <LettersTable
                letters={paginatedLetters}
                selectedLetter={selectedLetter}
                onSelectLetter={setSelectedLetter}
                onEditLetter={handleOpenEditModal}
                onDeleteLetter={handleDeleteLetter}
              />
              <CategoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalCategoriesCount={sortedLetters.length}
                itemName="letters"
              />
            </>
          )}
        </div>

        {/* Sidebar Inspector Column */}
        <div className="lg:col-span-3">
          <LetterDetails
            letter={selectedLetter}
            onSendStatusChange={handleSendStatusChange}
          />
        </div>
      </div>

      {/* Add / Edit Letter Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-lg bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {modalMode === 'add' ? 'Create New Letter' : 'Edit Letter'}
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
              {/* Letter Title */}
              <div className="space-y-1.5">
                <label htmlFor="ltr-title" className="text-xs font-bold text-gray-400 uppercase">
                  Letter Name / Title
                </label>
                <input
                  id="ltr-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Official Confirmation Letter"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1.5">
                  <label htmlFor="ltr-type" className="text-xs font-bold text-gray-400 uppercase">
                    Letter Type
                  </label>
                  <select
                    id="ltr-type"
                    value={formType}
                    onChange={(e) => handleTypeChange(e.target.value as LetterMock['type'])}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Confirmation">Confirmation</option>
                    <option value="Approval">Approval</option>
                    <option value="Appreciation">Appreciation</option>
                    <option value="Invitation">Invitation</option>
                    <option value="Condolence">Condolence</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Notice">Notice</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="ltr-status" className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    id="ltr-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LetterMock['status'])}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="ltr-recipient" className="text-xs font-bold text-gray-400 uppercase">
                    Recipient Name
                  </label>
                  <input
                    id="ltr-recipient"
                    type="text"
                    required
                    value={formRecipient}
                    onChange={(e) => handleRecipientChange(e.target.value)}
                    placeholder="e.g. Kumara Family or Nadeesha Fernando"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                {/* Recipient Email */}
                <div className="space-y-1.5">
                  <label htmlFor="ltr-email" className="text-xs font-bold text-gray-400 uppercase">
                    Recipient Email
                  </label>
                  <input
                    id="ltr-email"
                    type="email"
                    value={formRecipientEmail}
                    onChange={(e) => setFormRecipientEmail(e.target.value)}
                    placeholder="e.g. recipient@email.com"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                {/* Recipient Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="ltr-phone" className="text-xs font-bold text-gray-400 uppercase">
                    Recipient Phone
                  </label>
                  <input
                    id="ltr-phone"
                    type="text"
                    value={formRecipientPhone}
                    onChange={(e) => setFormRecipientPhone(e.target.value)}
                    placeholder="e.g. +94 77 123 4567"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-855 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label htmlFor="ltr-date" className="text-xs font-bold text-gray-400 uppercase">
                  Letter Date
                </label>
                <input
                  id="ltr-date"
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Content Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="ltr-content" className="text-xs font-bold text-gray-400 uppercase">
                  Letter Content
                </label>
                <textarea
                  id="ltr-content"
                  required
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Type the customized content of the letter here..."
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-855 focus:outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-550 hover:text-gray-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Create Letter' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
