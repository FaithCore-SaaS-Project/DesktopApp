import React from 'react';
import { Mail } from 'lucide-react';

export default function LettersPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] text-center select-none">
      <div className="h-16 w-16 bg-[#5B3DF5]/10 rounded-2xl flex items-center justify-center text-[#5B3DF5] mb-4">
        <Mail size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Letters & Communications</h1>
      <p className="text-gray-550 text-sm font-medium max-w-md">
        This module will allow you to generate recommendation letters, official notifications, and send bulk emails to your members.
      </p>
    </div>
  );
}
