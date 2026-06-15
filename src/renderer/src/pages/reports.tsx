import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X, BarChart3, FileText, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { SavedReportMock } from '../services/mockData';

import ReportStats from '../components/reports/ReportStats';
import ReportFilters from '../components/reports/ReportFilters';
import ReportCategories from '../components/reports/ReportCategories';
import ReportCharts from '../components/reports/ReportCharts';
import ReportSidebar from '../components/reports/ReportSidebar';

export default function ReportsPage() {
  const { currentTenant } = useApp();
  const [savedReports, setSavedReports] = useState<SavedReportMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats numbers
  const [incomeAmount, setIncomeAmount] = useState(4125750);
  const [expensesAmount, setExpensesAmount] = useState(2430750);
  const [surplusAmount, setSurplusAmount] = useState(1695000);
  const [membersCount, setMembersCount] = useState(1248);
  const [eventsCount, setEventsCount] = useState(48);

  // Filters State
  const [datePreset, setDatePreset] = useState('month');
  const [reportType, setReportType] = useState('all');
  const [category, setCategory] = useState('all');

  // Active Category Selection
  const [activeCategory, setActiveCategory] = useState('Financial Reports');

  // Custom Report Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<SavedReportMock['type']>('Financial');
  const [formCategory, setFormCategory] = useState('');
  const [formDateRange, setFormDateRange] = useState('01 May 2025 - 31 May 2025');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      // 1. Fetch saved custom reports
      const list = await apiService.getSavedReports(currentTenant.id);
      setSavedReports(list);

      // 2. Fetch live metrics to offset showcase numbers dynamically
      const members = await apiService.getMembers(currentTenant.id);
      setMembersCount(1240 + members.length);

      const events = await apiService.getEvents(currentTenant.id);
      setEventsCount(events.length > 0 ? events.length : 48);

      const finance = await apiService.getFinanceRecords(currentTenant.id);
      // Compute additional custom transactions from local storage (if any)
      const extraInc = finance.filter(r => r.type === 'income' && r.id.startsWith('custom-')).reduce((sum, r) => sum + r.amount, 0);
      const extraExp = finance.filter(r => r.type === 'expense' && r.id.startsWith('custom-')).reduce((sum, r) => sum + r.amount, 0);

      const inc = 4125750 + extraInc;
      const exp = 2430750 + extraExp;
      setIncomeAmount(inc);
      setExpensesAmount(exp);
      setSurplusAmount(inc - exp);

    } catch (err) {
      console.error('Error loading reports details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleResetFilters = () => {
    setDatePreset('month');
    setReportType('all');
    setCategory('all');
  };

  const handleExportAll = () => {
    alert('Exporting all compiled reports. Download starting...');
  };

  const handleCreateCustomReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formName.trim()) {
      alert('Please enter a report name.');
      return;
    }

    const reportId = `RPT-2025-${Date.now().toString().slice(-4)}`;
    const newReport: SavedReportMock = {
      id: reportId,
      name: formName.trim(),
      type: formType,
      category: formCategory.trim() || 'Custom Summary',
      dateRange: formDateRange,
      createdOn: new Date().toISOString().split('T')[0],
      tenantId: currentTenant.id
    };

    try {
      await apiService.saveSavedReport(newReport);
      const list = await apiService.getSavedReports(currentTenant.id);
      setSavedReports(list);
      setIsModalOpen(false);
      
      // Auto switch to custom reports category to show saved report
      setActiveCategory('Custom Reports');
      alert(`Custom report "${newReport.name}" created and saved successfully!`);
    } catch (err) {
      console.error(err);
      alert('Error saving custom report.');
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Reports
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Reports</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormName('');
            setFormCategory('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Custom Report
        </button>
      </div>

      {/* Stats row */}
      <ReportStats
        incomeAmount={incomeAmount}
        expensesAmount={expensesAmount}
        surplusAmount={surplusAmount}
        membersCount={membersCount}
        eventsCount={eventsCount}
      />

      {/* Filters row */}
      <ReportFilters
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        reportType={reportType}
        onReportTypeChange={setReportType}
        category={category}
        onCategoryChange={setCategory}
        onExport={handleExportAll}
        onResetFilters={handleResetFilters}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Category List left menu */}
        <div className="lg:col-span-3">
          <ReportCategories
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            onManageSaved={() => {
              setActiveCategory('Custom Reports');
            }}
          />
        </div>

        {/* Charts & Table middle panel */}
        <div className="lg:col-span-6 space-y-6">
          {activeCategory === 'Custom Reports' ? (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
              <div className="p-2 border-b border-gray-100 flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-900 text-base">Custom Saved Reports</h3>
                <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold">
                  {savedReports.length} reports
                </span>
              </div>
              
              {savedReports.length > 0 ? (
                <div className="divide-y divide-gray-50 text-xs font-bold text-gray-650">
                  {savedReports.map((r, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5B3DF5]">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold">{r.name}</p>
                          <p className="text-[10px] text-gray-405 font-semibold mt-0.5">{r.category} • {r.dateRange}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                        {r.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-440">
                  <BarChart3 size={40} className="mx-auto mb-3 opacity-60 text-slate-400" />
                  <p className="text-sm font-bold">No custom reports saved</p>
                  <p className="text-xs text-gray-440 mt-1 font-semibold">Click "+ Custom Report" at the top to save configurations.</p>
                </div>
              )}
            </div>
          ) : (
            <ReportCharts />
          )}
        </div>

        {/* Sidebar logs right panel */}
        <div className="lg:col-span-3">
          <ReportSidebar
            onSelectReportPreset={(presetName) => {
              alert(`Compiling report for preset "${presetName}"...`);
            }}
          />
        </div>
      </div>

      {/* Add Custom Report Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                Create Custom Report Config
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomReport} className="p-6 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="rpt-name" className="text-xs font-bold text-gray-400 uppercase">
                  Report Configuration Name
                </label>
                <input
                  id="rpt-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Q2 Giving Analysis"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="rpt-cat" className="text-xs font-bold text-gray-400 uppercase">
                  Sub-Category / Grouping
                </label>
                <input
                  id="rpt-cat"
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Donations Summary or Weekly Worship Attendance"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Type and Date Range */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1.5">
                  <label htmlFor="rpt-type" className="text-xs font-bold text-gray-400 uppercase">
                    Report Type
                  </label>
                  <select
                    id="rpt-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as SavedReportMock['type'])}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Financial">Financial Reports</option>
                    <option value="Membership">Membership Reports</option>
                    <option value="Giving">Giving & Donations</option>
                    <option value="Events">Event Reports</option>
                    <option value="Ministries">Ministry Reports</option>
                    <option value="Budgets">Budget Reports</option>
                    <option value="Bank Accounts">Bank Reports</option>
                  </select>
                </div>

                {/* Date range preset */}
                <div className="space-y-1.5">
                  <label htmlFor="rpt-range" className="text-xs font-bold text-gray-400 uppercase">
                    Reporting Range
                  </label>
                  <select
                    id="rpt-range"
                    value={formDateRange}
                    onChange={(e) => setFormDateRange(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="01 May 2025 - 31 May 2025">This Month (May 2025)</option>
                    <option value="01 Apr 2025 - 30 Jun 2025">This Quarter (Q2 2025)</option>
                    <option value="01 Jan 2025 - 31 Dec 2025">This Year (2025)</option>
                    <option value="All time">All Time</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white hover:bg-gray-55 px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
