import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { MemberMock } from '../../services/mockData';
import {
  ChevronRight,
  ArrowLeft,
  Download,
  Plus,
  MoreVertical,
  FileText,
  FileDown,
  CreditCard,
  UserCheck,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

import MemberProfileCard from '../../components/members/MemberProfileCard';
import MemberTabs from '../../components/members/MemberTabs';
import PersonalInformation from '../../components/members/PersonalInformation';
import ChurchInformation from '../../components/members/ChurchInformation';
import FamilyInformation from '../../components/members/FamilyInformation';
import QuickActions from '../../components/members/QuickActions';
import RecentActivities from '../../components/members/RecentActivities';

export default function MemberProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentTenant } = useApp();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    if (!router.isReady || !currentTenant) return;

    const fetchMember = async () => {
      setLoading(true);
      try {
        const members = await apiService.getMembers(currentTenant.id);
        const baseMember = members.find(m => m.id === id);

        if (baseMember) {
          // Overlay extended mock fields dynamically
          const extendedMember = {
            ...baseMember,
            memberId: baseMember.id === 'mem-1' ? 'MEM-2025-00101' : `MEM-2025-001${baseMember.id.replace('mem-', '').padStart(2, '0')}`,
            photoUrl: baseMember.id === 'mem-1'
              ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
              : baseMember.id === 'mem-2'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
              : `https://i.pravatar.cc/300?u=${baseMember.id}`,
            nic: baseMember.id === 'mem-1' ? '751234567V' : '901234567V',
            occupation: baseMember.role === 'Pastor' ? 'Lead Pastor' : 'Software Engineer',
            address: baseMember.id === 'mem-1' ? 'New York, NY, USA' : 'Kandy, Sri Lanka',
            dob: baseMember.id === 'mem-1' ? '12 Oct 1975' : '15 May 1990',
            passportNumber: baseMember.id === 'mem-1' ? 'N1234567' : 'N/A',
            gender: baseMember.name.includes('Sarah') || baseMember.name.includes('Rachel') || baseMember.name.includes('Rebecca') || baseMember.name.includes('Hannah') || baseMember.name.includes('Lin') ? 'Female' : 'Male',
            nationality: 'Sri Lankan',
            church: currentTenant.name,
            baptismDate: '12 March 2023',
            baptizedBy: 'Pastor Thomas J. Miller',
            department: baseMember.role === 'Pastor' ? 'Pastoral Staff' : 'Worship Ministry',
            cellGroup: 'Sanctuary Cell Group A',
            spouse: baseMember.id === 'mem-1' ? 'Rachel Rose Miller' : 'Nadeesha Perera',
            children: baseMember.id === 'mem-1' ? ['Logan Miller'] : ['Imesh Perera', 'Shenal Perera'],
          };
          setMember(extendedMember);
        } else {
          setMember(null);
        }
      } catch (err) {
        console.error('Error loading member profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, currentTenant, router.isReady]);

  // Tab contents renderer
  const renderTabContent = () => {
    if (!member) return null;

    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-6 animate-fade-in">
            <PersonalInformation member={member} onEdit={() => alert(`Edit profile for ${member.name} is simulated!`)} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ChurchInformation member={member} />
              <FamilyInformation member={member} />
              <QuickActions member={member} />
            </div>
          </div>
        );
      case 'Family':
        return (
          <div className="space-y-6 animate-fade-in">
            <FamilyInformation member={member} />
            <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm">
              <h3 className="font-extrabold text-lg text-gray-900 mb-6">Emergency & Secondary Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Primary Emergency Contact</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{member.spouse || 'Nadeesha Perera'} (Spouse)</p>
                  <p className="text-xs text-gray-500 mt-1">{member.phone}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Secondary Emergency Contact</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Imesh Perera (Son)</p>
                  <p className="text-xs text-gray-500 mt-1">077 987 6543</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Ministry':
        return (
          <div className="space-y-6 animate-fade-in">
            <ChurchInformation member={member} />
            <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm">
              <h3 className="font-extrabold text-lg text-gray-900 mb-6">Ministry Service Timeline</h3>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                <div className="relative pl-8">
                  <span className="absolute left-1 top-1.5 h-4.5 w-4.5 rounded-full bg-[#5B3DF5] ring-4 ring-indigo-50 border-2 border-white" />
                  <p className="text-xs font-bold text-gray-400">June 2024 - Present</p>
                  <p className="text-sm font-semibold text-gray-800">Worship Ministry Cell Leader</p>
                  <p className="text-xs text-gray-500 mt-0.5">Leads worship team and guides Cell Group meetings.</p>
                </div>
                <div className="relative pl-8">
                  <span className="absolute left-1 top-1.5 h-4.5 w-4.5 rounded-full bg-slate-300 ring-4 ring-slate-50 border-2 border-white" />
                  <p className="text-xs font-bold text-gray-400">March 2023 - June 2024</p>
                  <p className="text-sm font-semibold text-gray-800">Sunday Service Usher</p>
                  <p className="text-xs text-gray-500 mt-0.5">Welcomed members and assisted in service logistics.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Finance':
        return (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Tithing & Giving History</h3>
                <p className="text-xs text-gray-500 mt-0.5">Financial logs of contributions credited to this member.</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-2">
                <CreditCard size={18} />
                <div className="text-left leading-none">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Total Contributed</p>
                  <p className="text-sm font-extrabold mt-1">$4,850.00</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Transaction ID</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Method</th>
                    <th className="py-3 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
                  <tr>
                    <td className="py-3.5 px-2">01 Jun 2026</td>
                    <td className="py-3.5 px-2 font-mono text-xs text-gray-500">TXN-9281-01</td>
                    <td className="py-3.5 px-2">Tithe</td>
                    <td className="py-3.5 px-2">Direct Deposit</td>
                    <td className="py-3.5 px-2 text-right font-bold text-gray-900">$350.00</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">15 May 2026</td>
                    <td className="py-3.5 px-2 font-mono text-xs text-gray-500">TXN-4829-12</td>
                    <td className="py-3.5 px-2">Building Fund</td>
                    <td className="py-3.5 px-2">Check</td>
                    <td className="py-3.5 px-2 text-right font-bold text-gray-900">$1,500.00</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">04 May 2026</td>
                    <td className="py-3.5 px-2 font-mono text-xs text-gray-500">TXN-3918-49</td>
                    <td className="py-3.5 px-2">Tithe</td>
                    <td className="py-3.5 px-2">Cash</td>
                    <td className="py-3.5 px-2 text-right font-bold text-gray-900">$200.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Documents':
        return (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">Member Documents Archive</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload, download, or review official documents/records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-150 rounded-2xl flex items-center justify-between hover:border-indigo-150 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Holy Baptism Record.pdf</p>
                    <p className="text-xs text-gray-400">PDF Document • 1.2 MB</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 border border-gray-100">
                  <FileDown size={16} />
                </button>
              </div>
              <div className="p-4 border border-gray-150 rounded-2xl flex items-center justify-between hover:border-indigo-150 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Membership Pledge Letter.pdf</p>
                    <p className="text-xs text-gray-400">PDF Document • 840 KB</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 border border-gray-100">
                  <FileDown size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'Attendance':
        return (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">Attendance Analytics</h3>
              <p className="text-xs text-gray-500 mt-0.5">Participation records for services, prayer meetings, and cells.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-indigo-600 uppercase">Sunday Services</p>
                <p className="text-2xl font-black text-indigo-950 mt-1.5">92%</p>
                <p className="text-[10px] text-indigo-500 mt-1">48/52 sessions present</p>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Midweek Prayer</p>
                <p className="text-2xl font-black text-emerald-950 mt-1.5">80%</p>
                <p className="text-[10px] text-emerald-500 mt-1">42/52 sessions present</p>
              </div>
              <div className="p-4 bg-purple-50/50 border border-purple-100/50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-purple-600 uppercase">Cell Meetings</p>
                <p className="text-2xl font-black text-purple-950 mt-1.5">96%</p>
                <p className="text-[10px] text-purple-500 mt-1">50/52 sessions present</p>
              </div>
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900">Administrative Notes</h3>
                <p className="text-xs text-gray-500 mt-0.5">Confidential internal records for pastoral supervision.</p>
              </div>
              <button className="bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-md shadow-[#5B3DF5]/15 transition-all">
                <Plus size={14} />
                Add Note
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#5B3DF5]">Pastor Thomas J. Miller</p>
                  <p className="text-[10px] text-gray-400">12 May 2025</p>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Visited family house last Thursday. Spouse Nadeesha has recovered well from outpatient surgery. We extended prayers and grocery support from the Deaconate Fund.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#5B3DF5]">Elder Sarah Vance</p>
                  <p className="text-[10px] text-gray-400">08 Jan 2025</p>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Saman has expressed interest in assisting the Worship Team's audiovisual controls, utilizing his background as a software engineer. Agreed to transition him into AV training.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Activity':
        return <RecentActivities memberId={member.id} memberName={member.name} />;
      default:
        return null;
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] select-none">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-semibold mt-4">Retrieving Registry Profile...</p>
      </div>
    );
  }

  // Profile not found fallback
  if (!member) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] select-none text-center">
        <AlertTriangle className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-gray-900">Member Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">The member identifier is invalid or does not exist under your current tenant branch.</p>
        <Link href="/members" passHref legacyBehavior>
          <a className="mt-6 inline-flex items-center gap-2 bg-[#5B3DF5] hover:bg-[#4d32d6] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all">
            <ArrowLeft size={16} />
            Return to Members Directory
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in">
      {/* Header and Breadcrumbs */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Link href="/members" passHref legacyBehavior>
              <a className="p-2 hover:bg-white border border-transparent hover:border-gray-200 text-gray-500 hover:text-gray-900 rounded-xl transition-all shadow-sm">
                <ArrowLeft size={16} />
              </a>
            </Link>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
              Member Profile
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/members" className="hover:text-gray-600">Members</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">{member.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button 
            onClick={() => alert('Exporting profile reports as PDF...')}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 px-5 py-3 text-xs font-bold text-gray-700 transition-colors shadow-sm"
          >
            <Download size={16} className="text-gray-500" />
            Export
          </button>
          <button className="rounded-xl border border-gray-200 bg-white hover:bg-gray-55 p-3 text-gray-500 transition-colors shadow-sm">
            <MoreVertical size={16} />
          </button>
          <Link href="/members" passHref legacyBehavior>
            <a className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all">
              <Plus size={16} />
              Register Profile
            </a>
          </Link>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-3">
          <MemberProfileCard member={member} />
        </div>

        {/* Right Side: Tabbed Details */}
        <div className="lg:col-span-9 flex flex-col">
          <MemberTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
