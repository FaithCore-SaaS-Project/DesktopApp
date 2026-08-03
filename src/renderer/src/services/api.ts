import { mockMembers, mockFinanceRecords, mockReceipts, mockCategories, mockBankAccounts, mockBudgets, mockLetters, mockCertificates, mockEvents, mockSavedReports } from './mockData';

// Helper to check if running inside Electron
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && (window as any).electronAPI !== undefined;
};

// Seeding localStorage for browser fallback if not populated
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('fc_members')) localStorage.setItem('fc_members', JSON.stringify(mockMembers));
  if (!localStorage.getItem('fc_finance')) localStorage.setItem('fc_finance', JSON.stringify(mockFinanceRecords));
  if (!localStorage.getItem('fc_receipts')) localStorage.setItem('fc_receipts', JSON.stringify(mockReceipts));
  if (!localStorage.getItem('fc_categories')) localStorage.setItem('fc_categories', JSON.stringify(mockCategories));
  if (!localStorage.getItem('fc_bank_accounts')) localStorage.setItem('fc_bank_accounts', JSON.stringify(mockBankAccounts));
  if (!localStorage.getItem('fc_budgets')) localStorage.setItem('fc_budgets', JSON.stringify(mockBudgets));
  if (!localStorage.getItem('fc_letters')) localStorage.setItem('fc_letters', JSON.stringify(mockLetters));
  if (!localStorage.getItem('fc_certificates')) localStorage.setItem('fc_certificates', JSON.stringify(mockCertificates));
  if (!localStorage.getItem('fc_events')) localStorage.setItem('fc_events', JSON.stringify(mockEvents));
};

initializeLocalStorage();

import { memberService } from './memberService';
import { financeService } from './financeService';
import { eventService } from './eventService';
import { reportService } from './reportService';
import { settingsService } from './settingsService';
import { dashboardService } from './dashboardService';
import { certificateService } from './certificateService';
import { letterService } from './letterService';
import { adminService } from './adminService';
import { notificationService } from './notificationService';
import { systemService } from './systemService';

export const apiService = {
  ...memberService,
  ...financeService,
  ...eventService,
  ...reportService,
  ...settingsService,
  ...dashboardService,
  ...certificateService,
  ...letterService,
  ...adminService,
  ...notificationService,
  ...systemService
};
