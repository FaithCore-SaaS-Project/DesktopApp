export interface Tenant {
  id: string;
  name: string;
  location: string;
  logoUrl?: string;
}

export interface MemberMock {
  id: string;
  name?: string;
  memberNo?: string;
  firstName: string;
  lastName: string;
  role?: string;
  joinedDate?: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  baptismDate?: string;
  membershipDate?: string;
  occupation?: string;
  status: boolean | string;
  tenantId: string;
  photoUrl?: string;
  familyId?: string;
  photoFile?: File; // For uploading
  nic?: string;
  addressType?: string;
  permanentAddress?: string;
  postalAddress?: string;
  isBaptized?: boolean;
  baptismChurch?: string;
  baptismPartnerName?: string;
  baptismCertificate?: string;
  baptismCertificateUrl?: string | null;
  baptismCertFile?: File;
  maritalStatus?: string;
  marriageDate?: string;
  marriageCertificate?: string;
  marriageCertificateUrl?: string | null;
  marriageCertFile?: File;
  birthCertificate?: string;
  birthCertificateUrl?: string | null;
  birthCertFile?: File;
}

export interface FinanceMock {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  tenantId: string;
  method?: string;
  receipt?: string;
}

export interface CategoryMock {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  description: string;
  status: 'Active' | 'Inactive';
  createdOn: string;
  createdBy: string;
  tenantId: string;
}

export interface BankAccountMock {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: 'Current' | 'Savings';
  balance: number;
  status: 'Active' | 'Inactive';
  branch: string;
  currency: string;
  ledgerBalance: number;
  lastStatementDate: string;
  createdOn: string;
  createdBy: string;
  tenantId: string;
}

export interface BudgetMock {
  id: string;
  name: string;
  type: 'Operating' | 'Capital' | 'Ministry';
  budgetAmount: number;
  spentAmount: number;
  periodStart: string;
  periodEnd: string;
  status: 'In Progress' | 'Completed';
  description?: string;
  tenantId: string;
  createdOn: string;
}

export interface LetterMock {
  id: string;
  title: string;
  type: 'Confirmation' | 'Approval' | 'Appreciation' | 'Invitation' | 'Condolence' | 'Appointment' | 'Notice';
  recipient: string;
  recipientEmail: string;
  recipientPhone: string;
  date: string;
  status: 'Sent' | 'Draft' | 'Archived';
  sentBy: string;
  content: string;
  tenantId: string;
  createdOn: string;
}

export interface CertificateMock {
  id: string;
  name: string;
  type: 'Membership' | 'Baptism' | 'Confirmation' | 'Appreciation' | 'Volunteer' | 'Ministry' | 'Appointment' | 'Training' | 'Marriage' | 'Sunday School';
  recipient: string;
  recipientEmail: string;
  recipientPhone: string;
  issuedDate: string;
  issuedBy: string;
  status: 'Issued' | 'Draft' | 'Archived';
  tenantId: string;
  createdOn: string;
}

export interface EventMock {
  id: string;
  name: string;
  subtitle?: string;
  type: 'Worship' | 'Bible Study' | 'Youth' | 'Outreach' | 'Special Service' | 'Fellowship' | 'Meeting' | 'Education' | 'Special Event' | 'Prayer' | 'Training' | 'Baptism';
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxCapacity: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  organizer: string;
  description?: string;
  tenantId: string;
  createdOn: string;
}

export interface SavedReportMock {
  id: string;
  name: string;
  type: 'Financial' | 'Membership' | 'Giving' | 'Events' | 'Ministries' | 'Budgets' | 'Bank Accounts' | 'Custom';
  category: string;
  dateRange: string;
  createdOn: string;
  tenantId: string;
}

export interface CertificateTemplate {
  id: string;
  title: string;
  type: 'baptism' | 'membership' | 'donation_receipt';
  description: string;
  defaultContent: string;
}

export const mockTenants: Tenant[] = [
  { id: 'tenant-ny', name: 'Grace Community Church (New York)', location: 'New York, NY' },
  { id: 'tenant-la', name: 'Hope Fellowship (Los Angeles)', location: 'Los Angeles, CA' },
  { id: 'tenant-ch', name: 'Redeemer Anglican (Chicago)', location: 'Chicago, IL' },
];

export const mockMembers: MemberMock[] = [
  {
    id: 'mem-1',
    name: 'Pastor Thomas J. Miller',
    firstName: 'Thomas',
    lastName: 'Miller',
    email: 'thomas.miller@gracecommunity.org',
    phone: '+1 (555) 019-2831',
    role: 'Pastor',
    joinedDate: '2015-08-12',
    status: 'Active',
    tenantId: 'tenant-ny',
    gender: 'male',
    dob: '1975-10-12',
    address: 'New York, NY',
  },
  {
    id: 'mem-2',
    name: 'Sarah Elizabeth Vance',
    firstName: 'Sarah',
    lastName: 'Vance',
    email: 'sarah.vance@gmail.com',
    phone: '+1 (555) 014-9281',
    role: 'Elder',
    joinedDate: '2018-04-20',
    status: 'Active',
    tenantId: 'tenant-ny',
    gender: 'female',
    dob: '1982-05-15',
    address: 'New York, NY',
  },
  {
    id: 'mem-3',
    name: 'Benjamin David Kincaid',
    firstName: 'Benjamin',
    lastName: 'Kincaid',
    email: 'ben.kincaid@yahoo.com',
    phone: '+1 (555) 012-4859',
    role: 'Deacon',
    joinedDate: '2020-01-15',
    status: 'Active',
    tenantId: 'tenant-ny',
    gender: 'male',
    dob: '1990-08-20',
    address: 'New York, NY',
  },
  {
    id: 'mem-4',
    name: 'Hannah Grace Cooper',
    firstName: 'Hannah',
    lastName: 'Cooper',
    email: 'hannah.cooper@hotmail.com',
    phone: '+1 (555) 017-3829',
    role: 'Member',
    joinedDate: '2021-06-30',
    status: 'Active',
    tenantId: 'tenant-ny',
    gender: 'female',
    dob: '1995-12-04',
    address: 'New York, NY',
  },
  {
    id: 'mem-5',
    name: 'Matthew Logan Sterling',
    firstName: 'Matthew',
    lastName: 'Sterling',
    email: 'matt.sterling@outlook.com',
    phone: '+1 (555) 015-2819',
    role: 'Volunteer',
    joinedDate: '2023-02-11',
    status: 'Active',
    tenantId: 'tenant-ny',
    gender: 'male',
    dob: '1988-04-22',
    address: 'New York, NY',
  },
  {
    id: 'mem-6',
    name: 'Rachel Rose Miller',
    firstName: 'Rachel',
    lastName: 'Miller',
    email: 'rachel.miller@gmail.com',
    phone: '+1 (555) 011-8273',
    role: 'Member',
    joinedDate: '2022-11-05',
    status: 'Inactive',
    tenantId: 'tenant-ny',
    gender: 'female',
    dob: '2000-09-18',
    address: 'New York, NY',
  },
  {
    id: 'mem-7',
    name: 'Johnathan Cole',
    firstName: 'Johnathan',
    lastName: 'Cole',
    email: 'johnathan.cole@hopefellowship.org',
    phone: '+1 (213) 555-0144',
    role: 'Pastor',
    joinedDate: '2017-09-01',
    status: 'Active',
    tenantId: 'tenant-la',
    gender: 'male',
    dob: '1980-01-30',
    address: 'Los Angeles, CA',
  },
  {
    id: 'mem-8',
    name: 'Rebecca Jane Lin',
    firstName: 'Rebecca',
    lastName: 'Lin',
    email: 'rebecca.lin@outlook.com',
    phone: '+1 (213) 555-0199',
    role: 'Member',
    joinedDate: '2019-12-14',
    status: 'Active',
    tenantId: 'tenant-la',
    gender: 'female',
    dob: '1992-06-25',
    address: 'Los Angeles, CA',
  }
];

export const mockFinanceRecords: FinanceMock[] = [
  {
    id: 'fin-1',
    type: 'income',
    category: 'Tithes',
    amount: 25000.00,
    date: '2025-05-24',
    description: 'Sunday Tithe - Saman Perera',
    tenantId: 'tenant-ny',
    method: 'Cash',
    receipt: 'RCP-2025-1058',
  },
  {
    id: 'fin-2',
    type: 'income',
    category: 'Offerings',
    amount: 15000.00,
    date: '2025-05-24',
    description: 'Sunday Offering',
    tenantId: 'tenant-ny',
    method: 'Cash',
    receipt: 'RCP-2025-1057',
  },
  {
    id: 'fin-3',
    type: 'income',
    category: 'Donations',
    amount: 50000.00,
    date: '2025-05-24',
    description: 'Building Fund Donation',
    tenantId: 'tenant-ny',
    method: 'Bank Transfer',
    receipt: 'RCP-2025-1056',
  },
  {
    id: 'fin-4',
    type: 'expense',
    category: 'Ministry',
    amount: 12500.00,
    date: '2025-05-23',
    description: 'Youth Program Expenses',
    tenantId: 'tenant-ny',
    method: 'Bank Transfer',
    receipt: 'EXP-2025-0542',
  },
  {
    id: 'fin-5',
    type: 'expense',
    category: 'Utilities',
    amount: 18750.00,
    date: '2025-05-23',
    description: 'Electricity Bill Payment',
    tenantId: 'tenant-ny',
    method: 'Bank Transfer',
    receipt: 'EXP-2025-0541',
  },
  {
    id: 'fin-6',
    type: 'income',
    category: 'Tithe',
    amount: 2100.00,
    date: '2026-06-02',
    description: 'Direct deposit tithes',
    tenantId: 'tenant-la',
    method: 'Bank Transfer',
    receipt: 'RCP-2026-0001',
  }
];

export const mockCertificateTemplates: CertificateTemplate[] = [
  {
    id: 'cert-1',
    title: 'Certificate of Holy Baptism',
    type: 'baptism',
    description: 'Standard baptismal record for children and adults.',
    defaultContent: `
      <div class="border-[12px] border-double border-amber-800 p-16 max-w-4xl mx-auto bg-amber-50 text-stone-900 shadow-xl rounded-sm">
        <div class="text-center font-serif">
          <h1 class="text-5xl font-bold text-amber-900 tracking-wide uppercase mb-2">Certificate of Holy Baptism</h1>
          <p class="text-sm italic text-amber-700 mb-8 font-sans">"Therefore we are buried with him by baptism into death..." &mdash; Romans 6:4</p>
          
          <p class="text-xl mb-4">This certifies that</p>
          <p class="text-3xl font-bold text-stone-900 border-b-2 border-stone-400 inline-block px-8 py-1 mb-6 font-serif italic">{{name}}</p>
          
          <p class="text-xl mb-4">was baptized in the Name of the Father, and of the Son, and of the Holy Spirit on the</p>
          <p class="text-2xl font-semibold text-amber-800 mb-8 font-sans">{{date}}</p>
          
          <p class="text-lg mb-8 max-w-md mx-auto leading-relaxed">at <span class="font-semibold text-stone-800">{{tenantName}}</span>, conducted by <span class="font-semibold text-stone-800">Pastor Thomas J. Miller</span>.</p>
          
          <div class="flex justify-between items-end mt-16 px-12">
            <div class="text-center w-56 border-t border-stone-400 pt-2 text-stone-600 text-sm font-sans">
              Conducting Officiant
            </div>
            <div class="text-center">
              <span class="text-amber-800 font-serif text-3xl font-extrabold italic opacity-75">SEAL</span>
            </div>
            <div class="text-center w-56 border-t border-stone-400 pt-2 text-stone-600 text-sm font-sans">
              Church Representative
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'cert-2',
    title: 'Certificate of Church Membership',
    type: 'membership',
    description: 'Official membership confirmation certificate.',
    defaultContent: `
      <div class="border-[12px] border-double border-indigo-950 p-16 max-w-4xl mx-auto bg-slate-50 text-slate-900 shadow-xl rounded-sm">
        <div class="text-center">
          <h1 class="text-4xl font-serif font-extrabold text-indigo-950 tracking-wider uppercase mb-1">Certificate of Membership</h1>
          <div class="h-1 w-24 bg-indigo-950 mx-auto mb-8"></div>
          
          <p class="text-lg font-sans text-slate-600 mb-6">This is to declare that</p>
          <p class="text-3xl font-serif font-bold text-indigo-900 border-b border-indigo-950 inline-block px-12 py-1 mb-8">{{name}}</p>
          
          <p class="text-lg font-sans text-slate-600 mb-8">
            having publicly confessed faith in Jesus Christ as Lord and Savior,<br>
            is recognized as a beloved member in full covenant and fellowship with
          </p>
          <p class="text-2xl font-semibold text-slate-800 font-serif mb-2">{{tenantName}}</p>
          <p class="text-sm font-sans text-slate-500 mb-8">{{tenantLocation}}</p>
          
          <p class="text-sm font-sans text-slate-500">Admitted on the day of: <span class="font-semibold text-slate-800">{{date}}</span></p>
          
          <div class="flex justify-around items-end mt-20">
            <div class="text-center w-48 border-t border-slate-400 pt-2 text-slate-500 text-xs font-sans">
              Lead Pastor
            </div>
            <div class="text-center w-48 border-t border-slate-400 pt-2 text-slate-500 text-xs font-sans">
              Clerk of Session
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'cert-3',
    title: 'Official Donation Receipt',
    type: 'donation_receipt',
    description: 'Tax-deductible contribution receipt format.',
    defaultContent: `
      <div class="border border-stone-300 p-12 max-w-3xl mx-auto bg-white text-stone-800 shadow-md">
        <div class="flex justify-between items-start border-b border-stone-300 pb-6 mb-8">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-stone-900 uppercase">{{tenantName}}</h1>
            <p class="text-xs text-stone-500 mt-1">{{tenantLocation}}</p>
            <p class="text-xs text-stone-500">Tax ID: EIN-99-8877665</p>
          </div>
          <div class="text-right">
            <h2 class="text-xl font-extrabold text-stone-900 uppercase">Donation Receipt</h2>
            <p class="text-xs text-stone-500 mt-1">Receipt #: REC-{{id}}</p>
            <p class="text-xs text-stone-500">Date: {{date}}</p>
          </div>
        </div>

        <div class="mb-8 font-sans">
          <p class="mb-4">Received with gratitude from:</p>
          <div class="bg-stone-50 p-4 border border-stone-200 rounded-sm mb-6">
            <p class="font-bold text-stone-900">{{name}}</p>
          </div>
          
          <p class="mb-6">The generous charitable contribution described below:</p>
          
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-stone-300 bg-stone-100 text-xs uppercase font-bold text-stone-600">
                <th class="p-3">Contribution Date</th>
                <th class="p-3">Category</th>
                <th class="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-stone-200 text-sm">
                <td class="p-3">{{date}}</td>
                <td class="p-3 font-semibold">{{category}}</td>
                <td class="p-3 text-right font-bold text-stone-900">$ {{amount}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-stone-300 pt-6 mt-8 font-sans text-xs text-stone-500 leading-relaxed">
          <p class="mb-4">No goods or services were provided in exchange for this contribution other than intangible religious benefits. The church is a registered 501(c)(3) nonprofit organization. Please retain this receipt for tax reporting purposes.</p>
          <div class="flex justify-between items-center mt-12">
            <div>
              <p class="font-semibold text-stone-700">Authorized Signature:</p>
              <div class="h-8 w-32 border-b border-stone-400 mt-2"></div>
              <p class="mt-1 text-[10px] text-stone-400">Treasurer, {{tenantName}}</p>
            </div>
            <p class="text-stone-400 text-sm font-serif font-bold italic">Thank You for Your Support</p>
          </div>
        </div>
      </div>
    `,
  }
];

export interface ReceiptMock {
  id: string;
  receiptNo: string;
  date: string;
  memberName: string;
  memberEmail: string;
  memberPhone?: string;
  category: string;
  amount: number;
  method: 'Cash' | 'Bank Transfer' | 'Card' | 'Online';
  status: 'Emailed' | 'Printed';
  receivedBy: string;
  description?: string;
  tenantId: string;
}

export const mockReceipts: ReceiptMock[] = [
  {
    id: 'rcp-1',
    receiptNo: 'RCP-2025-1082',
    date: '2025-05-24',
    memberName: 'Saman Perera',
    memberEmail: 'saman@email.com',
    memberPhone: '+94 77 123 4567',
    category: 'Tithes',
    amount: 25000.00,
    method: 'Cash',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Tithes - May 2025',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-2',
    receiptNo: 'RCP-2025-1081',
    date: '2025-05-24',
    memberName: 'Kumara Family',
    memberEmail: 'kumara@email.com',
    memberPhone: '+94 77 987 6543',
    category: 'Offerings',
    amount: 15000.00,
    method: 'Cash',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Sunday Offering',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-3',
    receiptNo: 'RCP-2025-1080',
    date: '2025-05-24',
    memberName: 'Nadeesha Fernando',
    memberEmail: 'nadeesha@email.com',
    memberPhone: '+94 71 222 3333',
    category: 'Donations',
    amount: 50000.00,
    method: 'Bank Transfer',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Building Fund Donation',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-4',
    receiptNo: 'RCP-2025-1079',
    date: '2025-05-23',
    memberName: 'Isuru Jayasinghe',
    memberEmail: 'isuru@email.com',
    memberPhone: '+94 77 444 5555',
    category: 'Tithes',
    amount: 20000.00,
    method: 'Bank Transfer',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Tithes - May 2025',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-5',
    receiptNo: 'RCP-2025-1078',
    date: '2025-05-23',
    memberName: 'De Silva Family',
    memberEmail: 'desilva@email.com',
    memberPhone: '+94 76 555 4444',
    category: 'Thanksgiving',
    amount: 12000.00,
    method: 'Cash',
    status: 'Printed',
    receivedBy: 'Pastor John',
    description: 'Thanksgiving Offering',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-6',
    receiptNo: 'RCP-2025-1077',
    date: '2025-05-22',
    memberName: 'Shenal Perera',
    memberEmail: 'shenal@email.com',
    memberPhone: '+94 77 666 7777',
    category: 'Offerings',
    amount: 10000.00,
    method: 'Cash',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'General Offering',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-7',
    receiptNo: 'RCP-2025-1076',
    date: '2025-05-22',
    memberName: 'Anonymous',
    memberEmail: 'anonymous',
    memberPhone: 'N/A',
    category: 'Donations',
    amount: 30000.00,
    method: 'Bank Transfer',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Anonymous Donation',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-8',
    receiptNo: 'RCP-2025-1075',
    date: '2025-05-21',
    memberName: 'Fernando Family',
    memberEmail: 'fernando@email.com',
    memberPhone: '+94 77 888 9999',
    category: 'Other Income',
    amount: 25000.00,
    method: 'Cash',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Special Contribution',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-9',
    receiptNo: 'RCP-2025-1074',
    date: '2025-05-21',
    memberName: 'Perera Family',
    memberEmail: 'perera@email.com',
    memberPhone: '+94 77 999 0000',
    category: 'Tithes',
    amount: 18000.00,
    method: 'Cash',
    status: 'Printed',
    receivedBy: 'Pastor John',
    description: 'Monthly Tithe',
    tenantId: 'tenant-ny'
  },
  {
    id: 'rcp-10',
    receiptNo: 'RCP-2025-1073',
    date: '2025-05-20',
    memberName: 'Youth Group',
    memberEmail: 'youthgroup@email.com',
    memberPhone: '+94 71 111 2222',
    category: 'Event',
    amount: 8000.00,
    method: 'Cash',
    status: 'Emailed',
    receivedBy: 'Pastor John',
    description: 'Youth Event Ticket Sale',
    tenantId: 'tenant-ny'
  }
];

export const mockCategories: CategoryMock[] = [
  // tenant-ny Income Categories (14)
  { id: 'cat-1', name: 'Tithes', type: 'Income', description: 'Tithes received from members', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-2', name: 'Offerings', type: 'Income', description: 'Offerings and thanksgiving gifts', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-3', name: 'Donations', type: 'Income', description: 'General donations', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-4', name: 'Event Income', type: 'Income', description: 'Income from church events', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-5', name: 'Hall Rent', type: 'Income', description: 'Income from hall rentals', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-6', name: 'Missions Support', type: 'Income', description: 'Support for missions', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-7', name: 'Youth Ministry', type: 'Income', description: 'Youth program collections', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-8', name: 'Sunday School', type: 'Income', description: 'Kids ministry donations', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-9', name: 'Bookstall', type: 'Income', description: 'Book sales and resources', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-10', name: 'Charity Contributions', type: 'Income', description: 'Charity fund collections', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-11', name: 'Media & Tech', type: 'Income', description: 'Tech sponsorship/donations', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-12', name: 'Fellowship Meals', type: 'Income', description: 'Contribution for lunches', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-13', name: 'Special Seed', type: 'Income', description: 'Special vow/seed offerings', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-14', name: 'Benevolence Fund', type: 'Income', description: 'Benevolent donations', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  
  // tenant-ny Expense Categories (14)
  { id: 'cat-15', name: 'Ministry Expenses', type: 'Expense', description: 'Expenses related to ministries', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-16', name: 'Utilities', type: 'Expense', description: 'Electricity, Water, Internet etc.', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-17', name: 'Salaries', type: 'Expense', description: 'Staff salaries and allowances', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-18', name: 'Maintenance', type: 'Expense', description: 'Building and equipment maintenance', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-19', name: 'Office Expenses', type: 'Expense', description: 'Stationery and office expenses', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-20', name: 'Missions Expenses', type: 'Expense', description: 'Support sent to missionaries', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-21', name: 'Travel & Transport', type: 'Expense', description: 'Vehicle maintenance and travel', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-22', name: 'Tech & Subscriptions', type: 'Expense', description: 'Software and streaming utilities', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-23', name: 'Event Expenses', type: 'Expense', description: 'Catering and decor for events', status: 'Active', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-24', name: 'Printing & Publications', type: 'Expense', description: 'Bullets and newsletters print', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-25', name: 'Charity Outflow', type: 'Expense', description: 'Alms and community help', status: 'Active', createdOn: '2025-02-12', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-26', name: 'Guest Speakers', type: 'Expense', description: 'Honorarium for visitors', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-27', name: 'Building Upkeep', type: 'Expense', description: 'Repairs and decorations', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ny' },
  { id: 'cat-28', name: 'Bank Charges', type: 'Expense', description: 'Processing fees and taxes', status: 'Inactive', createdOn: '2025-02-11', createdBy: 'Pastor John', tenantId: 'tenant-ny' },

  // Seed standard defaults for tenant-la and tenant-ch too
  { id: 'cat-la-1', name: 'Tithes', type: 'Income', description: 'Tithes received from members', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-la' },
  { id: 'cat-la-2', name: 'Offerings', type: 'Income', description: 'Offerings and thanksgiving gifts', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-la' },
  { id: 'cat-la-3', name: 'Utilities', type: 'Expense', description: 'Electricity, Water, Internet etc.', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-la' },

  { id: 'cat-ch-1', name: 'Tithes', type: 'Income', description: 'Tithes received from members', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ch' },
  { id: 'cat-ch-2', name: 'Offerings', type: 'Income', description: 'Offerings and thanksgiving gifts', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ch' },
  { id: 'cat-ch-3', name: 'Utilities', type: 'Expense', description: 'Electricity, Water, Internet etc.', status: 'Active', createdOn: '2025-02-10', createdBy: 'Pastor John', tenantId: 'tenant-ch' }
];

export const mockBankAccounts: BankAccountMock[] = [
  {
    id: 'bank-1',
    bankName: 'Hatton National Bank',
    accountName: 'Main Church Account',
    accountNumber: '1210 1200 1234 567',
    accountType: 'Current',
    balance: 2145600.00,
    status: 'Active',
    branch: 'Kandy City Branch',
    currency: 'LKR',
    ledgerBalance: 2145600.00,
    lastStatementDate: '2025-05-20',
    createdOn: '2024-01-15',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ny'
  },
  {
    id: 'bank-2',
    bankName: 'Commercial Bank',
    accountName: 'Building Fund Account',
    accountNumber: '8001 0012 3456',
    accountType: 'Savings',
    balance: 1250000.00,
    status: 'Active',
    branch: 'Colombo 03 Branch',
    currency: 'LKR',
    ledgerBalance: 1250000.00,
    lastStatementDate: '2025-05-18',
    createdOn: '2024-01-20',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ny'
  },
  {
    id: 'bank-3',
    bankName: "People's Bank",
    accountName: 'Mission Fund Account',
    accountNumber: '1632 1000 7890',
    accountType: 'Savings',
    balance: 480750.00,
    status: 'Active',
    branch: 'Jaffna Branch',
    currency: 'LKR',
    ledgerBalance: 480750.00,
    lastStatementDate: '2025-05-15',
    createdOn: '2024-02-05',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ny'
  },
  {
    id: 'bank-4',
    bankName: 'Bank of Ceylon',
    accountName: 'Salary Account',
    accountNumber: '0001 2345 6789',
    accountType: 'Current',
    balance: 199400.00,
    status: 'Active',
    branch: 'Galle Branch',
    currency: 'LKR',
    ledgerBalance: 199400.00,
    lastStatementDate: '2025-05-12',
    createdOn: '2024-03-10',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ny'
  },
  {
    id: 'bank-5',
    bankName: 'Nations Trust Bank',
    accountName: 'Youth Ministry Account',
    accountNumber: '3000 9876 5432',
    accountType: 'Savings',
    balance: 50000.00,
    status: 'Active',
    branch: 'Negombo Branch',
    currency: 'LKR',
    ledgerBalance: 50000.00,
    lastStatementDate: '2025-05-10',
    createdOn: '2024-04-12',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ny'
  },

  // Seed defaults for tenant-la and tenant-ch too
  {
    id: 'bank-la-1',
    bankName: 'Hatton National Bank',
    accountName: 'Main Church Account',
    accountNumber: '1210 1200 9999 567',
    accountType: 'Current',
    balance: 1500000.00,
    status: 'Active',
    branch: 'LA Branch',
    currency: 'LKR',
    ledgerBalance: 1500000.00,
    lastStatementDate: '2025-05-20',
    createdOn: '2024-01-15',
    createdBy: 'Pastor John',
    tenantId: 'tenant-la'
  },
  {
    id: 'bank-ch-1',
    bankName: 'Hatton National Bank',
    accountName: 'Main Church Account',
    accountNumber: '1210 1200 8888 567',
    accountType: 'Current',
    balance: 1800000.00,
    status: 'Active',
    branch: 'Chicago Branch',
    currency: 'LKR',
    ledgerBalance: 1800000.00,
    lastStatementDate: '2025-05-20',
    createdOn: '2024-01-15',
    createdBy: 'Pastor John',
    tenantId: 'tenant-ch'
  }
];

const explicitLetters: LetterMock[] = [
  {
    id: 'LTR-2025-0085',
    title: 'Membership Confirmation',
    type: 'Confirmation',
    recipient: 'Kumara Family',
    recipientEmail: 'kumarafamily@email.com',
    recipientPhone: '+94 77 123 4567',
    date: '2025-05-24',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Kumara Family,\n\nWe are pleased to confirm your membership at Kingdom Connect Church. We look forward to growing together in faith and serving the Lord as one family.\n\nMay God bless you abundantly.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-24'
  },
  {
    id: 'LTR-2025-0084',
    title: 'Baptism Approval',
    type: 'Approval',
    recipient: 'Nadeesha Fernando',
    recipientEmail: 'nadeesha.f@email.com',
    recipientPhone: '+94 77 234 5678',
    date: '2025-05-23',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Nadeesha Fernando,\n\nWe are pleased to inform you that your request for holy baptism has been approved. The baptism service will be scheduled soon.\n\nGod bless you on this spiritual journey.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-23'
  },
  {
    id: 'LTR-2025-0083',
    title: 'Donation Appreciation',
    type: 'Appreciation',
    recipient: 'Saman Perera',
    recipientEmail: 'saman.p@email.com',
    recipientPhone: '+94 77 345 6789',
    date: '2025-05-22',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Saman Perera,\n\nOn behalf of Kingdom Connect Church, we express our sincere appreciation for your recent donation. Your generous support helps us continue our ministries and serve our community.\n\nThank you for your faithfulness.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-22'
  },
  {
    id: 'LTR-2025-0082',
    title: 'Event Invitation',
    type: 'Invitation',
    recipient: 'Youth Group Members',
    recipientEmail: 'youth@email.com',
    recipientPhone: '+94 77 456 7890',
    date: '2025-05-21',
    status: 'Draft',
    sentBy: 'Pastor John',
    content: `Dear Youth Group Members,\n\nYou are cordially invited to our upcoming Youth Fellowship and Pizza Night. Join us for an evening of fun, worship, and discussion.\n\nHope to see you all there!`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-21'
  },
  {
    id: 'LTR-2025-0081',
    title: 'Membership Confirmation',
    type: 'Confirmation',
    recipient: 'Isuru Jayasinghe',
    recipientEmail: 'isuru.j@email.com',
    recipientPhone: '+94 77 567 8901',
    date: '2025-05-20',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Isuru Jayasinghe,\n\nWe are pleased to confirm your membership at Kingdom Connect Church. We look forward to growing together in faith and serving the Lord as one family.\n\nMay God bless you abundantly.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-20'
  },
  {
    id: 'LTR-2025-0080',
    title: 'Volunteer Appreciation',
    type: 'Appreciation',
    recipient: 'Chandima Seneviratne',
    recipientEmail: 'chandima.s@email.com',
    recipientPhone: '+94 77 678 9012',
    date: '2025-05-19',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Chandima Seneviratne,\n\nWe would like to express our deepest gratitude for your volunteer service in our children's ministry. Your commitment and passion make a tremendous difference.\n\nThank you for your service.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-19'
  },
  {
    id: 'LTR-2025-0079',
    title: 'Baptism Approval',
    type: 'Approval',
    recipient: 'De Silva Family',
    recipientEmail: 'desilva@email.com',
    recipientPhone: '+94 77 789 0123',
    date: '2025-05-18',
    status: 'Draft',
    sentBy: 'Pastor John',
    content: `Dear De Silva Family,\n\nWe are pleased to inform you that your request for holy baptism has been approved. The baptism service will be scheduled soon.\n\nGod bless you on this spiritual journey.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-18'
  },
  {
    id: 'LTR-2025-0078',
    title: 'Condolence Letter',
    type: 'Condolence',
    recipient: 'Perera Family',
    recipientEmail: 'perera.family@email.com',
    recipientPhone: '+94 77 890 1234',
    date: '2025-05-17',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Perera Family,\n\nWe are deeply saddened to hear about the passing of your beloved mother. Please accept our heartfelt condolences. Our thoughts and prayers are with you during this difficult time.\n\nWith love and prayers.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-17'
  },
  {
    id: 'LTR-2025-0077',
    title: 'Ministry Appointment',
    type: 'Appointment',
    recipient: 'Ruwan Fernando',
    recipientEmail: 'ruwan.f@email.com',
    recipientPhone: '+94 77 901 2345',
    date: '2025-05-16',
    status: 'Draft',
    sentBy: 'Pastor John',
    content: `Dear Ruwan Fernando,\n\nWe are pleased to officially appoint you as the coordinator of our Media Ministry. We believe God has gifted you for this role and look forward to your leadership.\n\nIn His service.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-16'
  },
  {
    id: 'LTR-2025-0076',
    title: 'General Notice',
    type: 'Notice',
    recipient: 'All Members',
    recipientEmail: 'members@email.com',
    recipientPhone: '+94 77 000 0000',
    date: '2025-05-15',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Members,\n\nPlease note that our annual general meeting will be held on Sunday, June 15th, immediately after the morning service. All members are encouraged to attend.\n\nBlessings.`,
    tenantId: 'tenant-ny',
    createdOn: '2025-05-15'
  }
];

const generateMockLetters = (): LetterMock[] => {
  const lettersList = [...explicitLetters];
  const types: LetterMock['type'][] = ['Confirmation', 'Approval', 'Appreciation', 'Invitation', 'Condolence', 'Appointment', 'Notice'];
  const names = ['Amara', 'Bimal', 'Chathura', 'Dilani', 'Eshani', 'Farhan', 'Gayan', 'Harsha', 'Indika', 'Janaki', 'Kasun', 'Lakmal', 'Malkanthi', 'Nimal', 'Oshada', 'Priyani', 'Ranil', 'Sajeewa', 'Tharindu', 'Udaya'];
  const lastNames = ['Silva', 'Perera', 'Fernando', 'Seneviratne', 'Wijesinghe', 'Jayasinghe', 'Gunawardena', 'Ranasinghe', 'Dissanayake', 'Herath'];
  const statuses: LetterMock['status'][] = ['Sent', 'Draft', 'Archived'];

  for (let i = 75; i >= 1; i--) {
    const paddedNum = i.toString().padStart(4, '0');
    const id = `LTR-2025-${paddedNum}`;
    const type = types[i % types.length];
    
    let title = '';
    let content = '';
    let recipient = '';
    
    if (type === 'Confirmation') {
      recipient = `${names[i % names.length]} ${lastNames[(i + 1) % lastNames.length]} Family`;
      title = 'Membership Confirmation';
      content = `Dear ${recipient},\n\nWe are pleased to confirm your membership at Kingdom Connect Church. We look forward to growing together in faith and serving the Lord as one family.\n\nMay God bless you abundantly.`;
    } else if (type === 'Approval') {
      recipient = `${names[i % names.length]} ${lastNames[(i + 2) % lastNames.length]}`;
      title = 'Baptism Approval';
      content = `Dear ${recipient},\n\nWe are pleased to inform you that your request for holy baptism has been approved. The baptism service will be scheduled soon.\n\nGod bless you on this spiritual journey.`;
    } else if (type === 'Appreciation') {
      recipient = `${names[i % names.length]} ${lastNames[(i + 3) % lastNames.length]}`;
      title = 'Donation Appreciation';
      content = `Dear ${recipient},\n\nOn behalf of Kingdom Connect Church, we express our sincere appreciation for your recent donation. Your generous support helps us continue our ministries and serve our community.\n\nThank you for your faithfulness.`;
    } else if (type === 'Invitation') {
      recipient = `${names[i % names.length]} Family`;
      title = 'Event Invitation';
      content = `Dear ${recipient},\n\nYou are cordially invited to our upcoming Family Fellowship Night. Join us for an evening of food, games, and fellowship.\n\nHope to see you all there!`;
    } else if (type === 'Condolence') {
      recipient = `${names[i % names.length]} Family`;
      title = 'Condolence Letter';
      content = `Dear ${recipient},\n\nWe are deeply saddened to hear about the passing of your beloved family member. Please accept our heartfelt condolences. Our thoughts and prayers are with you during this difficult time.\n\nWith love and prayers.`;
    } else if (type === 'Appointment') {
      recipient = `${names[i % names.length]} ${lastNames[(i + 4) % lastNames.length]}`;
      title = 'Ministry Appointment';
      content = `Dear ${recipient},\n\nWe are pleased to officially appoint you as a ministry volunteer. We believe God has gifted you for this role and look forward to your leadership.\n\nIn His service.`;
    } else {
      recipient = 'All Members';
      title = 'General Notice';
      content = `Dear Members,\n\nPlease note that our next weekly prayer meeting will be held on Wednesday at 6:30 PM in the main chapel.\n\nBlessings.`;
    }

    const email = recipient.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '@email.com';
    const phone = `+94 77 ${Math.floor(1000000 + Math.random() * 9000000)}`;
    const status = statuses[i % statuses.length];
    
    const day = (i % 28) + 1;
    const month = (i % 5) + 1;
    const dateStr = `2025-0${month}-${day.toString().padStart(2, '0')}`;

    lettersList.push({
      id,
      title,
      type,
      recipient,
      recipientEmail: email,
      recipientPhone: phone,
      date: dateStr,
      status,
      sentBy: 'Pastor John',
      content,
      tenantId: 'tenant-ny',
      createdOn: dateStr
    });
  }

  lettersList.push({
    id: 'LTR-la-01',
    title: 'Membership Confirmation',
    type: 'Confirmation',
    recipient: 'Silva Family',
    recipientEmail: 'silva@email.com',
    recipientPhone: '+94 77 111 2222',
    date: '2025-05-10',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Silva Family,\n\nWe are pleased to confirm your membership at Kingdom Connect Church.`,
    tenantId: 'tenant-la',
    createdOn: '2025-05-10'
  });

  lettersList.push({
    id: 'LTR-ch-01',
    title: 'Membership Confirmation',
    type: 'Confirmation',
    recipient: 'Smith Family',
    recipientEmail: 'smith@email.com',
    recipientPhone: '+1 312 555 0199',
    date: '2025-05-12',
    status: 'Sent',
    sentBy: 'Pastor John',
    content: `Dear Smith Family,\n\nWe are pleased to confirm your membership at Kingdom Connect Church.`,
    tenantId: 'tenant-ch',
    createdOn: '2025-05-12'
  });

  return lettersList;
};

export const mockLetters = generateMockLetters();


export const mockBudgets: BudgetMock[] = [
  // tenant-ny Budgets (12)
  {
    id: 'bud-1',
    name: 'Ministry Operations',
    type: 'Operating',
    budgetAmount: 800000.00,
    spentAmount: 520000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'General ministry expenses',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-01'
  },
  {
    id: 'bud-2',
    name: 'Building Maintenance',
    type: 'Capital',
    budgetAmount: 600000.00,
    spentAmount: 310000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Church building upkeep',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-02'
  },
  {
    id: 'bud-3',
    name: 'Outreach Programs',
    type: 'Ministry',
    budgetAmount: 400000.00,
    spentAmount: 280000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Community outreach expenses',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-03'
  },
  {
    id: 'bud-4',
    name: 'Worship Ministry',
    type: 'Ministry',
    budgetAmount: 300000.00,
    spentAmount: 195000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Worship and music expenses',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-04'
  },
  {
    id: 'bud-5',
    name: 'Youth Ministry',
    type: 'Ministry',
    budgetAmount: 250000.00,
    spentAmount: 120750.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Youth programs and activities',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-05'
  },
  {
    id: 'bud-6',
    name: 'Staff Salaries',
    type: 'Operating',
    budgetAmount: 900000.00,
    spentAmount: 900000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'Completed',
    description: 'Staff salaries and benefits',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-06'
  },
  {
    id: 'bud-7',
    name: 'Utilities',
    type: 'Operating',
    budgetAmount: 150000.00,
    spentAmount: 104000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Electricity, Water, Internet etc.',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-07'
  },
  {
    id: 'bud-8',
    name: 'Education Ministry',
    type: 'Ministry',
    budgetAmount: 200000.00,
    spentAmount: 89000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Sunday School & Training',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-08'
  },
  {
    id: 'bud-9',
    name: 'Missions & Outreach',
    type: 'Ministry',
    budgetAmount: 0.00,
    spentAmount: 0.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Missions fund & overseas aid',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-09'
  },
  {
    id: 'bud-10',
    name: 'Special Events',
    type: 'Operating',
    budgetAmount: 0.00,
    spentAmount: 0.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Conferences, guest services',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-10'
  },
  {
    id: 'bud-11',
    name: 'Children Ministry',
    type: 'Ministry',
    budgetAmount: 0.00,
    spentAmount: 0.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Kids Sunday activities',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-11'
  },
  {
    id: 'bud-12',
    name: 'Office Upkeep',
    type: 'Operating',
    budgetAmount: 0.00,
    spentAmount: 0.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'Office supplies, printing',
    tenantId: 'tenant-ny',
    createdOn: '2025-01-12'
  },

  // Seed defaults for tenant-la and tenant-ch
  {
    id: 'bud-la-1',
    name: 'Ministry Operations',
    type: 'Operating',
    budgetAmount: 500000.00,
    spentAmount: 250000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'General operating budget',
    tenantId: 'tenant-la',
    createdOn: '2025-01-01'
  },
  {
    id: 'bud-ch-1',
    name: 'Ministry Operations',
    type: 'Operating',
    budgetAmount: 600000.00,
    spentAmount: 300000.00,
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    status: 'In Progress',
    description: 'General operating budget',
    tenantId: 'tenant-ch',
    createdOn: '2025-01-01'
  }
];

// ─── Certificates Seed Data ─────────────────────────────────────────────────

const CERT_TYPES: CertificateMock['type'][] = [
  'Membership', 'Baptism', 'Confirmation', 'Appreciation', 'Volunteer',
  'Ministry', 'Appointment', 'Training', 'Marriage', 'Sunday School'
];

const CERT_RECIPIENTS = [
  { name: 'Kumara Family', email: 'kumara@email.com', phone: '+94 77 123 4567' },
  { name: 'Nadeesha Fernando', email: 'nadeesha@email.com', phone: '+94 71 234 5678' },
  { name: 'Saman Perera', email: 'saman.p@email.com', phone: '+94 76 345 6789' },
  { name: 'Isuru Jayasinghe', email: 'isuru@email.com', phone: '+94 70 456 7890' },
  { name: 'Chandima Seneviratne', email: 'chandima@email.com', phone: '+94 75 567 8901' },
  { name: 'De Silva Family', email: 'desilva@email.com', phone: '+94 77 678 9012' },
  { name: 'Ruwan Fernando', email: 'ruwan@email.com', phone: '+94 71 789 0123' },
  { name: 'Youth Group', email: 'youth@kcc.lk', phone: '+94 76 890 1234' },
  { name: 'Tharindu Silva', email: 'tharindu@email.com', phone: '+94 70 901 2345' },
  { name: 'Perera Family', email: 'perera@email.com', phone: '+94 75 012 3456' },
  { name: 'Amali Wijesinghe', email: 'amali@email.com', phone: '+94 77 123 5678' },
  { name: 'Kasun Rathnayake', email: 'kasun@email.com', phone: '+94 71 234 6789' },
  { name: 'Dilani Jayawardena', email: 'dilani@email.com', phone: '+94 76 345 7890' },
  { name: 'Nimal Dissanayake', email: 'nimal@email.com', phone: '+94 70 456 8901' },
  { name: 'Sanjeewa Bandara', email: 'sanjeewa@email.com', phone: '+94 75 567 9012' },
  { name: 'Chathura Gunasekara', email: 'chathura@email.com', phone: '+94 77 678 0123' },
  { name: 'Lakshmi Fernando', email: 'lakshmi@email.com', phone: '+94 71 789 1234' },
  { name: 'Ruvini Mendis', email: 'ruvini@email.com', phone: '+94 76 890 2345' },
];

const CERT_NAMES: Record<CertificateMock['type'], string[]> = {
  'Membership': ['Membership Certificate', 'Full Membership Certificate', 'Associate Membership Certificate'],
  'Baptism': ['Baptism Certificate', 'Water Baptism Certificate', 'Holy Baptism Certificate'],
  'Confirmation': ['Confirmation Certificate', 'Faith Confirmation Certificate', 'Spiritual Confirmation'],
  'Appreciation': ['Certificate of Appreciation', 'Gift of Appreciation', 'Service Appreciation Award'],
  'Volunteer': ['Volunteer Certificate', 'Volunteer Service Certificate', 'Volunteer Recognition'],
  'Ministry': ['Ministry Certificate', 'Sunday School Certificate', 'Ministry Appointment'],
  'Appointment': ['Ministry Appointment', 'Leadership Appointment', 'Deacon Appointment'],
  'Training': ['Training Completion', 'Leadership Training Certificate', 'Discipleship Training'],
  'Marriage': ['Marriage Certificate', 'Holy Matrimony Certificate', 'Wedding Blessing Certificate'],
  'Sunday School': ['Sunday School Certificate', 'Sunday School Completion', 'Children Ministry Award'],
};

const generateMockCertificates = (): CertificateMock[] => {
  const list: CertificateMock[] = [];
  const tenants = ['tenant-ny', 'tenant-la', 'tenant-ch'];
  const issuers = ['Pastor John', 'Pastor James', 'Elder Sarah', 'Pastor Michael'];
  const baseDate = new Date('2025-05-25');
  let certNum = 156;

  for (let i = 0; i < 156; i++) {
    const type = CERT_TYPES[i % CERT_TYPES.length];
    const recipient = CERT_RECIPIENTS[i % CERT_RECIPIENTS.length];
    const tenantId = tenants[i % tenants.length];
    const names = CERT_NAMES[type];
    const certName = names[i % names.length];
    const issuer = issuers[i % issuers.length];

    // Spread statuses: ~85% Issued, ~10% Draft, ~5% Archived  (matches screenshot: 132/16/8)
    let status: CertificateMock['status'];
    if (i < 132) {
      status = 'Issued';
    } else if (i < 148) {
      status = 'Draft';
    } else {
      status = 'Archived';
    }

    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    list.push({
      id: `CERT-2025-${String(certNum).padStart(4, '0')}`,
      name: certName,
      type,
      recipient: recipient.name,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      issuedDate: dateStr,
      issuedBy: issuer,
      status,
      tenantId,
      createdOn: dateStr,
    });
    certNum--;
  }

  return list;
};

export const mockCertificates = generateMockCertificates();

// ─── Events Seed Data ────────────────────────────────────────────────────────

const UPCOMING_EVENTS_TEMPLATE = [
  {
    name: "Sunday Worship Service",
    type: "Worship" as const,
    subtitle: "Weekly Worship",
    time: "8:00 AM - 10:00 AM",
    location: "Main Church Sanctuary",
    attendees: 320,
    maxCapacity: 400,
    status: "Upcoming" as const,
    organizer: "Pastor John",
    date: "2025-05-04",
  },
  {
    name: "Bible Study",
    type: "Bible Study" as const,
    subtitle: "Midweek Bible Study",
    time: "7:00 PM - 8:30 PM",
    location: "Fellowship Hall",
    attendees: 85,
    maxCapacity: 120,
    status: "Upcoming" as const,
    organizer: "Pastor James",
    date: "2025-05-07",
  },
  {
    name: "Youth Fellowship",
    type: "Fellowship" as const,
    subtitle: "For ages 13-25",
    time: "5:00 PM - 8:00 PM",
    location: "Youth Hall",
    attendees: 35,
    maxCapacity: 60,
    status: "Upcoming" as const,
    organizer: "Youth Leader Dave",
    date: "2025-05-10",
  },
  {
    name: "Praise & Worship Night",
    type: "Worship" as const,
    subtitle: "An evening of worship",
    time: "6:00 PM - 8:30 PM",
    location: "Main Church Sanctuary",
    attendees: 210,
    maxCapacity: 300,
    status: "Upcoming" as const,
    organizer: "Music Director Amy",
    date: "2025-05-11",
  },
  {
    name: "Community Outreach",
    type: "Outreach" as const,
    subtitle: "Serving our community",
    time: "9:00 AM - 1:00 PM",
    location: "City Center Community",
    attendees: 120,
    maxCapacity: 150,
    status: "Upcoming" as const,
    organizer: "Deacon Bob",
    date: "2025-05-17",
  },
  {
    name: "Ascension Sunday Service",
    type: "Special Service" as const,
    subtitle: "Special Sunday Service",
    time: "8:00 AM - 10:30 AM",
    location: "Main Church Sanctuary",
    attendees: 450,
    maxCapacity: 500,
    status: "Upcoming" as const,
    organizer: "Pastor John",
    date: "2025-05-18",
  },
  {
    name: "Men's Fellowship Breakfast",
    type: "Fellowship" as const,
    subtitle: "Breakfast & Fellowship",
    time: "8:00 AM - 10:00 AM",
    location: "Fellowship Hall",
    attendees: 60,
    maxCapacity: 80,
    status: "Upcoming" as const,
    organizer: "Elder Mike",
    date: "2025-05-24",
  },
  {
    name: "Women's Ministry Meeting",
    type: "Meeting" as const,
    subtitle: "Empowering Women",
    time: "4:00 PM - 6:00 PM",
    location: "Conference Room",
    attendees: 40,
    maxCapacity: 60,
    status: "Upcoming" as const,
    organizer: "Sister Helen",
    date: "2025-05-25",
  },
  {
    name: "Children's Sunday School",
    type: "Education" as const,
    subtitle: "Learning God's Word",
    time: "10:00 AM - 11:30 AM",
    location: "Children's Wing",
    attendees: 150,
    maxCapacity: 200,
    status: "Ongoing" as const,
    organizer: "Director Sarah",
    date: "2025-05-25",
  },
  {
    name: "Church Anniversary",
    type: "Special Event" as const,
    subtitle: "Celebrating God's Faithfulness",
    time: "10:00 AM - 2:00 PM",
    location: "Main Church Grounds",
    attendees: 500,
    maxCapacity: 600,
    status: "Upcoming" as const,
    organizer: "Pastor John",
    date: "2025-05-31",
  },
  {
    name: "Leadership Seminar",
    type: "Training" as const,
    subtitle: "Equipping leaders",
    time: "9:00 AM - 12:00 PM",
    location: "Conference Room",
    attendees: 25,
    maxCapacity: 40,
    status: "Upcoming" as const,
    organizer: "Pastor John",
    date: "2025-06-05",
  },
  {
    name: "Monthly Prayer Summit",
    type: "Prayer" as const,
    subtitle: "Intercession & Prayer",
    time: "7:00 PM - 9:00 PM",
    location: "Main Church Sanctuary",
    attendees: 80,
    maxCapacity: 120,
    status: "Upcoming" as const,
    organizer: "Pastor James",
    date: "2025-06-07",
  }
];

const COMPLETED_TYPES = [
  { type: "Worship" as const, name: "Sunday Worship Service", location: "Main Church Sanctuary", time: "8:00 AM - 10:00 AM", subtitle: "Weekly Worship" },
  { type: "Bible Study" as const, name: "Midweek Bible Study", location: "Fellowship Hall", time: "7:00 PM - 8:30 PM", subtitle: "Midweek Bible Study" },
  { type: "Fellowship" as const, name: "Youth Fellowship Meeting", location: "Youth Hall", time: "5:00 PM - 7:30 PM", subtitle: "Youth Group" },
  { type: "Prayer" as const, name: "Weekly Prayer Meeting", location: "Chapel", time: "6:30 PM - 8:00 PM", subtitle: "Midweek Intercession" }
];

const generateMockEvents = (): EventMock[] => {
  const list: EventMock[] = [];
  
  // 1. Generate 36 Completed Events for tenant-ny (sum of attendees = 1245)
  let sumAttendees = 0;
  const targetSum = 1245;
  const baseDate = new Date("2025-04-28");
  
  for (let i = 1; i <= 36; i++) {
    const tpl = COMPLETED_TYPES[i % COMPLETED_TYPES.length];
    
    // Deterministic attendees count
    let att = 20 + ((i * 13) % 25);
    
    // For the last element, balance to reach exactly targetSum (1245)
    if (i === 36) {
      att = targetSum - sumAttendees;
    } else {
      sumAttendees += att;
    }
    
    const date = new Date(baseDate);
    // Spread them out twice a week going backward
    date.setDate(date.getDate() - (i * 3));
    const dateStr = date.toISOString().split('T')[0];
    
    list.push({
      id: `EVT-2025-${String(i).padStart(4, '0')}`,
      name: tpl.name,
      subtitle: tpl.subtitle,
      type: tpl.type,
      date: dateStr,
      time: tpl.time,
      location: tpl.location,
      attendees: att,
      maxCapacity: att + 20,
      status: "Completed",
      organizer: "Pastor John",
      description: `Regular church event: ${tpl.name}. Thank you to all attendees.`,
      tenantId: "tenant-ny",
      createdOn: dateStr
    });
  }
  
  // 2. Add the 12 Upcoming/Ongoing events for tenant-ny
  UPCOMING_EVENTS_TEMPLATE.forEach((evt, idx) => {
    const eventNum = 36 + idx + 1;
    list.push({
      id: `EVT-2025-${String(eventNum).padStart(4, '0')}`,
      name: evt.name,
      subtitle: evt.subtitle,
      type: evt.type,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      attendees: evt.attendees,
      maxCapacity: evt.maxCapacity,
      status: evt.status,
      organizer: evt.organizer,
      description: `Community event: ${evt.name}. Please register and join us!`,
      tenantId: "tenant-ny",
      createdOn: "2025-05-01"
    });
  });
  
  // 3. Add 15 mixed events for tenant-la and tenant-ch
  const otherTenants = ["tenant-la", "tenant-ch"];
  otherTenants.forEach((tId) => {
    for (let i = 1; i <= 15; i++) {
      const isUpcoming = i > 11;
      const tpl = COMPLETED_TYPES[i % COMPLETED_TYPES.length];
      const date = new Date("2025-05-15");
      date.setDate(date.getDate() + (isUpcoming ? i - 10 : -i * 3));
      const dateStr = date.toISOString().split('T')[0];
      
      list.push({
        id: `EVT-2025-${tId === "tenant-la" ? "LA" : "CH"}-${String(i).padStart(4, '0')}`,
        name: tpl.name,
        subtitle: tpl.subtitle,
        type: tpl.type,
        date: dateStr,
        time: tpl.time,
        location: tpl.location,
        attendees: isUpcoming ? 10 + i * 2 : 25 + (i * 3),
        maxCapacity: 100,
        status: isUpcoming ? "Upcoming" : "Completed",
        organizer: tId === "tenant-la" ? "Pastor Linda" : "Pastor Charles",
        description: `Event organized at ${tId === "tenant-la" ? "Los Angeles" : "Chicago"} location.`,
        tenantId: tId,
        createdOn: "2025-04-15"
      });
    }
  });
  
  return list;
};

export const mockEvents = generateMockEvents();

// ─── Reports Seed Data ───────────────────────────────────────────────────────

export const mockSavedReports: SavedReportMock[] = [
  {
    id: "RPT-2025-0001",
    name: "Income Statement - May 2025",
    type: "Financial",
    category: "Income & Expense Statements",
    dateRange: "01 May 2025 - 31 May 2025",
    createdOn: "2025-05-31",
    tenantId: "tenant-ny"
  },
  {
    id: "RPT-2025-0002",
    name: "Expense Report - May 2025",
    type: "Financial",
    category: "Detailed Expense Breakdowns",
    dateRange: "01 May 2025 - 31 May 2025",
    createdOn: "2025-05-31",
    tenantId: "tenant-ny"
  },
  {
    id: "RPT-2025-0003",
    name: "Member List - All Members",
    type: "Membership",
    category: "Active Members Directory",
    dateRange: "All time",
    createdOn: "2025-05-28",
    tenantId: "tenant-ny"
  },
  {
    id: "RPT-2025-0004",
    name: "Event Attendance - May 2025",
    type: "Events",
    category: "Event Registrations",
    dateRange: "01 May 2025 - 31 May 2025",
    createdOn: "2025-05-30",
    tenantId: "tenant-ny"
  },
  // Other tenants
  {
    id: "RPT-2025-LA-0001",
    name: "LA Financial Overview",
    type: "Financial",
    category: "General Ledger",
    dateRange: "01 Jan 2025 - 30 Jun 2025",
    createdOn: "2025-05-15",
    tenantId: "tenant-la"
  },
  {
    id: "RPT-2025-CH-0001",
    name: "Chicago Ministry Impact Report",
    type: "Membership",
    category: "Ministries Outreach",
    dateRange: "01 Jan 2025 - 30 Jun 2025",
    createdOn: "2025-05-15",
    tenantId: "tenant-ch"
  }
];


