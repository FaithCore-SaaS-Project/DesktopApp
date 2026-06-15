import React from 'react';
import EventRow from './EventRow';
import { EventMock } from '../../services/mockData';
import { Calendar } from 'lucide-react';

interface EventsTableProps {
  events: EventMock[];
  selectedEvent: EventMock | null;
  onSelectEvent: (evt: EventMock) => void;
  onEditEvent: (evt: EventMock) => void;
  onDeleteEvent: (evt: EventMock) => void;
}

export default function EventsTable({
  events,
  selectedEvent,
  onSelectEvent,
  onEditEvent,
  onDeleteEvent
}: EventsTableProps) {
  return (
    <div className="bg-white border border-gray-150 rounded-t-3xl overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white pl-6">
        <h2 className="text-lg font-bold text-gray-900">
          All Events
        </h2>
        <span className="bg-[#5B3DF5]/10 text-[#5B3DF5] px-2.5 py-1 rounded-full text-xs font-bold mr-2">
          {events.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="p-4 pl-6 font-bold text-left">Event Name</th>
              <th className="p-4 font-bold text-left">Type</th>
              <th className="p-4 font-bold text-left">Date & Time</th>
              <th className="p-4 font-bold text-left">Location</th>
              <th className="p-4 font-bold text-left">Attendees</th>
              <th className="p-4 font-bold text-left">Status</th>
              <th className="p-4 pr-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {events.length > 0 ? (
              events.map((item) => (
                <EventRow
                  key={item.id}
                  item={item}
                  isSelected={selectedEvent?.id === item.id}
                  onSelect={() => onSelectEvent(item)}
                  onEdit={() => onEditEvent(item)}
                  onDelete={() => onDeleteEvent(item)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-440">
                    <Calendar size={40} className="mb-3 opacity-60 text-slate-400" />
                    <p className="text-sm font-bold">No events found</p>
                    <p className="text-xs text-gray-440 mt-1 font-semibold">Try resetting the filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
