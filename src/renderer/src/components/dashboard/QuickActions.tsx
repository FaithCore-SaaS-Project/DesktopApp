import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Users,
  Receipt,
  Mail,
  BadgeCheck,
  DollarSign,
} from "lucide-react";

interface ActionItem {
  icon: React.ComponentType<any>;
  title: string;
  color: string;
  bgColor: string;
  path: string;
}

const actions: ActionItem[] = [
  {
    icon: UserPlus,
    title: "Add Member",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100/70 border-purple-100",
    path: "/members",
  },
  {
    icon: Users,
    title: "Add Family",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 hover:bg-cyan-100/70 border-cyan-100",
    path: "/families",
  },
  {
    icon: Receipt,
    title: "Add Receipt",
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100/70 border-green-100",
    path: "/finance",
  },
  {
    icon: Mail,
    title: "New Letter",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100/70 border-blue-100",
    path: "/letters",
  },
  {
    icon: BadgeCheck,
    title: "New Certificate",
    color: "text-orange-500",
    bgColor: "bg-orange-50 hover:bg-orange-100/70 border-orange-100",
    path: "/certificates",
  },
  {
    icon: DollarSign,
    title: "Add Expense",
    color: "text-red-500",
    bgColor: "bg-red-50 hover:bg-red-100/70 border-red-100",
    path: "/finance",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm shadow-slate-100/50 flex flex-col h-full justify-between">
      <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.path} key={index} passHref legacyBehavior>
              <a className={`border rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex flex-col items-center justify-center text-center cursor-pointer ${action.bgColor}`}>
                <div className="flex justify-center items-center">
                  <Icon
                    size={28}
                    className={action.color}
                  />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-700">
                  {action.title}
                </p>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
