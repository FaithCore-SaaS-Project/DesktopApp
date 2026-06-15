import React from 'react';
import CertificateRow from './CertificateRow';
import { CertificateMock } from '../../services/mockData';
import { FileBadge } from 'lucide-react';

interface CertificatesTableProps {
  certificates: CertificateMock[];
  selectedCertificate: CertificateMock | null;
  onSelectCertificate: (cert: CertificateMock) => void;
  onEditCertificate: (cert: CertificateMock) => void;
  onDeleteCertificate: (cert: CertificateMock) => void;
  onDownloadCertificate: (cert: CertificateMock) => void;
}

export default function CertificatesTable({
  certificates,
  selectedCertificate,
  onSelectCertificate,
  onEditCertificate,
  onDeleteCertificate,
  onDownloadCertificate,
}: CertificatesTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-t-3xl overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-lg font-bold text-gray-900">All Certificates</h2>
        <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold mr-2">
          {certificates.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="p-4 pl-6 font-bold text-left">Certificate ID</th>
              <th className="p-4 font-bold text-left">Certificate Name</th>
              <th className="p-4 font-bold text-left">Type</th>
              <th className="p-4 font-bold text-left">Recipient</th>
              <th className="p-4 font-bold text-left">Issued Date</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {certificates.length > 0 ? (
              certificates.map((item) => (
                <CertificateRow
                  key={item.id}
                  item={item}
                  isSelected={selectedCertificate?.id === item.id}
                  onSelect={() => onSelectCertificate(item)}
                  onEdit={() => onEditCertificate(item)}
                  onDelete={() => onDeleteCertificate(item)}
                  onDownload={() => onDownloadCertificate(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-440">
                    <FileBadge size={40} className="mb-3 opacity-60 text-slate-400" />
                    <p className="text-sm font-bold">No certificates found</p>
                    <p className="text-xs text-gray-440 mt-1 font-semibold">Try resetting the filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
