import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { mockCertificateTemplates, CertificateTemplate } from '../services/mockData';
import { FileText, Printer, FileDown, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrinterInfo {
  name: string;
  isDefault: boolean;
  status: number;
}

export default function CertificatesPage() {
  const { currentTenant } = useApp();
  const [templates] = useState<CertificateTemplate[]>(mockCertificateTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>(mockCertificateTemplates[0]);
  
  // Template parameters
  const [recipientName, setRecipientName] = useState('Sarah Elizabeth Vance');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('250.00');
  const [category, setCategory] = useState('Tithe');
  
  // Hardware/Printer states
  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  
  // Feedback states
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [printing, setPrinting] = useState(false);

  // Load physical/virtual printers on mount
  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const list = await apiService.getPrinters();
        setPrinters(list);
        const defaultPrinter = list.find((p) => p.isDefault) || list[0];
        if (defaultPrinter) {
          setSelectedPrinter(defaultPrinter.name);
        }
      } catch (err) {
        console.error('Error fetching hardware printers:', err);
      }
    };
    fetchPrinters();
  }, []);

  // Helper to compile placeholders in template HTML
  const getRenderedHTML = () => {
    if (!currentTenant) return '';
    let html = selectedTemplate.defaultContent;
    html = html.replace(/{{name}}/g, recipientName);
    html = html.replace(/{{date}}/g, date);
    html = html.replace(/{{amount}}/g, amount);
    html = html.replace(/{{category}}/g, category);
    html = html.replace(/{{id}}/g, Date.now().toString().slice(-6));
    html = html.replace(/{{tenantName}}/g, currentTenant.name);
    html = html.replace(/{{tenantLocation}}/g, currentTenant.location);
    return html;
  };

  const handleExportPDF = async () => {
    setPrinting(true);
    setActionStatus({ type: null, message: '' });
    const html = getRenderedHTML();
    const fileName = `${selectedTemplate.type}_${recipientName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    
    try {
      const result = await apiService.printToPDF(html, fileName);
      if (result.success) {
        setActionStatus({ 
          type: 'success', 
          message: `PDF exported successfully! File saved.` 
        });
      } else {
        setActionStatus({ type: 'error', message: result.error || 'Failed to export PDF.' });
      }
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message || 'Error occurred.' });
    } finally {
      setPrinting(false);
    }
  };

  const handleDirectPrint = async () => {
    setPrinting(true);
    setActionStatus({ type: null, message: '' });
    const html = getRenderedHTML();

    try {
      const result = await apiService.printDirect(html, selectedPrinter);
      if (result.success) {
        setActionStatus({ 
          type: 'success', 
          message: `Document dispatched to printer: ${selectedPrinter || 'System Default'}` 
        });
      } else {
        setActionStatus({ type: 'error', message: result.error || 'Direct printing failed.' });
      }
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message || 'Error printing document.' });
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Certificates & receipts
        </h1>
        <p className="text-xs text-slate-500 mt-1">Render print-ready documents and interface directly with connected printer hardware.</p>
      </div>

      {/* Main panel layout splits form settings & live render preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Panel: Template Selector & Parameters */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Template Select Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Select Template</span>
            </h2>
            
            <div className="space-y-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-semibold ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <p className="font-bold">{tpl.title}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Document Parameters
            </h2>

            <div className="space-y-3.5 text-xs">
              {/* Recipient */}
              <div className="space-y-1">
                <label htmlFor="param-name" className="font-bold text-slate-400">Recipient/Member Name</label>
                <input
                  id="param-name"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label htmlFor="param-date" className="font-bold text-slate-400">Effective Date</label>
                <input
                  id="param-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              {/* Conditional parameters based on type */}
              {selectedTemplate.type === 'donation_receipt' && (
                <>
                  {/* Category */}
                  <div className="space-y-1">
                    <label htmlFor="param-category" className="font-bold text-slate-400">Giving Category</label>
                    <select
                      id="param-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="Tithe">Tithe</option>
                      <option value="Offering">Offering</option>
                      <option value="Building Fund">Building Fund</option>
                      <option value="Missions">Missions</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="space-y-1">
                    <label htmlFor="param-amount" className="font-bold text-slate-400">Donation Amount ($ USD)</label>
                    <input
                      id="param-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Print Options Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Printer className="h-4 w-4 text-indigo-400" />
              <span>Direct Print Dispatch</span>
            </h2>

            {/* Select Printer */}
            <div className="space-y-2 text-xs">
              <label htmlFor="printer-select" className="font-bold text-slate-400">Active Printer Hardware</label>
              <select
                id="printer-select"
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-slate-200 focus:outline-none cursor-pointer"
              >
                {printers.length === 0 ? (
                  <option value="">No printers detected</option>
                ) : (
                  printers.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} {p.isDefault ? '(Default)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Print Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <button
                onClick={handleExportPDF}
                disabled={printing}
                className="py-2.5 px-3 rounded-xl border border-slate-700/80 hover:bg-slate-800 text-slate-250 font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <FileDown className="h-4 w-4" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={handleDirectPrint}
                disabled={printing || printers.length === 0}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10"
              >
                <Printer className="h-4 w-4" />
                <span>Print Paper</span>
              </button>
            </div>

            {/* Feedback notifications */}
            {actionStatus.type && (
              <div className={`p-3 rounded-lg border text-xs flex items-start space-x-2 font-medium ${
                actionStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {actionStatus.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{actionStatus.message}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Preview Panel: High Fidelity Vector Rendering Preview */}
        <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-[680px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-850">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Eye className="h-4 w-4 text-indigo-400" />
              <span>Live Vector Print Preview</span>
            </h2>
            <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-850 px-2 py-1 rounded">
              A4 Portrait Preview
            </span>
          </div>

          {/* Actual Render Preview Box */}
          <div className="flex-1 bg-slate-950/40 rounded-xl border border-slate-850/60 p-6 overflow-y-auto mt-4 scrollbar-thin">
            {/* Inject compiled preview content */}
            <div dangerouslySetInnerHTML={{ __html: getRenderedHTML() }} />
          </div>
        </div>

      </div>
    </div>
  );
}
