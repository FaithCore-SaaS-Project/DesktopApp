import React from 'react';
import {
  Calendar,
  CalendarDays,
  Users,
  CheckCircle
} from 'lucide-react';
import { EventMock } from '../../services/mockData';

interface EventStatsProps {
  events: EventMock[];
}

export default function EventStats({ events }: EventStatsProps) {
  const totalCount = events.length;
  const upcomingCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').length;
  const completedCount = events.filter(e => e.status === 'Completed').length;
  const totalAttendees = events.filter(e => e.status === 'Completed').reduce((sum, e) => sum + e.attendees, 0);

  const completedPct = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : '0.0';

  const stats = [
    {
      title: "Total Events",
      value: totalCount.toString(),
      subtext: "All time",
      extra: "+6 this month",
      subtextColor: "text-gray-400",
      icon: Calendar,
      color: "bg-purple-500 shadow-purple-100",
      iconColor: "text-white",
    },
    {
      title: "Upcoming Events",
      value: upcomingCount.toString(),
      subtext: "Next 30 days",
      extra: null,
      subtextColor: "text-green-600",
      icon: CalendarDays,
      color: "bg-green-500 shadow-green-100",
      iconColor: "text-white",
    },
    {
      title: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      subtext: "Across all events",
      extra: null,
      subtextColor: "text-blue-600",
      icon: Users,
      color: "bg-blue-500 shadow-blue-100",
      iconColor: "text-white",
    },
    {
      title: "Completed Events",
      value: completedCount.toString(),
      subtext: `${completedPct}% of total`,
      extra: null,
      subtextColor: "text-orange-600",
      icon: CheckCircle,
      color: "bg-orange-500 shadow-orange-100",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
                {item.extra ? (
                  <div className="flex flex-col">
                    <span className="text-gray-450">{item.subtext}</span>
                    <span className="text-green-600">{item.extra}</span>
                  </div>
                ) : (
                  <span className={item.subtextColor}>
                    {item.subtext}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
