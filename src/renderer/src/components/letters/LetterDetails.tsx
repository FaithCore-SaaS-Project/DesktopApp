import React, { useState } from 'react';
import { Mail, Download, Printer, Send, Layers, Info } from 'lucide-react';
import { LetterMock } from '../../services/mockData';
import { apiService } from '../../services/api';

interface LetterDetailsProps {
  letter: LetterMock | null;
  onSendStatusChange?: (id: string, newStatus: 'Sent') => void;
}

export default function LetterDetails({ letter, onSendStatusChange }: LetterDetailsProps) {
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!letter) {
    return (
      <div className="bg-white border border-gray-150 rounded-3xl p-6 text-center shadow-sm select-none">
        <div className="h-16 w-16 mx-auto bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Layers size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">No Letter Selected</h3>
        <p className="text-xs text-gray-400 mt-1">Select a letter from the list to view its contents, details, and actions.</p>
      </div>
    );
  }

  // Format Date: "2025-05-24" -> "24 May 2025"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options);
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const generateLetterHTML = () => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 2px solid #5B3DF5; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #5B3DF5; font-size: 26px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Kingdom Connect Church</h1>
          <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0; font-style: italic; font-weight: 600;">Growing Together in Faith & Love</p>
        </div>
        
        <table style="width: 100%; margin-bottom: 30px; font-size: 13px; color: #475569;">
          <tr>
            <td style="text-align: left; vertical-align: top;">
              <strong>Letter ID:</strong> ${letter.id}<br/>
              <strong>Letter Type:</strong> ${letter.type}
            </td>
            <td style="text-align: right; vertical-align: top;">
              <strong>Date:</strong> ${formatDate(letter.date)}
            </td>
          </tr>
        </table>

        <div style="margin-bottom: 30px; text-align: center;">
          <h2 style="color: #5B3DF5; font-size: 18px; font-weight: 800; text-transform: uppercase; margin-bottom: 30px; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; display: inline-block; padding-bottom: 4px;">${letter.title.toUpperCase()}</h2>
        </div>

        <div style="font-size: 14px; color: #334155; margin-bottom: 40px; white-space: pre-line;">
          ${letter.content}
        </div>

        <div style="margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 14px;">
          <p style="margin-bottom: 5px; color: #64748b; font-weight: 600;">In Christ,</p>
          <p style="font-family: 'Georgia', serif; font-size: 20px; font-weight: bold; font-style: italic; color: #5B3DF5; margin: 15px 0 5px 0;">${letter.sentBy}</p>
          <p style="margin: 0; font-weight: 700; color: #334155;">${letter.sentBy}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600;">Kingdom Connect Church</p>
        </div>
      </div>
    `;
  };

  const handleDownloadPDF = async () => {
    setDownloadStatus('downloading');
    try {
      const fileName = `${letter.id}_${letter.title.replace(/\s+/g, '_')}.pdf`;
      await apiService.downloadLetterPdf(letter.id, fileName);
      setDownloadStatus('success');
    } catch {
      setDownloadStatus('error');
    }
    setTimeout(() => setDownloadStatus('idle'), 3000);
  };

  const handlePrintLetter = async () => {
    setPrintStatus('printing');
    try {
      const html = generateLetterHTML();
      const res = await apiService.printDirect(html);
      if (res.success) {
        setPrintStatus('success');
      } else {
        setPrintStatus('error');
      }
    } catch {
      setPrintStatus('error');
    }
    setTimeout(() => setPrintStatus('idle'), 3000);
  };

  const handleSendLetter = async () => {
    setSendStatus('sending');
    // Simulate API mail sending wait
    setTimeout(() => {
      setSendStatus('success');
      if (onSendStatusChange && letter.status !== 'Sent') {
        onSendStatusChange(letter.id, 'Sent');
      }
      setTimeout(() => setSendStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Detail Pane */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Letter Details</h3>
        
        {/* Header Summary */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-[#5B3DF5] text-white flex items-center justify-center shadow-lg shadow-[#5B3DF5]/15">
            <Mail size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm leading-tight max-w-[160px] truncate" title={letter.title}>
              {letter.title}
            </h3>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold mt-1.5 border ${
                letter.status === 'Sent'
                  ? 'bg-green-50 text-green-700 border-green-150'
                  : letter.status === 'Draft'
                  ? 'bg-blue-50 text-blue-700 border-blue-150'
                  : 'bg-orange-50 text-orange-700 border-orange-150'
              }`}
            >
              {letter.status}
            </span>
          </div>
        </div>

        {/* Metadata Inspector */}
        <div className="space-y-3.5 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center py-0.5">
            <span>Letter ID</span>
            <span className="text-gray-900 font-bold">{letter.id}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Letter Type</span>
            <span className="text-gray-800">{letter.type}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Recipient</span>
            <span className="text-gray-800 font-bold">{letter.recipient}</span>
          </div>
          {letter.recipientEmail && (
            <div className="flex justify-between items-center py-0.5">
              <span>Email</span>
              <span className="text-gray-800 truncate max-w-[150px]" title={letter.recipientEmail}>
                {letter.recipientEmail}
              </span>
            </div>
          )}
          {letter.recipientPhone && (
            <div className="flex justify-between items-center py-0.5">
              <span>Phone</span>
              <span className="text-gray-800">{letter.recipientPhone}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-0.5">
            <span>Date</span>
            <span className="text-gray-800">{formatDate(letter.date)}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Sent By</span>
            <span className="text-gray-800">{letter.sentBy}</span>
          </div>
        </div>

        {/* Letter Preview Box */}
        <div className="mt-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Letter Preview</p>
          <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 max-h-[300px] overflow-y-auto text-left leading-relaxed">
            {/* Church Header */}
            <div className="text-center border-b border-dashed border-gray-300 pb-2 mb-3">
              <h4 className="font-extrabold text-[10px] text-gray-800 tracking-wider uppercase">Kingdom Connect Church</h4>
              <p className="text-[8px] text-gray-400 font-semibold italic mt-0.5">Growing Together in Faith & Love</p>
            </div>
            
            {/* Title */}
            <h5 className="font-bold text-center text-[10px] text-[#5B3DF5] uppercase mb-4 tracking-wider">
              {letter.title}
            </h5>
            
            {/* Body */}
            <div className="text-[10px] text-gray-650 font-medium whitespace-pre-wrap">
              {letter.content}
            </div>

            {/* Signature */}
            <div className="mt-4 pt-2 border-t border-dashed border-gray-200">
              <p className="text-[8px] text-gray-400 font-semibold">In Christ,</p>
              <p className="font-serif italic text-xs text-[#5B3DF5] mt-1 font-bold">{letter.sentBy}</p>
              <p className="text-[8px] text-gray-800 font-bold">{letter.sentBy}</p>
              <p className="text-[7px] text-gray-400 font-semibold">Kingdom Connect Church</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3.5">
          <button
            type="button"
            onClick={handleSendLetter}
            disabled={sendStatus === 'sending'}
            className="w-full bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-[#5B3DF5]/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={15} />
            {sendStatus === 'sending' ? 'Sending...' : sendStatus === 'success' ? 'Sent Successfully!' : letter.status === 'Sent' ? 'Resend Letter' : 'Send Letter'}
          </button>
          
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadStatus === 'downloading'}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={15} className="text-gray-400" />
            {downloadStatus === 'downloading' ? 'Downloading...' : downloadStatus === 'success' ? 'Downloaded!' : 'Download PDF'}
          </button>
          
          <button
            type="button"
            onClick={handlePrintLetter}
            disabled={printStatus === 'printing'}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer size={15} className="text-gray-400" />
            {printStatus === 'printing' ? 'Printing...' : printStatus === 'success' ? 'Printed!' : 'Print Letter'}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <div className="flex gap-3">
          <Info className="text-blue-500 shrink-0" size={18} />
          <div>
            <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Official Letters</h4>
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed font-semibold">
              All generated letters can be downloaded as PDFs or sent directly to member emails.
            </p>
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed font-semibold">
              Draft letters can be edited to customize their content before finalizing and sending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
