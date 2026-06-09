import React from 'react';
import Link from 'next/link';

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
  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Recent Members
          </h2>
          <Link href="/members" className="text-[#5B3DF5] hover:text-[#4529d8] font-bold text-sm transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.avatar || `https://i.pravatar.cc/150?img=${index + 10}`}
                  alt={member.name}
                  className="h-12 w-12 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {member.gender} • {member.age}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-450 font-bold">
                {member.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
