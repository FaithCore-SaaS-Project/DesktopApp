import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, X, Upload } from 'lucide-react';
import api from '../lib/axios';
import { useApp } from '../context/AppContext';

import DocumentsStats from '../components/documents/DocumentsStats';
import DocumentsFilters from '../components/documents/DocumentsFilters';
import DocumentsTable from '../components/documents/DocumentsTable';
import DocumentsSidebar from '../components/documents/DocumentsSidebar';

// No dummy data in production

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
      if (Array.isArray(apiData)) {
        const formatted = apiData.map((d: any) => {
          return {
            id: d.id,
            name: d.title,
            category: d.category?.name || 'Others',
            type: d.title.split('.').pop()?.toUpperCase() || 'PDF',
            uploader: d.uploader?.username || 'Admin',
            date: d.created_at ? new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString(),
            size: d.size ? `${(d.size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown',
            status: 'Public'
          };
        });
        setDocuments(formatted);
      } else {
        setDocuments([]);
      }
    } catch (err: any) {
      console.error('Failed to load documents from backend', err?.message || 'Error occurred');
      setDocuments([]);
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
    } catch (err: any) {
      alert('Failed to save document. ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleDeleteDocument = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const docToDelete = documents.find((d) => d.name === name);
    try {
      if (docToDelete && docToDelete.id) {
        await api.delete(`/documents/${docToDelete.id}`);
        await loadDocuments();
      }
    } catch (err: any) {
      alert('Failed to delete document. ' + (err?.message || 'Error occurred'));
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
        <DocumentsStats documents={documents} />
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
