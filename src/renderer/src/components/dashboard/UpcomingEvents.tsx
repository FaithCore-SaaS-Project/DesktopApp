import React from 'react';
import Link from 'next/link';

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
  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Upcoming Events
          </h2>
          <Link href="/events" className="text-[#5B3DF5] hover:text-[#4529d8] font-bold text-sm transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-205"
            >
              <div className="h-16 w-16 min-w-16 rounded-2xl border border-gray-150 bg-gray-50 flex flex-col items-center justify-center select-none shadow-sm">
                <span className="font-extrabold text-xl text-gray-800 leading-none">
                  {event.day}
                </span>
                <span className="text-[10px] text-[#5B3DF5] font-black uppercase tracking-wider mt-1">
                  {event.month}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-gray-800 leading-snug">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {event.time}
                </p>
                <p className="text-xs text-gray-400 font-semibold">
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
