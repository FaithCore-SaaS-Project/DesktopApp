import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EventMock } from '../../services/mockData';
import { apiService } from '../../services/api';

interface EventsSidebarProps {
  events: EventMock[];
  selectedEvent: EventMock | null;
  onSelectEvent: (evt: EventMock) => void;
  onViewDetails?: (evt: EventMock) => void;
}

export default function EventsSidebar({
  events,
  selectedEvent,
  onSelectEvent,
  onViewDetails
}: EventsSidebarProps) {
  // 1. Dynamic Counts
  const upcomingCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing').length;
  // This month (May 2025)
  const thisMonthCount = events.filter(e => e.date && e.date.startsWith('2025-05')).length;
  // This week (May 11 - May 17, 2025)
  const thisWeekCount = events.filter(e => {
    if (!e.date) return false;
    const d = e.date;
    return d >= '2025-05-11' && d <= '2025-05-17';
  }).length;
  // Today (May 17, 2025 is simulated as "Today" on the calendar)
  const todayCount = events.filter(e => e.date === '2025-05-17').length;

  // 2. Next Upcoming Event (If no selectedEvent or selectedEvent is completed, find the first upcoming one)
  const upcomingList = events
    .filter(e => e.status === 'Upcoming' || e.status === 'Ongoing')
    .sort((a, b) => a.date.localeCompare(b.date));
  
  const displayEvent = selectedEvent && (selectedEvent.status === 'Upcoming' || selectedEvent.status === 'Ongoing')
    ? selectedEvent
    : (upcomingList[0] || selectedEvent || events[0] || null);

  // 3. Format date to include day of week: "2025-05-17" -> "17 May 2025 (Saturday)"
  const formatFullDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const day = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${day} (${weekday})`;
      }
      return dateStr;
    } catch {
      return dateStr || '';
    }
  };

  // 4. Mini Calendar Grid for May 2025
  // May 1 2025 is Thursday. April has 30 days. April 27, 28, 29, 30 are Sunday-Wednesday.
  const calendarDays = [
    { day: 27, isCurrentMonth: false, dateStr: '2025-04-27' },
    { day: 28, isCurrentMonth: false, dateStr: '2025-04-28' },
    { day: 29, isCurrentMonth: false, dateStr: '2025-04-29' },
    { day: 30, isCurrentMonth: false, dateStr: '2025-04-30' },
    // May
    ...Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      dateStr: `2025-05-${String(i + 1).padStart(2, '0')}`
    }))
  ];

  // Find if date exists in events list to draw a dot
  const hasEvent = (dateStr: string) => {
    return events.some(e => e.date === dateStr);
  };

  // Get selected day index to highlight
  const getHighlightDay = () => {
    if (selectedEvent && selectedEvent.date) {
      return selectedEvent.date;
    }
    return '2025-05-17'; // default highlighted day
  };

  const highlightDateStr = getHighlightDay();

  // Export Events to PDF
  const handleExportPDF = async () => {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { color: #5B3DF5; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { bg-color: #f5f6fa; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Events Schedule</h1>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    events.forEach(e => {
      html += `
        <tr>
          <td><strong>${e.name}</strong><br/><small>${e.subtitle || ''}</small></td>
          <td>${e.type}</td>
          <td>${e.date}</td>
          <td>${e.time}</td>
          <td>${e.location}</td>
          <td>${e.attendees}</td>
          <td>${e.status}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const res = await apiService.printToPDF(html, 'church-events-schedule.pdf');
      if (res.success) {
        alert(`Events schedule successfully exported to PDF!`);
      } else {
        alert(`Export failed: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error exporting events list.');
    }
  };

  // Print schedule
  const handlePrint = async () => {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 30px; }
            h1 { text-align: center; color: #333; }
            .event-card { border-bottom: 1px solid #ccc; padding: 15px 0; }
            .title { font-size: 16px; font-weight: bold; }
            .meta { font-size: 13px; color: #666; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Kingdom Connect Church - Events Schedule</h1>
          <hr />
    `;

    events.forEach(e => {
      html += `
        <div class="event-card">
          <div class="title">${e.name} (${e.type})</div>
          <div class="meta"><strong>Date:</strong> ${e.date} | <strong>Time:</strong> ${e.time}</div>
          <div class="meta"><strong>Location:</strong> ${e.location} | <strong>Organizer:</strong> ${e.organizer}</div>
          ${e.description ? `<div class="meta"><strong>Description:</strong> ${e.description}</div>` : ''}
        </div>
      `;
    });

    html += `
        </body>
      </html>
    `;

    try {
      await apiService.printDirect(html);
    } catch (err) {
      console.error(err);
      alert('Print failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Event Calendar */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-gray-805">
            Event Calendar
          </h3>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-700 px-1">May 2025</span>
            <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((cDay, idx) => {
            const isHighlighted = cDay.dateStr === highlightDateStr;
            const hasEvt = hasEvent(cDay.dateStr);

            // Select calendar day callback
            const handleDayClick = () => {
              if (cDay.isCurrentMonth) {
                // Find first event on this day if any
                const dayEvent = events.find(e => e.date === cDay.dateStr);
                if (dayEvent) {
                  onSelectEvent(dayEvent);
                }
              }
            };

            return (
              <div
                key={idx}
                onClick={handleDayClick}
                className={`relative p-2 text-xs font-bold rounded-xl transition-all cursor-pointer select-none flex flex-col items-center justify-center h-8 w-8 mx-auto ${
                  !cDay.isCurrentMonth
                    ? 'text-gray-300 pointer-events-none'
                    : isHighlighted
                    ? 'bg-[#5B3DF5] text-white shadow-md shadow-[#5B3DF5]/25'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{cDay.day}</span>
                {/* Event indicator dot */}
                {hasEvt && !isHighlighted && (
                  <span className="absolute bottom-1.5 h-1 w-1 bg-[#5B3DF5] rounded-full"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 2: Upcoming Event Detail */}
      {displayEvent && (
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-gray-805">
              Upcoming Event
            </h3>
            <button
              type="button"
              onClick={() => onViewDetails?.(displayEvent)}
              className="text-xs font-bold text-[#5B3DF5] hover:text-[#4a30db]"
            >
              View Details
            </button>
          </div>

          <h4 className="font-extrabold text-base text-[#5B3DF5] leading-tight mb-0.5">
            {displayEvent.name}
          </h4>
          {displayEvent.subtitle && (
            <p className="text-[10px] text-gray-400 font-bold mb-4">
              {displayEvent.subtitle}
            </p>
          )}

          <div className="space-y-3 mt-4 text-xs font-semibold text-gray-650">
            <div className="flex gap-2.5 items-center">
              <Calendar size={14} className="text-gray-400" />
              <span>{formatFullDate(displayEvent.date)}</span>
            </div>
            <div className="flex gap-2.5 items-center">
              <Clock size={14} className="text-gray-400" />
              <span>{displayEvent.time}</span>
            </div>
            <div className="flex gap-2.5 items-center">
              <MapPin size={14} className="text-gray-400" />
              <span className="truncate" title={displayEvent.location}>
                {displayEvent.location}
              </span>
            </div>
            <div className="flex gap-2.5 items-center">
              <Users size={14} className="text-gray-400" />
              <span>{displayEvent.attendees} Registered</span>
            </div>
          </div>

          {displayEvent.description && (
            <p className="text-[11px] text-gray-450 mt-4 leading-relaxed line-clamp-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              {displayEvent.description}
            </p>
          )}

          <button
            type="button"
            onClick={() => onSelectEvent(displayEvent)}
            className="w-full mt-5 bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer"
          >
            Select in Table
          </button>
        </div>
      )}

      {/* Card 3: Event Overview Counts */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-gray-805 mb-4">
          Event Overview
        </h3>
        <div className="space-y-3 text-xs font-bold text-gray-600">
          <div className="flex justify-between items-center py-0.5">
            <span>Upcoming Events</span>
            <span className="font-extrabold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
              {upcomingCount}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>This Month</span>
            <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {thisMonthCount}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>This Week</span>
            <span className="font-extrabold text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
              {thisWeekCount}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Today</span>
            <span className="font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {todayCount}
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Quick Actions */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-gray-850 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-2xl py-2.5 flex justify-center items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
          >
            <Download size={14} className="text-gray-400" />
            Export Events
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full border border-gray-200 bg-white hover:bg-gray-55 hover:border-gray-300 text-gray-700 rounded-2xl py-2.5 flex justify-center items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
          >
            <Printer size={14} className="text-gray-400" />
            Print Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
