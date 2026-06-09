import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] text-center select-none">
      <div className="h-16 w-16 bg-[#5B3DF5]/10 rounded-2xl flex items-center justify-center text-[#5B3DF5] mb-4">
        <FolderOpen size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Documents Repository</h1>
      <p className="text-gray-550 text-sm font-medium max-w-md">
        This module will let you upload and manage local PDF attachments, agreement notes, and ministry curriculum documents securely.
      </p>
    </div>
  );
}
