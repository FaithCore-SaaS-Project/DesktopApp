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
          const extendedMember = {
            ...baseMember,
            memberId: baseMember.memberNo,
            photoUrl: baseMember.photoUrl ? baseMember.photoUrl : `https://i.pravatar.cc/300?u=${baseMember.id}`,
            nic: baseMember.nic || 'N/A',
            occupation: baseMember.occupation || 'Member',
            address: baseMember.address || 'N/A',
            dob: baseMember.dob || 'N/A',
            passportNumber: 'N/A',
            gender: baseMember.gender || 'N/A',
            nationality: 'N/A',
            church: currentTenant.name,
            baptismDate: baseMember.baptismDate || 'N/A',
            baptizedBy: baseMember.baptismPartnerName || 'N/A',
            baptismChurch: baseMember.baptismChurch || 'N/A',
            baptismCertificateUrl: baseMember.baptismCertificateUrl || null,
            maritalStatus: baseMember.maritalStatus || 'Single',
            marriageDate: baseMember.marriageDate || 'N/A',
            marriageCertificateUrl: baseMember.marriageCertificateUrl || null,
            birthCertificateUrl: baseMember.birthCertificateUrl || null,
            department: 'N/A',
            cellGroup: 'N/A',
            spouse: 'N/A',
            children: [],
            name: `${baseMember.firstName} ${baseMember.lastName}`, // keep for legacy references
          };
          setMember(extendedMember);
        } else {
          setMember(null);
        }
      } catch (err) {
        console.error('Error loading member profile:', err?.message || 'Error occurred');
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
                  <p className="text-sm font-semibold text-gray-800 mt-1">{member.spouse !== 'N/A' ? member.spouse : 'Not Provided'}</p>
                  <p className="text-xs text-gray-500 mt-1">N/A</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase">Secondary Emergency Contact</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Not Provided</p>
                  <p className="text-xs text-gray-500 mt-1">N/A</p>
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
                  <p className="text-sm font-semibold text-gray-500">No ministry service history recorded.</p>
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
                  <p className="text-sm font-extrabold mt-1">$0.00</p>
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
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">No financial records found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Documents':
        const documentsList: any[] = [];
        if (member.birthCertificateUrl) {
          documentsList.push({
            name: 'Birth Certificate',
            url: member.birthCertificateUrl,
            type: member.birthCertificateUrl.split('.').pop()?.toUpperCase() || 'PDF'
          });
        }
        if (member.baptismCertificateUrl) {
          documentsList.push({
            name: 'Baptism Certificate',
            url: member.baptismCertificateUrl,
            type: member.baptismCertificateUrl.split('.').pop()?.toUpperCase() || 'PDF'
          });
        }
        if (member.marriageCertificateUrl) {
          documentsList.push({
            name: 'Marriage Certificate',
            url: member.marriageCertificateUrl,
            type: member.marriageCertificateUrl.split('.').pop()?.toUpperCase() || 'PDF'
          });
        }

        return (
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">Member Documents Archive</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload, download, or review official documents/records.</p>
            </div>

            {documentsList.length === 0 ? (
              <p className="text-xs text-gray-400 font-semibold italic">No certificates uploaded for this member.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentsList.map((doc, idx) => (
                  <div key={idx} className="p-4 border border-gray-150 rounded-2xl flex items-center justify-between hover:border-indigo-150 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.type} Document</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-55 rounded-lg text-gray-500 hover:text-gray-900 border border-gray-100 inline-flex"
                      title="Download/View"
                    >
                      <FileDown size={16} />
                    </a>
                  </div>
                ))}
              </div>
            )}
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
                <p className="text-2xl font-black text-indigo-950 mt-1.5">0%</p>
                <p className="text-[10px] text-indigo-500 mt-1">0/0 sessions present</p>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Midweek Prayer</p>
                <p className="text-2xl font-black text-emerald-950 mt-1.5">0%</p>
                <p className="text-[10px] text-emerald-500 mt-1">0/0 sessions present</p>
              </div>
              <div className="p-4 bg-purple-50/50 border border-purple-100/50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-purple-600 uppercase">Cell Meetings</p>
                <p className="text-2xl font-black text-purple-950 mt-1.5">0%</p>
                <p className="text-[10px] text-purple-500 mt-1">0/0 sessions present</p>
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
              <p className="text-sm font-semibold text-gray-500">No notes available.</p>
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
