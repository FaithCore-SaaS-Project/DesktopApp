import React from 'react';
import { MemberMock } from '../../services/mockData';

interface FamilyInformationProps {
  member: MemberMock & {
    spouse?: string;
    children?: string[];
  };
}

export default function FamilyInformation({ member }: FamilyInformationProps) {
  const spouse = member.spouse || "Nadeesha Perera";
  const children = member.children || ["Imesh Perera", "Shenal Perera"];

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col h-full">
      <h2 className="font-extrabold text-lg text-gray-900 mb-6">
        Family Information
      </h2>
      <div className="space-y-5 flex-1">
        <div className="border-b border-gray-50 pb-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Spouse
          </h4>
          <p className="text-sm font-semibold text-gray-800">{spouse || "Not Registered"}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Children
          </h4>
          {children && children.length > 0 ? (
            <div className="space-y-1.5">
              {children.map((child, idx) => (
                <p key={idx} className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5B3DF5]" />
                  {child}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No children registered</p>
          )}
        </div>
      </div>
    </div>
  );
}
