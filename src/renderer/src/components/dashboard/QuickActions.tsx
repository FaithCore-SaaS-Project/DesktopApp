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
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col h-full justify-between">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-4 flex-1">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.path} key={index} passHref legacyBehavior>
              <a className={`border rounded-2xl p-5 hover:shadow-md transition-all duration-200 active:scale-[0.98] flex flex-col items-center justify-center text-center cursor-pointer ${action.bgColor}`}>
                <div className="flex justify-center items-center">
                  <Icon
                    size={34}
                    className={action.color}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-800">
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
