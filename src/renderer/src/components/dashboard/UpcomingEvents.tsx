import React from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock, MapPin } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[360px] h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Scheduled church calendar</p>
          </div>
          <Link href="/events" passHref legacyBehavior>
            <a className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all <ChevronRight size={13} />
            </a>
          </Link>
        </div>

        {!hasEvents ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5 border border-slate-200/60">
              <CalendarDays size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No upcoming events</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5 font-medium leading-relaxed">
              New schedule dates will show here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.slice(0, 3).map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="h-11 w-11 min-w-[44px] rounded-lg border border-blue-200/60 bg-blue-50/70 flex flex-col items-center justify-center text-center select-none shrink-0">
                  <span className="font-bold text-sm text-blue-900 leading-none">
                    {event.day}
                  </span>
                  <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                    {event.month}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-xs leading-snug truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-400" /> {event.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={11} className="text-slate-400" /> {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
