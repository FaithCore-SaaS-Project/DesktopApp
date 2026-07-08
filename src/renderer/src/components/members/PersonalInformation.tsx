import React from 'react';
import { MemberMock } from '../../services/mockData';

interface PersonalInformationProps {
  member: MemberMock & {
    nic?: string;
    occupation?: string;
    address?: string;
    dob?: string;
    passportNumber?: string;
    gender?: string;
    nationality?: string;
    mobile?: string;
  };
  onEdit?: () => void;
}

export default function PersonalInformation({ member, onEdit }: PersonalInformationProps) {
  const fields = [
    { label: "Full Name", value: member.name },
    { label: "NIC Number", value: member.nic || "N/A" },
    { label: "Occupation", value: member.occupation || "N/A" },
    { label: "Date Of Birth", value: member.dob || "N/A" },
    { label: "Gender", value: member.gender || "Male" },
    { label: "Phone", value: member.phone || "N/A" },
    { label: "Email", value: member.email || "N/A" },
    { label: "Marital Status", value: member.maritalStatus ? (member.maritalStatus.charAt(0).toUpperCase() + member.maritalStatus.slice(1)) : "Single" },
    { label: "Permanent Address", value: member.permanentAddress || member.address || "N/A" },
    { label: "Postal Address", value: member.postalAddress || "N/A" },
  ];

  return (
    <div className="bg-white border border-gray-150 rounded-b-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-extrabold text-gray-900">
          Personal Information
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl px-5 py-2.5 transition-colors active:scale-[0.98]"
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
        {fields.map((field, index) => (
          <Field key={index} label={field.label} value={field.value} />
        ))}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <h4 className="text-sm font-semibold text-gray-800 break-words">
        {value}
      </h4>
    </div>
  );
}
