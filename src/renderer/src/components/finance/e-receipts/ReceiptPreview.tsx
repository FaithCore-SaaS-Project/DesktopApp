import React, { useState } from 'react';
import { Mail, Printer, Download, Church, Check, AlertCircle } from "lucide-react";
import { ReceiptMock } from '../../../services/mockData';
import { apiService } from '../../../services/api';

interface ReceiptPreviewProps {
  item: ReceiptMock | null;
}

export default function ReceiptPreview({ item }: ReceiptPreviewProps) {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');

  if (!item) {
    return (
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center">
        <Church size={40} className="text-gray-300 mb-3" />
        <h3 className="font-bold text-gray-800 text-sm">No Receipt Selected</h3>
        <p className="text-xs text-gray-400 max-w-[180px] mt-1 leading-relaxed">
          Select a receipt from the table to view its detailed receipt slip.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Helper to generate print HTML
  const generateReceiptHtml = () => {
    return `
      <div class="max-w-md mx-auto bg-white p-8 border border-slate-200 rounded-2xl shadow-sm font-sans text-slate-800">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 mb-2 border border-indigo-100">
            <!-- Church Icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 22 4-4"/><path d="M14 18h8"/><path d="m22 22-4-4"/><path d="M12 2v20"/><path d="M2 22h8"/><path d="M12 2H9.5a2.5 2.5 0 0 0 0 5H12"/><path d="M12 12H9.5a2.5 2.5 0 0 0 0 5H12"/></svg>
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">Kingdom Connect Church</h2>
          <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Growing Together in Faith & Love</p>
          <div class="border-b-2 border-slate-900 inline-block px-6 py-0.5 mt-4 text-[11px] font-black tracking-widest text-slate-900 uppercase">OFFICIAL RECEIPT</div>
        </div>

        <div class="space-y-2.5 text-xs border-b border-dashed border-slate-200 pb-5 mb-5">
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Receipt No.</span><span class="font-extrabold text-slate-800 font-mono">${item.receiptNo}</span></div>
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Date</span><span class="font-extrabold text-slate-800">${formatDate(item.date)}</span></div>
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Received From</span><span class="font-extrabold text-slate-800">${item.memberName}</span></div>
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Email</span><span class="font-extrabold text-slate-800">${item.memberEmail}</span></div>
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Phone</span><span class="font-extrabold text-slate-800">${item.memberPhone || 'N/A'}</span></div>
        </div>

        <div class="border-b border-dashed border-slate-200 pb-5 mb-5">
          <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Description</span>
            <span>Amount (Rs.)</span>
          </div>
          <div class="flex justify-between text-xs font-extrabold text-slate-800">
            <span>${item.description || item.category + ' Contribution'}</span>
            <span>${item.amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div class="flex justify-between items-center text-sm font-black border-b border-dashed border-slate-200 pb-5 mb-5">
          <span class="text-slate-900">Total Amount</span>
          <span class="text-indigo-600 text-base">${formatLKR(item.amount)}</span>
        </div>

        <div class="space-y-2 text-xs border-b border-dashed border-slate-200 pb-5 mb-5">
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Payment Method</span><span class="font-extrabold text-slate-800">${item.method}</span></div>
          <div class="flex justify-between"><span class="text-slate-400 font-bold">Received By</span><span class="font-extrabold text-slate-800">${item.receivedBy}</span></div>
        </div>

        <div class="text-center">
          <p class="text-[10px] text-slate-400 font-bold italic">Thank you for your generous giving.</p>
          <div class="mt-6 font-serif italic text-lg text-slate-800 font-bold">${item.receivedBy}</div>
          <div class="text-[8px] text-slate-400 font-extrabold tracking-widest uppercase mt-1">Authorised Signature</div>
        </div>
      </div>
    `;
  };

  const handleEmailReceipt = async () => {
    setEmailStatus('sending');
    try {
      // Simulate API call to send email
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setEmailStatus('success');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
    }
  };

  const handlePrintReceipt = async () => {
    setPrintStatus('printing');
    try {
      const result = await apiService.printDirect(generateReceiptHtml());
      if (result.success) {
        setPrintStatus('success');
      } else {
        setPrintStatus('error');
      }
      setTimeout(() => setPrintStatus('idle'), 3000);
    } catch {
      setPrintStatus('error');
      setTimeout(() => setPrintStatus('idle'), 3000);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await apiService.printToPDF(generateReceiptHtml(), `receipt-${item.receiptNo}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
            Receipt Preview
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadPDF}
              className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Download PDF"
            >
              <Download size={15} />
            </button>
            <button
              onClick={handlePrintReceipt}
              className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer size={15} />
            </button>
          </div>
        </div>

        {/* Printable/Previewable Receipt Slit */}
        <div className="border border-dashed border-gray-200 rounded-2xl p-5 bg-slate-50/35 relative overflow-hidden">
          {/* Subtle branding watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
            <Church size={150} />
          </div>

          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#5B3DF5]/5 text-[#5B3DF5] mb-2 border border-[#5B3DF5]/10">
              <Church size={20} />
            </div>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
              Kingdom Connect Church
            </h3>
            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Growing Together in Faith & Love
            </p>
            <div className="border-b-2 border-gray-800 inline-block px-4 py-0.5 mt-3 text-[9px] font-black tracking-widest text-gray-850 uppercase">
              OFFICIAL RECEIPT
            </div>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-2 text-[11px] border-b border-dashed border-gray-200 pb-4 mb-4">
            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-gray-400 font-bold">Receipt No.</span>
              <span className="col-span-1 text-center text-gray-300 font-semibold">:</span>
              <span className="col-span-6 font-extrabold text-gray-800 font-mono text-right">{item.receiptNo}</span>
            </div>
            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-gray-400 font-bold">Date</span>
              <span className="col-span-1 text-center text-gray-300 font-semibold">:</span>
              <span className="col-span-6 font-extrabold text-gray-800 text-right">{formatDate(item.date)}</span>
            </div>
            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-gray-400 font-bold">Received From</span>
              <span className="col-span-1 text-center text-gray-300 font-semibold">:</span>
              <span className="col-span-6 font-extrabold text-gray-800 text-right truncate" title={item.memberName}>{item.memberName}</span>
            </div>
            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-gray-400 font-bold">Email</span>
              <span className="col-span-1 text-center text-gray-300 font-semibold">:</span>
              <span className="col-span-6 font-extrabold text-gray-850 text-right truncate" title={item.memberEmail}>{item.memberEmail}</span>
            </div>
            {item.memberPhone && item.memberPhone !== 'N/A' && (
              <div className="grid grid-cols-12 items-center">
                <span className="col-span-5 text-gray-400 font-bold">Phone</span>
                <span className="col-span-1 text-center text-gray-300 font-semibold">:</span>
                <span className="col-span-6 font-extrabold text-gray-800 text-right">{item.memberPhone}</span>
              </div>
            )}
          </div>

          {/* Description & Amount */}
          <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
            <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              <span>Description</span>
              <span>Amount (Rs.)</span>
            </div>
            <div className="flex justify-between text-[11px] font-extrabold text-gray-800">
              <span className="truncate max-w-[150px]">{item.description || `${item.category} Giving`}</span>
              <span>{item.amount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-xs font-black border-b border-dashed border-gray-200 pb-4 mb-4 text-[#5B3DF5]">
            <span>Total Amount</span>
            <span className="text-sm font-black">{formatLKR(item.amount)}</span>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-[10px] border-b border-dashed border-gray-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold">Payment Method</span>
              <span className="font-extrabold text-gray-800">{item.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold">Received By</span>
              <span className="font-extrabold text-gray-800">{item.receivedBy}</span>
            </div>
          </div>

          {/* Thank You Note & Signature */}
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-bold italic">
              Thank you for your generous giving.
            </p>
            <div className="mt-5 font-serif italic text-base text-gray-850 font-extrabold tracking-wide">
              {item.receivedBy}
            </div>
            <div className="text-[8px] text-gray-400 font-extrabold tracking-widest uppercase mt-0.5">
              Authorised Signature
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {/* Email Receipt Button */}
        <button
          onClick={handleEmailReceipt}
          disabled={emailStatus === 'sending'}
          className={`w-full text-white font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
            emailStatus === 'sending' ? 'bg-[#5B3DF5]/70 cursor-not-allowed' :
            emailStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
            emailStatus === 'error' ? 'bg-rose-600 hover:bg-rose-700' :
            'bg-[#5B3DF5] hover:bg-[#4d32d6] shadow-md shadow-[#5B3DF5]/15'
          }`}
        >
          {emailStatus === 'sending' ? (
            <>
              <div className="h-4.5 w-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Sending Email...</span>
            </>
          ) : emailStatus === 'success' ? (
            <>
              <Check size={16} />
              <span>Emailed Successfully!</span>
            </>
          ) : emailStatus === 'error' ? (
            <>
              <AlertCircle size={16} />
              <span>Failed to Email</span>
            </>
          ) : (
            <>
              <Mail size={16} />
              <span>Email Receipt</span>
            </>
          )}
        </button>

        {/* Print Receipt Button */}
        <button
          onClick={handlePrintReceipt}
          disabled={printStatus === 'printing'}
          className={`w-full border font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 mt-3 cursor-pointer transition-all active:scale-[0.98] ${
            printStatus === 'printing' ? 'bg-gray-50 border-gray-150 text-gray-400 cursor-not-allowed' :
            printStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            printStatus === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
          }`}
        >
          {printStatus === 'printing' ? (
            <>
              <div className="h-4.5 w-4.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span>Printing...</span>
            </>
          ) : printStatus === 'success' ? (
            <>
              <Check size={16} />
              <span>Printed Successfully!</span>
            </>
          ) : printStatus === 'error' ? (
            <>
              <AlertCircle size={16} />
              <span>Printing Failed</span>
            </>
          ) : (
            <>
              <Printer size={16} />
              <span>Print Receipt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
