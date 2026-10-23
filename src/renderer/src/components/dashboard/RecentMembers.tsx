import React from 'react';
import Link from 'next/link';
import { Users, ChevronRight } from 'lucide-react';

interface Member {
  name: string;
  age: string;
  gender: string;
  date: string;
  avatar?: string;
}

interface RecentMembersProps {
  members?: Member[];
}

const defaultMembers: Member[] = [
  {
    name: "Saman Perera",
    age: "28 Years",
    gender: "Male",
    date: "21 May 2025",
  },
  {
    name: "Nadeesha Fernando",
    age: "32 Years",
    gender: "Female",
    date: "20 May 2025",
  },
  {
    name: "Isuru Jayasinghe",
    age: "45 Years",
    gender: "Male",
    date: "19 May 2025",
  },
  {
    name: "Tharushi Weerasinghe",
    age: "26 Years",
    gender: "Female",
    date: "18 May 2025",
  },
];

export default function RecentMembers({ members = defaultMembers }: RecentMembersProps) {
  const hasMembers = members && members.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[360px] h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Members
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Newly enrolled members</p>
          </div>
          <Link href="/members" passHref legacyBehavior>
            <a className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all <ChevronRight size={13} />
            </a>
          </Link>
        </div>

        {!hasMembers ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5 border border-slate-200/60">
              <Users size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No members registered</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5 font-medium leading-relaxed">
              New registrations will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.slice(0, 4).map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2.5 hover:bg-slate-50/80 px-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 overflow-hidden">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {member.gender} • {member.age}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {member.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
