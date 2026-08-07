import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, X, Upload } from 'lucide-react';
import api from '../lib/axios';
import { useApp } from '../context/AppContext';

import DocumentsStats from '../components/documents/DocumentsStats';
import DocumentsFilters from '../components/documents/DocumentsFilters';
import DocumentsTable from '../components/documents/DocumentsTable';
import DocumentsSidebar from '../components/documents/DocumentsSidebar';

const DEFAULT_DOCUMENTS = [
  { name: 'Church Constitution.pdf', category: 'Legal', type: 'PDF', uploader: 'Pastor John', date: '24 May 2025', size: '1.2 MB', status: 'Public' },
  { name: 'Membership Application Form.docx', category: 'Forms', type: 'DOCX', uploader: 'Sarah Johnson', date: '23 May 2025', size: '245 KB', status: 'Public' },
  { name: '2025 Budget Plan.xlsx', category: 'Finance', type: 'XLSX', uploader: 'Pastor John', date: '22 May 2025', size: '512 KB', status: 'Public' },
  { name: 'Baptism Guidelines.pdf', category: 'Ministry', type: 'PDF', uploader: 'Michael Peters', date: '20 May 2025', size: '890 KB', status: 'Public' },
  { name: 'New Member Orientation.pptx', category: 'Training', type: 'PPTX', uploader: 'Sarah Johnson', date: '19 May 2025', size: '3.4 MB', status: 'Private' },
  { name: 'Event Planning Checklist.pdf', category: 'Events', type: 'PDF', uploader: 'Emily Davis', date: '18 May 2025', size: '678 KB', status: 'Public' },
  { name: 'Volunteer Agreement Form.docx', category: 'Forms', type: 'DOCX', uploader: 'Sarah Johnson', date: '17 May 2025', size: '310 KB', status: 'Public' },
  { name: 'Tithe Summary - April 2025.xlsx', category: 'Finance', type: 'XLSX', uploader: 'Pastor John', date: '16 May 2025', size: '420 KB', status: 'Private' },
  { name: 'Child Protection Policy.pdf', category: 'Policy', type: 'PDF', uploader: 'Michael Peters', date: '15 May 2025', size: '1.1 MB', status: 'Public' },
  { name: 'Mission Trip Presentation.pptx', category: 'Ministry', type: 'PPTX', uploader: 'Daniel Wilson', date: '14 May 2025', size: '2.3 MB', status: 'Public' }
];

const mockSize = (name: string) => {
  const n = name.toLowerCase();
  if (n.endsWith('.pdf')) return '1.2 MB';
  if (n.endsWith('.docx') || n.endsWith('.doc')) return '245 KB';
  if (n.endsWith('.xlsx') || n.endsWith('.xls')) return '512 KB';
  if (n.endsWith('.pptx') || n.endsWith('.ppt')) return '2.3 MB';
  return '1.5 MB';
};

export default function DocumentsPage() {
  const { user } = useApp();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Legal');
  const [formType, setFormType] = useState('PDF');
  const [formStatus, setFormStatus] = useState('Public');
  const [formSize, setFormSize] = useState('1.5 MB');

  const loadDocuments = async () => {
    try {
      const res = await api.get('/documents');
      const apiData = res.data.data ?? res.data;
      if (Array.isArray(apiData) && apiData.length > 0) {
        const formatted = apiData.map((d: any) => {
          return {
            id: d.id,
            name: d.title,
            category: d.category?.name || 'Others',
            type: d.title.split('.').pop()?.toUpperCase() || 'PDF',
            uploader: d.uploader?.username || 'Pastor John',
            date: d.created_at ? new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 May 2025',
            size: mockSize(d.title),
            status: 'Public'
          };
        });
        setDocuments(formatted);
      } else {
        loadFromLocalStorage();
      }
    } catch (err) {
      console.error('Failed to load documents from backend, using local storage:', err?.message || 'Error occurred');
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('fc_documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    } else {
      localStorage.setItem('fc_documents', JSON.stringify(DEFAULT_DOCUMENTS));
      setDocuments(DEFAULT_DOCUMENTS);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleOpenUploadModal = () => {
    setFormName('');
    setFormCategory('Legal');
    setFormType('PDF');
    setFormStatus('Public');
    // Generate a reasonable mock size
    const randomSize = (Math.random() * (4.5 - 0.2) + 0.2).toFixed(1);
    setFormSize(`${randomSize} MB`);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Build filename with proper extension if not already typed
    const extension = `.${formType.toLowerCase()}`;
    let filename = formName.trim();
    if (!filename.toLowerCase().endsWith(extension)) {
      filename += extension;
    }

    try {
      const payload = {
        title: filename,
        category_id: 1, // default mock category (seals on backend if not existing)
        file_path: 'documents/' + filename
      };

      await api.post('/documents', payload);
      await loadDocuments();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save document on backend, saving locally:', err?.message || 'Error occurred');
      // Fallback
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const newDoc = {
        id: 'local-' + Date.now(),
        name: filename,
        category: formCategory,
        type: formType,
        uploader: user?.username || 'Pastor John',
        date: formattedDate,
        size: formSize,
        status: formStatus
      };

      const updated = [newDoc, ...documents];
      setDocuments(updated);
      localStorage.setItem('fc_documents', JSON.stringify(updated));
      setIsModalOpen(false);
    }
  };

  const handleDeleteDocument = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const docToDelete = documents.find((d) => d.name === name);
    try {
      if (docToDelete && docToDelete.id && !docToDelete.id.toString().startsWith('local-')) {
        await api.delete(`/documents/${docToDelete.id}`);
        await loadDocuments();
      } else {
        throw new Error('Local item');
      }
    } catch (err) {
      console.error('Failed to delete document from backend, deleting locally:', err?.message || 'Error occurred');
      const updated = documents.filter((doc) => doc.name !== name);
      setDocuments(updated);
      localStorage.setItem('fc_documents', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-0 pb-10 min-h-screen p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-violet-50/30">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Documents</h1>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1.5">
            <Link href="/dashboard" passHref legacyBehavior>
              <a className="hover:text-[#5B3DF5] transition-colors">Dashboard</a>
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">Documents</span>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">All Documents</span>
          </nav>
        </div>
        
        <div 
          onClick={handleOpenUploadModal}
          className="flex bg-[#5B3DF5] hover:bg-[#4a30db] rounded-2xl shadow-lg shadow-[#5B3DF5]/20 overflow-hidden text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all border border-[#5B3DF5]"
        >
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 transition-colors pointer-events-none"
          >
            <span className="text-lg leading-none mb-0.5">+</span> Upload Document
          </button>
          <button className="px-3 border-l border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 pointer-events-none">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <DocumentsStats />
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <DocumentsFilters />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <DocumentsTable documents={documents} onDelete={handleDeleteDocument} />
        </div>
        <div className="w-full lg:w-[320px] shrink-0">
          <DocumentsSidebar documents={documents} onUploadClick={handleOpenUploadModal} />
        </div>
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-auto bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Upload size={16} className="text-[#5B3DF5]" />
                Upload New Document
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={15} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* Document Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Document Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Annual Report"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                />
              </div>

              {/* Grid for Category and File Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all cursor-pointer"
                  >
                    {['Legal', 'Forms', 'Finance', 'Ministry', 'Training', 'Events', 'Policy', 'Others'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">File Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all cursor-pointer"
                  >
                    {['PDF', 'DOCX', 'XLSX', 'PPTX', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Access Status</label>
                <div className="flex gap-3">
                  {['Public', 'Private'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormStatus(status)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formStatus === status
                          ? 'bg-[#5B3DF5] text-white border-[#5B3DF5] shadow-sm shadow-[#5B3DF5]/20'
                          : 'border-slate-200 text-slate-500 bg-white hover:border-[#5B3DF5]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Size (Prefilled Mock) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">File Size (Simulated)</label>
                <input
                  type="text"
                  required
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs font-bold text-slate-400 outline-none bg-slate-50/50"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="flex-1 bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#5B3DF5]/15"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
