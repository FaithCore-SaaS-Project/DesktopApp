import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MemberFormModal from '../MemberFormModal';

vi.mock('../../../services/memberService', () => ({
  memberService: {
    saveMember: vi.fn(),
  },
}));

vi.mock('../../../services/api', () => ({
  isElectron: () => false,
}));

describe('MemberFormModal', () => {
  it('renders correctly', () => {
    render(
      <MemberFormModal 
        isOpen={true} 
        onClose={() => {}} 
        onSaved={() => {}} 
        tenantId="10" 
        editingMember={null}
        families={[]}
        onSuccess={() => {}}
      />
    );
    expect(screen.getByText('Register New Member')).toBeInTheDocument();
  });
});
