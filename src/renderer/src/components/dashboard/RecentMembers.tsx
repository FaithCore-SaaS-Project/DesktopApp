import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

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
  // If members prop is explicitly passed but is empty (e.g. from an API that loaded but returned no records),
  // we render a beautiful empty state to prevent card collapsing.
  const hasMembers = members && members.length > 0;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm shadow-slate-100/50 flex flex-col justify-between min-h-[380px] h-full">
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Recent Members
          </h2>
          <Link href="/members" passHref legacyBehavior>
            <a className="text-xs font-bold text-violet-500 hover:text-violet-600 transition-colors">
              View All
            </a>
          </Link>
        </div>

        {!hasMembers ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-3 border border-violet-100/30">
              <Users size={20} />
            </div>
            <p className="text-xs font-bold text-slate-600">No members registered</p>
            <p className="text-[10px] text-slate-400 max-w-[190px] mt-1 font-medium leading-relaxed">
              Add members to your church roster to see them listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 flex-1">
            {members.slice(0, 4).map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || `https://i.pravatar.cc/150?img=${index + 10}`}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-700 text-xs leading-snug">
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {member.gender} • {member.age}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">
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
