export interface Tenant {
  id: string;
  name: string;
  location: string;
  logoUrl?: string;
}

export interface MemberMock {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Pastor' | 'Elder' | 'Deacon' | 'Member' | 'Volunteer' | 'Visitor';
  joinedDate: string;
  status: 'Active' | 'Inactive' | 'Archived';
  tenantId: string;
}

export interface FinanceMock {
  id: string;
  type: 'income' | 'expense';
  category: 'Tithe' | 'Offering' | 'Building Fund' | 'Missions' | 'Salary' | 'Utilities' | 'Maintenance' | 'Events';
  amount: number;
  date: string;
  description: string;
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
    email: 'thomas.miller@gracecommunity.org',
    phone: '+1 (555) 019-2831',
    role: 'Pastor',
    joinedDate: '2015-08-12',
    status: 'Active',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-2',
    name: 'Sarah Elizabeth Vance',
    email: 'sarah.vance@gmail.com',
    phone: '+1 (555) 014-9281',
    role: 'Elder',
    joinedDate: '2018-04-20',
    status: 'Active',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-3',
    name: 'Benjamin David Kincaid',
    email: 'ben.kincaid@yahoo.com',
    phone: '+1 (555) 012-4859',
    role: 'Deacon',
    joinedDate: '2020-01-15',
    status: 'Active',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-4',
    name: 'Hannah Grace Cooper',
    email: 'hannah.cooper@hotmail.com',
    phone: '+1 (555) 017-3829',
    role: 'Member',
    joinedDate: '2021-06-30',
    status: 'Active',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-5',
    name: 'Matthew Logan Sterling',
    email: 'matt.sterling@outlook.com',
    phone: '+1 (555) 015-2819',
    role: 'Volunteer',
    joinedDate: '2023-02-11',
    status: 'Active',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-6',
    name: 'Rachel Rose Miller',
    email: 'rachel.miller@gmail.com',
    phone: '+1 (555) 011-8273',
    role: 'Member',
    joinedDate: '2022-11-05',
    status: 'Inactive',
    tenantId: 'tenant-ny',
  },
  {
    id: 'mem-7',
    name: 'Johnathan Cole',
    email: 'johnathan.cole@hopefellowship.org',
    phone: '+1 (213) 555-0144',
    role: 'Pastor',
    joinedDate: '2017-09-01',
    status: 'Active',
    tenantId: 'tenant-la',
  },
  {
    id: 'mem-8',
    name: 'Rebecca Jane Lin',
    email: 'rebecca.lin@outlook.com',
    phone: '+1 (213) 555-0199',
    role: 'Member',
    joinedDate: '2019-12-14',
    status: 'Active',
    tenantId: 'tenant-la',
  }
];

export const mockFinanceRecords: FinanceMock[] = [
  {
    id: 'fin-1',
    type: 'income',
    category: 'Tithe',
    amount: 1250.00,
    date: '2026-06-01',
    description: 'Sunday morning service Tithes - Batch A',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-2',
    type: 'income',
    category: 'Offering',
    amount: 680.50,
    date: '2026-06-01',
    description: 'Sunday morning service General Offering',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-3',
    type: 'expense',
    category: 'Utilities',
    amount: 420.15,
    date: '2026-05-28',
    description: 'Monthly electric and power bill (ConEd)',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-4',
    type: 'expense',
    category: 'Salary',
    amount: 3200.00,
    date: '2026-05-25',
    description: 'Staff Payroll - pastoral and administrative',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-5',
    type: 'income',
    category: 'Building Fund',
    amount: 5000.00,
    date: '2026-05-20',
    description: 'Special donation for main sanctuary renovation',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-6',
    type: 'expense',
    category: 'Maintenance',
    amount: 180.00,
    date: '2026-05-18',
    description: 'Sanctuary HVAC filter replacement & checkup',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-7',
    type: 'income',
    category: 'Missions',
    amount: 450.00,
    date: '2026-05-15',
    description: 'Monthly Mission support donation',
    tenantId: 'tenant-ny',
  },
  {
    id: 'fin-8',
    type: 'income',
    category: 'Tithe',
    amount: 2100.00,
    date: '2026-06-02',
    description: 'Direct deposit tithes',
    tenantId: 'tenant-la',
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
