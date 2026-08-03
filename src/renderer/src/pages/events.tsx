import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { EventMock } from '../services/mockData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import EventStats from '../components/events/EventStats';
import EventFilters from '../components/events/EventFilters';
import EventsTable from '../components/events/EventsTable';
import EventsSidebar from '../components/events/EventsSidebar';
import CategoriesPagination from '../components/finance/categories/CategoriesPagination';
import EventAttendanceModal from '../components/events/EventAttendanceModal';

export default function EventsPage() {
  const { currentTenant } = useApp();
  const queryClient = useQueryClient();

  // Selection
  const [selectedEvent, setSelectedEvent] = useState<EventMock | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');

  // Attendance Modal
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formType, setFormType] = useState<EventMock['type']>('Worship');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formAttendees, setFormAttendees] = useState(0);
  const [formMaxCapacity, setFormMaxCapacity] = useState(100);
  const [formStatus, setFormStatus] = useState<EventMock['status']>('Upcoming');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const { data: events = [], isLoading: loading } = useQuery({
    queryKey: ['events', currentTenant?.id],
    queryFn: () => currentTenant ? apiService.getEvents(currentTenant.id) : Promise.resolve([]),
    enabled: !!currentTenant,
  });

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      const upcoming = events.find(e => e.status === 'Upcoming' || e.status === 'Ongoing');
      setSelectedEvent(upcoming || events[0]);
    }
  }, [events]);

  const saveEventMutation = useMutation({
    mutationFn: (eventData: EventMock) => apiService.saveEvent(eventData),
    onSuccess: (data, variables) => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // We optimistically select the edited/added event by updating local state, but we don't have the full object if it's not returned.
      // In this app, we just let it refresh and the selectedEvent might stay the same by ID if it exists.
    }
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteEvent(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      if (selectedEvent?.id === deletedId) {
        setSelectedEvent(null); // will be selected by the effect if there are others
      }
    }
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subtitle && e.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || e.date === dateFilter;
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

    return matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  // Sort: Upcoming/Ongoing first, then sort by Date descending
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Upcoming/Ongoing events sort to the top, Completed/Cancelled go below
    const getOrder = (status: EventMock['status']) => {
      if (status === 'Ongoing') return 0;
      if (status === 'Upcoming') return 1;
      return 2;
    };
    const orderDiff = getOrder(a.status) - getOrder(b.status);
    if (orderDiff !== 0) return orderDiff;
    return b.date.localeCompare(a.date);
  });

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / pageSize));
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sync selected details pane on filter or list change
  useEffect(() => {
    if (paginatedEvents.length > 0) {
      const isStillVisible = paginatedEvents.some(e => e.id === selectedEvent?.id);
      if (!isStillVisible) {
        setSelectedEvent(paginatedEvents[0]);
      }
    } else {
      setSelectedEvent(null);
    }
  }, [searchTerm, dateFilter, typeFilter, statusFilter, currentPage, events]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormName('');
    setFormSubtitle('');
    setFormType('Worship');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('8:00 AM - 10:00 AM');
    setFormLocation('');
    setFormAttendees(0);
    setFormMaxCapacity(100);
    setFormStatus('Upcoming');
    setFormOrganizer('Pastor John');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: EventMock) => {
    setModalMode('edit');
    setEditId(evt.id);
    setFormName(evt.name);
    setFormSubtitle(evt.subtitle || '');
    setFormType(evt.type);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLocation(evt.location);
    setFormAttendees(evt.attendees);
    setFormMaxCapacity(evt.maxCapacity);
    setFormStatus(evt.status);
    setFormOrganizer(evt.organizer);
    setFormDescription(evt.description || '');
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (evt: EventMock) => {
    if (!currentTenant) return;
    if (confirm(`Are you sure you want to delete this event: "${evt.name}"?`)) {
      deleteEventMutation.mutate(evt.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formName.trim()) {
      alert('Please enter an event name.');
      return;
    }
    if (!formLocation.trim()) {
      alert('Please enter an event location.');
      return;
    }

    let eventId = '';
    if (modalMode === 'add') {
      const pattern = /^EVT-2025-(\d+)$/;
      let maxNum = 0;
      events.forEach(item => {
        const match = item.id.match(pattern);
        if (match) {
          const num = parseInt(match[1]);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = (maxNum + 1).toString().padStart(4, '0');
      eventId = `EVT-2025-${nextNum}`;
    } else {
      eventId = editId;
    }

    const eventData: EventMock = {
      id: eventId,
      name: formName.trim(),
      subtitle: formSubtitle.trim() || undefined,
      type: formType,
      date: formDate || new Date().toISOString().split('T')[0],
      time: formTime.trim() || '8:00 AM - 10:00 AM',
      location: formLocation.trim(),
      attendees: Number(formAttendees),
      maxCapacity: Number(formMaxCapacity),
      status: formStatus,
      organizer: formOrganizer.trim() || 'Pastor John',
      description: formDescription.trim() || undefined,
      tenantId: currentTenant.id,
      createdOn: modalMode === 'add' ? new Date().toISOString().split('T')[0] : events.find(item => item.id === editId)?.createdOn || new Date().toISOString().split('T')[0]
    };

    saveEventMutation.mutate(eventData, {
      onSuccess: () => {
        setSelectedEvent(eventData);
      }
    });
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Events
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Events</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Create New Event
        </button>
      </div>

      {/* Stats Cards */}
      <EventStats events={events} />

      {/* Filters Panel */}
      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => { setDateFilter(val); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Table & Pagination Column */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading events...</p>
            </div>
          ) : (
            <>
              <EventsTable
                events={paginatedEvents}
                selectedEvent={selectedEvent}
                onSelectEvent={setSelectedEvent}
                onEditEvent={handleOpenEditModal}
                onDeleteEvent={handleDeleteEvent}
              />
              <CategoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalCategoriesCount={sortedEvents.length}
                itemName="events"
              />
            </>
          )}
        </div>

        {/* Sidebar Inspector Column */}
        <div className="lg:col-span-3">
          <EventsSidebar
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
            onTrackAttendance={() => setIsAttendanceModalOpen(true)}
          />
        </div>
      </div>

      {isAttendanceModalOpen && selectedEvent && (
        <EventAttendanceModal 
          event={selectedEvent} 
          onClose={() => setIsAttendanceModalOpen(false)} 
        />
      )}

      {/* Add / Edit Event Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-lg bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {modalMode === 'add' ? 'Create New Event' : 'Edit Event'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Event Name */}
              <div className="space-y-1.5">
                <label htmlFor="evt-name" className="text-xs font-bold text-gray-400 uppercase">
                  Event Name / Title
                </label>
                <input
                  id="evt-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sunday Worship Service"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label htmlFor="evt-subtitle" className="text-xs font-bold text-gray-400 uppercase">
                  Subtitle / Description Summary
                </label>
                <input
                  id="evt-subtitle"
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. Weekly Worship or Special Sunday Service"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-type" className="text-xs font-bold text-gray-400 uppercase">
                    Event Type
                  </label>
                  <select
                    id="evt-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EventMock['type'])}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Youth">Youth Fellowship</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Special Service">Special Service</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Education">Education</option>
                    <option value="Special Event">Special Event</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Training">Training</option>
                    <option value="Baptism">Baptism</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-status" className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    id="evt-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EventMock['status'])}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-date" className="text-xs font-bold text-gray-400 uppercase">
                    Event Date
                  </label>
                  <input
                    id="evt-date"
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-750 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-time" className="text-xs font-bold text-gray-400 uppercase">
                    Time Range
                  </label>
                  <input
                    id="evt-time"
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 8:00 AM - 10:00 AM"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location and Organizer */}
              <div className="grid grid-cols-2 gap-4">
                {/* Location */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-location" className="text-xs font-bold text-gray-400 uppercase">
                    Location / Venue
                  </label>
                  <input
                    id="evt-location"
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Main Sanctuary"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                {/* Organizer */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-organizer" className="text-xs font-bold text-gray-400 uppercase">
                    Organizer Name
                  </label>
                  <input
                    id="evt-organizer"
                    type="text"
                    required
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    placeholder="e.g. Pastor John"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>
              </div>

              {/* Attendees and Max Capacity */}
              <div className="grid grid-cols-2 gap-4">
                {/* Attendees */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-attendees" className="text-xs font-bold text-gray-400 uppercase">
                    Attendees / Registered
                  </label>
                  <input
                    id="evt-attendees"
                    type="number"
                    min="0"
                    required
                    value={formAttendees}
                    onChange={(e) => setFormAttendees(Number(e.target.value))}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                {/* Max Capacity */}
                <div className="space-y-1.5">
                  <label htmlFor="evt-capacity" className="text-xs font-bold text-gray-400 uppercase">
                    Maximum Capacity
                  </label>
                  <input
                    id="evt-capacity"
                    type="number"
                    min="1"
                    required
                    value={formMaxCapacity}
                    onChange={(e) => setFormMaxCapacity(Number(e.target.value))}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="evt-desc" className="text-xs font-bold text-gray-400 uppercase">
                  Detailed Description
                </label>
                <textarea
                  id="evt-desc"
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Write a brief overview of the event..."
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveEventMutation.isPending}
                  className="rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {saveEventMutation.isPending ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                  {modalMode === 'add' ? 'Create Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
