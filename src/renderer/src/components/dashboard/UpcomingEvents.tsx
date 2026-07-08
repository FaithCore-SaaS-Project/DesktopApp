import React from 'react';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

interface Event {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
}

interface UpcomingEventsProps {
  events?: Event[];
}

const defaultEvents: Event[] = [
  {
    day: "28",
    month: "MAY",
    title: "Sunday Worship Service",
    time: "8:00 AM - 10:30 AM",
    location: "Main Church",
  },
  {
    day: "01",
    month: "JUN",
    title: "Baptism Service",
    time: "2:00 PM - 4:00 PM",
    location: "Main Church",
  },
  {
    day: "07",
    month: "JUN",
    title: "Youth Fellowship",
    time: "4:00 PM - 6:00 PM",
    location: "Fellowship Hall",
  },
];

export default function UpcomingEvents({ events = defaultEvents }: UpcomingEventsProps) {
  const hasEvents = events && events.length > 0;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm shadow-slate-100/50 flex flex-col justify-between min-h-[380px] h-full">
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Upcoming Events
          </h2>
          <Link href="/events" passHref legacyBehavior>
            <a className="text-xs font-bold text-violet-500 hover:text-violet-600 transition-colors">
              View All
            </a>
          </Link>
        </div>

        {!hasEvents ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-3 border border-violet-100/30">
              <CalendarDays size={20} />
            </div>
            <p className="text-xs font-bold text-slate-600">No upcoming events</p>
            <p className="text-[10px] text-slate-400 max-w-[190px] mt-1 font-medium leading-relaxed">
              Create upcoming church events to display them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 flex-1">
            {events.slice(0, 3).map((event, index) => (
              <div
                key={index}
                className="flex gap-4 p-2 rounded-2xl hover:bg-slate-50/50 transition-all duration-200"
              >
                <div className="h-14 w-14 min-w-14 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center select-none shadow-sm shadow-slate-100/30">
                  <span className="font-extrabold text-lg text-slate-700 leading-none">
                    {event.day}
                  </span>
                  <span className="text-[9px] text-violet-500 font-black uppercase tracking-wider mt-1">
                    {event.month}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-slate-700 text-xs leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">
                    {event.time}
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5 leading-none">
                    {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
