import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Users,
  Receipt,
  Mail,
  BadgeCheck,
  DollarSign,
  ArrowRight,
} from "lucide-react";

interface ActionItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  path: string;
}

const actions: ActionItem[] = [
  {
    icon: UserPlus,
    title: "Add Member",
    description: "Register new church attendee",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
    path: "/members",
  },
  {
    icon: Users,
    title: "Add Family",
    description: "Create family unit folder",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 group-hover:bg-violet-600 group-hover:text-white",
    path: "/families",
  },
  {
    icon: Receipt,
    title: "Add Receipt",
    description: "Record tithe & donation",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
    path: "/finance",
  },
  {
    icon: Mail,
    title: "New Letter",
    description: "Issue official letter",
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white",
    path: "/letters",
  },
  {
    icon: BadgeCheck,
    title: "New Certificate",
    description: "Generate baptism / dedication",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
    path: "/certificates",
  },
  {
    icon: DollarSign,
    title: "Add Expense",
    description: "Log ministry disbursement",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50 group-hover:bg-rose-600 group-hover:text-white",
    path: "/finance",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Quick Actions
          </h2>
          <p className="text-xs text-slate-500 font-medium">Common daily operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.path} key={index} passHref legacyBehavior>
              <a className="group flex items-center justify-between p-3 rounded-lg border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/70 transition-all duration-150 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.iconBg} ${action.iconColor} transition-colors shrink-0`}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                      {action.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
