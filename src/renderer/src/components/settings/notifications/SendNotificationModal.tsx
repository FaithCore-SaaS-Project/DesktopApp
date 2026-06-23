import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, Loader2, Search } from 'lucide-react';
import { apiService } from '../../services/api';
import { MemberMock } from '../../services/mockData';

interface SendNotificationModalProps {
  members: MemberMock[];
  initialSelectedMembers?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendNotificationModal({ members, initialSelectedMembers = [], onClose, onSuccess }: SendNotificationModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState<string[]>(['database', 'mail']);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleChannel = (channel: string) => {
    setChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
  };

  const toggleMember = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map(m => m.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Please enter both a subject and a message.");
      return;
    }
    if (channels.length === 0) {
      alert("Please select at least one delivery channel.");
      return;
    }
    if (selectedIds.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    setSubmitting(true);
    try {
      await apiService.sendNotification({
        subject,
        message,
        channels,
        member_ids: selectedIds
      });
      alert('Message sent successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const full = `${m.firstName} ${m.lastName}`.toLowerCase();
    return full.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Composer */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Compose Message</h2>
              <p className="text-xs text-gray-500 font-semibold mt-1">Send announcements to {selectedIds.length} members</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all cursor-pointer">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Important Update for Sunday Service"
                className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-850 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement here..."
                rows={8}
                className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-3 text-sm font-medium text-gray-850 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Delivery Channels</label>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 border px-4 py-3 rounded-xl cursor-pointer transition-colors flex-1 ${channels.includes('mail') ? 'border-[#5B3DF5] bg-[#5B3DF5]/5 text-[#5B3DF5]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="checkbox" checked={channels.includes('mail')} onChange={() => toggleChannel('mail')} className="hidden" />
                  <Mail size={18} />
                  <span className="text-sm font-bold">Email</span>
                </label>
                <label className={`flex items-center gap-2 border px-4 py-3 rounded-xl cursor-pointer transition-colors flex-1 ${channels.includes('database') ? 'border-[#5B3DF5] bg-[#5B3DF5]/5 text-[#5B3DF5]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input type="checkbox" checked={channels.includes('database')} onChange={() => toggleChannel('database')} className="hidden" />
                  <MessageSquare size={18} />
                  <span className="text-sm font-bold">In-App Alert</span>
                </label>
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={handleSubmit}
              disabled={submitting || selectedIds.length === 0}
              className="w-full bg-[#5B3DF5] hover:bg-[#4d32d6] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span>{submitting ? 'Sending...' : 'Send Message Now'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Recipients */}
        <div className="w-80 bg-[#f8f9fc] flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 mb-3">Select Recipients</h3>
            <div className="flex bg-white border border-gray-200 p-2.5 rounded-xl items-center gap-2">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 text-xs font-medium text-gray-800 placeholder:text-gray-400 w-full outline-none"
              />
            </div>
          </div>
          
          <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 bg-white">
            <span className="text-xs font-bold text-[#5B3DF5]">{selectedIds.length} Selected</span>
            <button onClick={selectAll} className="text-[10px] font-bold text-gray-500 hover:text-gray-800 transition-colors uppercase">
              {selectedIds.length === members.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredMembers.map(m => (
              <label key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(m.id)}
                  onChange={() => toggleMember(m.id)}
                  className="w-4 h-4 rounded text-[#5B3DF5] focus:ring-[#5B3DF5] border-gray-300"
                />
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-[10px]">
                  {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate">{m.firstName} {m.lastName}</div>
                  <div className="text-[10px] text-gray-500 truncate">{m.email || m.phone || 'No Contact Info'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
