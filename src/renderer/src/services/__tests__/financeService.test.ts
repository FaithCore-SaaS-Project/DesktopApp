import { describe, it, expect, vi, beforeEach } from 'vitest';
import { financeService } from '../financeService';
import api from '../../lib/axios';

vi.mock('../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../api', () => ({
  isElectron: () => false,
}));

describe('financeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and formats finance records correctly', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          type: 'income',
          category: 'Tithes',
          amount: '5000.00',
          date: '2026-08-04',
          description: 'Sunday offering',
          church_id: 10,
          method: 'Cash',
          receipt: 'REC001',
        },
      ],
    };

    (api.get as any).mockResolvedValue({ status: 200, data: mockData });

    const records = await financeService.getFinanceRecords('10');
    expect(api.get).toHaveBeenCalledWith('/finance/records');
    expect(records.length).toBe(1);
    expect(records[0].amount).toBe(5000);
    expect(records[0].tenantId).toBe('10');
    expect(records[0].id).toBe('1');
  });

  it('handles 403 gracefully', async () => {
    (api.get as any).mockResolvedValue({ status: 403 });
    const records = await financeService.getFinanceRecords('10');
    expect(records.length).toBe(0);
  });
});
