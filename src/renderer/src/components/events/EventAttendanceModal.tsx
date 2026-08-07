import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, Loader2, Search } from 'lucide-react';
import { apiService } from '../../services/api';
import { EventMock, MemberMock } from '../../services/mockData';

interface EventAttendanceModalProps {
  event: EventMock;
  onClose: () => void;
}

export default function EventAttendanceModal({ event, onClose }: EventAttendanceModalProps) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberMock[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mems = await apiService.getMembers(event.tenantId);
        const att = await apiService.getEventAttendance(event.id);
        setMembers(mems);
        setAttendance(att);
      } catch (err) {
        console.error('Failed to load attendance data', err?.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [event.id, event.tenantId]);

  const handleMark = async (memberId: string, status: string) => {
    setProcessing(prev => ({ ...prev, [memberId]: true }));
    try {
      const updated = await apiService.markEventAttendance(event.id, memberId, status);
      setAttendance(prev => {
        const existing = prev.find(a => a.member_id.toString() === memberId);
        if (existing) {
          return prev.map(a => a.member_id.toString() === memberId ? { ...a, status } : a);
        } else {
          return [...prev, updated];
        }
      });
    } catch (err) {
      alert('Failed to mark attendance.');
    } finally {
      setProcessing(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const getStatus = (memberId: string) => {
    const record = attendance.find(a => a.member_id.toString() === memberId);
    return record ? record.status : null;
  };

  const filteredMembers = members.filter(m => {
    const full = `${m.firstName} ${m.lastName}`.toLowerCase();
    return full.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Track Attendance</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">{event.name} • {event.date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex bg-gray-50 border border-gray-200 p-3 rounded-xl items-center gap-3">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search members by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400 w-full outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-[#5B3DF5] h-8 w-8" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm font-bold">No members found.</div>
          ) : (
            filteredMembers.map(m => {
              const status = getStatus(m.id);
              const isProcessing = processing[m.id];
              return (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                      {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{m.firstName} {m.lastName}</div>
                      <div className="text-xs text-gray-500 font-medium">{m.memberNo}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMark(m.id, 'present')}
                      disabled={isProcessing}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        status === 'present' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200'
                      }`}
                    >
                      <CheckCircle size={14} /> Present
                    </button>
                    <button
                      onClick={() => handleMark(m.id, 'absent')}
                      disabled={isProcessing}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        status === 'absent' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-white text-gray-500 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
                      }`}
                    >
                      <XCircle size={14} /> Absent
                    </button>
                    <button
                      onClick={() => handleMark(m.id, 'excused')}
                      disabled={isProcessing}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        status === 'excused' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
                      }`}
                    >
                      <Clock size={14} /> Excused
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
