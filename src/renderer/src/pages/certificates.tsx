import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { CertificateMock } from '../services/mockData';

import CertificateStats from '../components/certificates/CertificateStats';
import CertificateFilters from '../components/certificates/CertificateFilters';
import CertificatesTable from '../components/certificates/CertificatesTable';
import CertificateDetails from '../components/certificates/CertificateDetails';
import CategoriesPagination from '../components/finance/categories/CategoriesPagination';

const CERT_TYPE_TEMPLATES: Record<CertificateMock['type'], string> = {
  Membership: 'This certifies that [Recipient] is a faithful member of Kingdom Connect Church.',
  Baptism: 'This certifies that [Recipient] has been baptized in the name of the Father, the Son, and the Holy Spirit.',
  Confirmation: 'This certifies that [Recipient] has confirmed their faith at Kingdom Connect Church.',
  Appreciation: 'This certificate is awarded to [Recipient] in appreciation of dedicated service to Kingdom Connect Church.',
  Volunteer: 'This certifies that [Recipient] has faithfully served as a volunteer at Kingdom Connect Church.',
  Ministry: 'This certifies that [Recipient] has successfully completed ministry training at Kingdom Connect Church.',
  Appointment: 'This certifies that [Recipient] has been officially appointed to serve at Kingdom Connect Church.',
  Training: 'This certifies that [Recipient] has successfully completed training at Kingdom Connect Church.',
  Marriage: 'This certifies that [Recipient] were joined in holy matrimony at Kingdom Connect Church.',
  'Sunday School': 'This certifies that [Recipient] has successfully completed the Sunday School program.',
};

export default function CertificatesPage() {
  const { currentTenant } = useApp();
  const [certificates, setCertificates] = useState<CertificateMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateMock | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<CertificateMock['type']>('Membership');
  const [formRecipient, setFormRecipient] = useState('');
  const [formRecipientEmail, setFormRecipientEmail] = useState('');
  const [formRecipientPhone, setFormRecipientPhone] = useState('');
  const [formIssuedDate, setFormIssuedDate] = useState('');
  const [formIssuedBy, setFormIssuedBy] = useState('Pastor John');
  const [formStatus, setFormStatus] = useState<CertificateMock['status']>('Draft');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const list = await apiService.getCertificates(currentTenant.id);
      setCertificates(list);
      if (list.length > 0) {
        setSelectedCertificate(list[0]);
      } else {
        setSelectedCertificate(null);
      }
    } catch (err) {
      console.error('Error loading certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  // ─── Filtering ────────────────────────────────────────────────────────────
  const filteredCertificates = certificates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.recipient.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q);

    const matchDate = !dateFilter || c.issuedDate === dateFilter;
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchSearch && matchDate && matchType && matchStatus;
  });

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredCertificates.length / pageSize));
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── CRUD Handlers ────────────────────────────────────────────────────────
  const openAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormName('');
    setFormType('Membership');
    setFormRecipient('');
    setFormRecipientEmail('');
    setFormRecipientPhone('');
    setFormIssuedDate(new Date().toISOString().split('T')[0]);
    setFormIssuedBy('Pastor John');
    setFormStatus('Draft');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: CertificateMock) => {
    setModalMode('edit');
    setEditId(cert.id);
    setFormName(cert.name);
    setFormType(cert.type);
    setFormRecipient(cert.recipient);
    setFormRecipientEmail(cert.recipientEmail);
    setFormRecipientPhone(cert.recipientPhone);
    setFormIssuedDate(cert.issuedDate);
    setFormIssuedBy(cert.issuedBy);
    setFormStatus(cert.status);
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!currentTenant || !formName.trim() || !formRecipient.trim() || !formIssuedDate) return;

    const now = new Date().toISOString().split('T')[0];
    const cert: CertificateMock = {
      id: modalMode === 'edit' ? editId : `CERT-${Date.now().toString().slice(-6)}`,
      name: formName.trim(),
      type: formType,
      recipient: formRecipient.trim(),
      recipientEmail: formRecipientEmail.trim(),
      recipientPhone: formRecipientPhone.trim(),
      issuedDate: formIssuedDate,
      issuedBy: formIssuedBy.trim(),
      status: formStatus,
      tenantId: currentTenant.id,
      createdOn: modalMode === 'edit' ? editId.split('-')[0] || now : now,
    };

    await apiService.saveCertificate(cert);
    setIsModalOpen(false);
    await loadData();

    // Re-select the saved certificate
    const updated = await apiService.getCertificates(currentTenant.id);
    const saved = updated.find((c) => c.id === cert.id) || null;
    setSelectedCertificate(saved);
  };

  const handleDelete = async (cert: CertificateMock) => {
    if (!window.confirm(`Delete "${cert.name}"? This cannot be undone.`)) return;
    await apiService.deleteCertificate(cert.id);
    if (selectedCertificate?.id === cert.id) setSelectedCertificate(null);
    await loadData();
  };

  const handleDownload = async (cert: CertificateMock) => {
    try {
      const fileName = `${cert.id}_${cert.name.replace(/\s+/g, '_')}.pdf`;
      await apiService.downloadCertificatePdf(cert.id, fileName);
    } catch (err) {
      console.error('Failed to download certificate PDF:', err);
      alert('Error downloading certificate.');
    }
  };

  const handleArchive = async (id: string) => {
    const cert = certificates.find((c) => c.id === id);
    if (!cert) return;
    const updated = { ...cert, status: 'Archived' as const };
    await apiService.saveCertificate(updated);
    await loadData();
    setSelectedCertificate(updated);
  };

  // Auto-fill certificate name when type changes on the add modal
  const handleTypeChange = (type: CertificateMock['type']) => {
    setFormType(type);
    if (modalMode === 'add' || !formName.trim()) {
      const defaultName = `${type} Certificate`;
      setFormName(defaultName);
    }
  };

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Certificates</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1.5">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">Certificates</span>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">All Certificates</span>
          </nav>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#5B3DF5]/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create New Certificate
        </button>
      </div>

      {/* Stats */}
      <CertificateStats certificates={certificates} />

      {/* Filters */}
      <CertificateFilters
        searchTerm={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
        dateFilter={dateFilter}
        onDateFilterChange={(v) => { setDateFilter(v); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
        onResetFilters={() => {
          setSearchTerm('');
          setDateFilter('');
          setTypeFilter('all');
          setStatusFilter('all');
          setCurrentPage(1);
        }}
      />

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24 text-gray-400 text-sm font-bold">
          Loading certificates...
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Table + Pagination */}
          <div className="lg:col-span-9">
            <CertificatesTable
              certificates={paginatedCertificates}
              selectedCertificate={selectedCertificate}
              onSelectCertificate={setSelectedCertificate}
              onEditCertificate={openEditModal}
              onDeleteCertificate={handleDelete}
              onDownloadCertificate={handleDownload}
            />
            <CategoriesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCategoriesCount={filteredCertificates.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              itemName="certificates"
            />
          </div>

          {/* Sidebar Details */}
          <div className="lg:col-span-3">
            <CertificateDetails
              certificate={selectedCertificate}
              onArchive={handleArchive}
            />
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                {modalMode === 'add' ? 'Create New Certificate' : 'Edit Certificate'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Certificate Type */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Certificate Type</label>
                <select
                  value={formType}
                  onChange={(e) => handleTypeChange(e.target.value as CertificateMock['type'])}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-bold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer"
                >
                  {['Membership', 'Baptism', 'Confirmation', 'Appreciation', 'Volunteer', 'Ministry', 'Appointment', 'Training', 'Marriage', 'Sunday School'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {/* Auto-template hint */}
                <p className="text-[10px] text-gray-400 mt-1.5 italic leading-relaxed">
                  {CERT_TYPE_TEMPLATES[formType]}
                </p>
              </div>

              {/* Certificate Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Certificate Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Membership Certificate"
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Recipient Name</label>
                <input
                  type="text"
                  value={formRecipient}
                  onChange={(e) => setFormRecipient(e.target.value)}
                  placeholder="e.g. Kumara Family"
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                />
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Recipient Email</label>
                  <input
                    type="email"
                    value={formRecipientEmail}
                    onChange={(e) => setFormRecipientEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Recipient Phone</label>
                  <input
                    type="tel"
                    value={formRecipientPhone}
                    onChange={(e) => setFormRecipientPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Issued Date + Issued By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Issued Date</label>
                  <input
                    type="date"
                    value={formIssuedDate}
                    onChange={(e) => setFormIssuedDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-bold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Issued By</label>
                  <input
                    type="text"
                    value={formIssuedBy}
                    onChange={(e) => setFormIssuedBy(e.target.value)}
                    placeholder="Pastor John"
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Status</label>
                <div className="flex gap-3">
                  {(['Draft', 'Issued', 'Archived'] as CertificateMock['status'][]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormStatus(s)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formStatus === s
                          ? 'bg-[#5B3DF5] text-white border-[#5B3DF5]'
                          : 'border-gray-200 text-gray-500 hover:border-[#5B3DF5]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={!formName.trim() || !formRecipient.trim() || !formIssuedDate}
                className="flex-1 bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#5B3DF5]/15"
              >
                {modalMode === 'add' ? 'Create Certificate' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
