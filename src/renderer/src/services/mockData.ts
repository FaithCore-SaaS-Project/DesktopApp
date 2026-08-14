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

export const mockTenants: Tenant[] = [];

export const mockMembers: MemberMock[] = [];

export const mockFinanceRecords: FinanceMock[] = [];

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

export const mockReceipts: ReceiptMock[] = [];

export const mockCategories: CategoryMock[] = [];

export const mockBankAccounts: BankAccountMock[] = [];

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


export const mockBudgets: BudgetMock[] = [];

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

export const mockSavedReports: SavedReportMock[] = [];


