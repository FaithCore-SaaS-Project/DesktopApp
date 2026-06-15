import React, { useState } from 'react';
import { FileBadge, Download, Printer, Archive, Layers, Info } from 'lucide-react';
import { CertificateMock } from '../../services/mockData';
import { apiService } from '../../services/api';

interface CertificateDetailsProps {
  certificate: CertificateMock | null;
  onArchive?: (id: string) => void;
}

export default function CertificateDetails({ certificate, onArchive }: CertificateDetailsProps) {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');

  if (!certificate) {
    return (
      <div className="bg-white border border-gray-150 rounded-3xl p-6 text-center shadow-sm select-none">
        <div className="h-16 w-16 mx-auto bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Layers size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-sm">No Certificate Selected</h3>
        <p className="text-xs text-gray-400 mt-1">Select a certificate from the list to view its details and actions.</p>
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

  const generateCertificateHTML = () => {
    return `
      <div style="font-family: 'Georgia', serif; padding: 48px; color: #1e293b; max-width: 800px; margin: 0 auto; text-align: center; background: #fffdf4;">
        <div style="border: 6px solid #f0c060; border-radius: 12px; padding: 36px; background: #fff8e8;">
          <div style="margin-bottom: 24px;">
            <h1 style="font-size: 13px; font-weight: 800; letter-spacing: 3px; color: #64748b; text-transform: uppercase; margin: 0 0 6px 0;">Kingdom Connect Church</h1>
            <div style="width: 60px; height: 3px; background: #5B3DF5; margin: 0 auto;"></div>
          </div>
          <h2 style="font-size: 24px; font-weight: 900; color: #4C1D95; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">
            ${certificate.type} Certificate
          </h2>
          <p style="font-size: 13px; color: #64748b; margin: 0 0 24px 0; font-style: italic;">This is to certify that</p>
          <h3 style="font-size: 32px; font-weight: 900; color: #1e293b; margin: 0 0 16px 0; font-style: italic;">${certificate.recipient}</h3>
          <p style="font-size: 13px; color: #475569; margin: 0 0 8px 0;">
            ${certificate.type === 'Membership' ? 'is a faithful member of' :
              certificate.type === 'Baptism' ? 'has been baptized in the name of' :
              certificate.type === 'Volunteer' ? 'has faithfully served as a volunteer of' :
              'has been recognized by'}
          </p>
          <p style="font-size: 16px; font-weight: 800; color: #5B3DF5; margin: 0 0 24px 0;">Kingdom Connect Church</p>
          <div style="border-top: 1px dashed #d1d5db; padding-top: 16px; margin-top: 16px;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">Issued by: <strong style="color: #1e293b;">${certificate.issuedBy}</strong></p>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">${formatDate(certificate.issuedDate)}</p>
          </div>
        </div>
      </div>
    `;
  };

  const handleDownloadPDF = async () => {
    setDownloadStatus('downloading');
    try {
      const html = generateCertificateHTML();
      const fileName = `${certificate.id}_${certificate.name.replace(/\s+/g, '_')}.pdf`;
      const res = await apiService.printToPDF(html, fileName);
      if (res.success) {
        setDownloadStatus('success');
      } else {
        setDownloadStatus('error');
      }
    } catch {
      setDownloadStatus('error');
    }
    setTimeout(() => setDownloadStatus('idle'), 3000);
  };

  const handlePrint = async () => {
    setPrintStatus('printing');
    try {
      const html = generateCertificateHTML();
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

  const getStatusBadgeStyles = (status: CertificateMock['status']) => {
    switch (status) {
      case 'Issued': return 'bg-green-50 text-green-700 border-green-150';
      case 'Draft': return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Archived': return 'bg-orange-50 text-orange-700 border-orange-150';
      default: return 'bg-gray-50 text-gray-700 border-gray-150';
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Detail Pane */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Certificate Details</h3>

        {/* Header Summary */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-[#5B3DF5] text-white flex items-center justify-center shadow-lg shadow-[#5B3DF5]/15">
            <FileBadge size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm leading-tight max-w-[160px] truncate" title={certificate.name}>
              {certificate.name}
            </h3>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold mt-1.5 border ${getStatusBadgeStyles(certificate.status)}`}>
              {certificate.status}
            </span>
          </div>
        </div>

        {/* Certificate Visual Preview */}
        <div className="border border-yellow-200 rounded-2xl p-4 bg-yellow-50/30 text-center mb-5">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kingdom Connect Church</p>
          <div className="w-8 h-0.5 bg-[#5B3DF5] mx-auto mb-2"></div>
          <h4 className="text-[9px] font-extrabold text-purple-700 uppercase tracking-wider mb-2">
            {certificate.type} Certificate
          </h4>
          <p className="text-[8px] text-gray-500 italic mb-1">This is to certify that</p>
          <p className="text-sm font-black text-gray-900 italic mb-1">{certificate.recipient}</p>
          <p className="text-[8px] text-gray-500 mb-2">Kingdom Connect Church</p>
          <div className="border-t border-dashed border-gray-200 pt-2 mt-2">
            <p className="text-[7px] text-gray-400 font-bold italic">{certificate.issuedBy}</p>
            <p className="text-[7px] text-gray-400">{formatDate(certificate.issuedDate)}</p>
          </div>
        </div>

        {/* Metadata Inspector */}
        <div className="space-y-3.5 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-5">
          <div className="flex justify-between items-center py-0.5">
            <span>Certificate ID</span>
            <span className="text-gray-900 font-bold">{certificate.id}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Certificate Name</span>
            <span className="text-gray-800 text-right max-w-[140px] truncate" title={certificate.name}>{certificate.name}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Type</span>
            <span className="text-gray-800">{certificate.type}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Recipient</span>
            <span className="text-gray-800 font-bold">{certificate.recipient}</span>
          </div>
          {certificate.recipientEmail && (
            <div className="flex justify-between items-center py-0.5">
              <span>Email</span>
              <span className="text-gray-800 truncate max-w-[140px]" title={certificate.recipientEmail}>{certificate.recipientEmail}</span>
            </div>
          )}
          {certificate.recipientPhone && (
            <div className="flex justify-between items-center py-0.5">
              <span>Phone</span>
              <span className="text-gray-800">{certificate.recipientPhone}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-0.5">
            <span>Issued Date</span>
            <span className="text-gray-800">{formatDate(certificate.issuedDate)}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Issued By</span>
            <span className="text-gray-800">{certificate.issuedBy}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3.5">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloadStatus === 'downloading'}
            className="w-full bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-[#5B3DF5]/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={15} />
            {downloadStatus === 'downloading' ? 'Downloading...' : downloadStatus === 'success' ? 'Downloaded!' : 'Download PDF'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={printStatus === 'printing'}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer size={15} className="text-gray-400" />
            {printStatus === 'printing' ? 'Printing...' : printStatus === 'success' ? 'Printed!' : 'Print Certificate'}
          </button>

          {certificate.status !== 'Archived' && (
            <button
              type="button"
              onClick={() => onArchive && onArchive(certificate.id)}
              className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
            >
              <Archive size={15} />
              Archive Certificate
            </button>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <div className="flex gap-3">
          <Info className="text-blue-500 shrink-0" size={18} />
          <div>
            <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Official Certificates</h4>
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed font-semibold">
              All issued certificates can be downloaded as PDFs or printed directly to connected printers.
            </p>
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed font-semibold">
              Draft certificates can be edited before being officially issued to recipients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
