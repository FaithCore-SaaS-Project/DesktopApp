import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';
import { api, isElectron } from '../../services/api';

const STATUS_OPTIONS = ['active', 'inactive', 'transferred', 'deceased'];

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '', gender: 'male',
  nic: '', address_type: 'permanent', permanent_address: '', postal_address: '',
  dob: '', status: 'active', occupation: '', family_id: '',
  is_baptized: false, baptism_date: '', baptism_church: '', baptism_partner_name: '',
  marital_status: 'single', marriage_date: ''
};

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: any | null;
  families: any[];
  onSuccess: () => void;
}

export default function MemberFormModal({ isOpen, onClose, editingMember, families, onSuccess }: MemberFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [baptismCertFile, setBaptismCertFile] = useState<File | null>(null);
  const [marriageCertFile, setMarriageCertFile] = useState<File | null>(null);
  const [birthCertFile, setBirthCertFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (editingMember) {
      setForm({
        first_name: editingMember.first_name || '',
        last_name: editingMember.last_name || '',
        email: editingMember.email || '',
        phone: editingMember.phone || '',
        gender: editingMember.gender || 'male',
        nic: editingMember.nic || '',
        address_type: editingMember.address_type || 'permanent',
        permanent_address: editingMember.permanent_address || '',
        postal_address: editingMember.postal_address || '',
        dob: editingMember.dob || '',
        status: editingMember.status || 'active',
        occupation: editingMember.occupation || '',
        family_id: editingMember.family_id || '',
        is_baptized: editingMember.is_baptized || false,
        baptism_date: editingMember.baptism_date || '',
        baptism_church: editingMember.baptism_church || '',
        baptism_partner_name: editingMember.baptism_partner_name || '',
        marital_status: editingMember.marital_status || 'single',
        marriage_date: editingMember.marriage_date || ''
      });
    } else {
      setForm(emptyForm);
    }
    setPhotoFile(null);
    setBaptismCertFile(null);
    setMarriageCertFile(null);
    setBirthCertFile(null);
    setErrors({});
    setServerError('');
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      // Omit empty strings so Laravel nullable rules (dates, foreign keys, integers) pass cleanly
      if (value !== '' && value !== null && value !== undefined) {
        formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : (value as string));
      }
    });

    if (photoFile) formData.append('photo', photoFile);
    if (baptismCertFile) formData.append('baptism_certificate', baptismCertFile);
    if (marriageCertFile) formData.append('marriage_certificate', marriageCertFile);
    if (birthCertFile) formData.append('birth_certificate', birthCertFile);

    try {
      const requestConfig = {
        headers: { 'Content-Type': undefined }
      };

      if (editingMember) {
        formData.append('_method', 'PUT');
        await api.post(`/members/${editingMember.id}`, formData, requestConfig);
      } else {
        await api.post('/members', formData, requestConfig);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Member form submission error:', err);
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors ?? {};
        setErrors(validationErrors);
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey) {
          const fieldName = firstErrorKey.replace(/_/g, ' ');
          setServerError(`${fieldName}: ${validationErrors[firstErrorKey][0]}`);
        } else {
          setServerError(err.response?.data?.message ?? 'Validation error. Please check form fields.');
        }
      } else {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'An unexpected error occurred.';
        setServerError(msg);

        // Offline / Electron local SQLite fallback
        if (isElectron() && !err.response) {
          try {
            const tenantId = localStorage.getItem('tenantId') || '1';
            await (window as any).electronAPI.saveMember({
              id: editingMember ? editingMember.id.toString() : 'MEM-' + Date.now(),
              name: `${form.first_name} ${form.last_name}`,
              email: form.email,
              phone: form.phone,
              role: form.occupation,
              joinedDate: new Date().toISOString().split('T')[0],
              status: form.status === 'active' ? 'active' : 'inactive',
              tenantId: tenantId,
              syncStatus: 'pending'
            });
            onSuccess();
            onClose();
            return;
          } catch (e) {
            console.error('Local fallback save failed:', e);
          }
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldErr = (field: string) => errors[field]?.[0];

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="my-auto w-full max-w-lg bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {editingMember ? 'Update Member Profile' : 'Register New Member'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {editingMember ? 'Changes are saved directly to the live database.' : 'A unique Member Number will be auto-generated.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Server-level error */}
          {serverError && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Photo Upload & Family Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Profile Photo</label>
              <label className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#5B3DF5] hover:bg-gray-50/50 rounded-xl px-4 py-2 cursor-pointer transition-colors group">
                <div className="h-8 w-8 rounded-lg bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#5B3DF5]">
                  {photoFile ? <ImageIcon className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-700 truncate">{photoFile ? photoFile.name : 'Upload Photo'}</p>
                  <p className="text-[9px] text-gray-400">JPG, PNG (Max 5MB)</p>
                </div>
                <input
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Assign to Family</label>
              <select
                name="family_id" value={form.family_id} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-3 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="">-- No Family (Individual) --</option>
                {families.map(f => (
                  <option key={f.id} value={f.id}>{f.family_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* First Name / Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">First Name <span className="text-red-500">*</span></label>
              <input
                name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                placeholder="e.g. John"
                className={`w-full bg-gray-50 border ${fieldErr('first_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
              />
              {fieldErr('first_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('first_name')}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Last Name <span className="text-red-500">*</span></label>
              <input
                name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                placeholder="e.g. Perera"
                className={`w-full bg-gray-50 border ${fieldErr('last_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
              />
              {fieldErr('last_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('last_name')}</p>}
            </div>
          </div>

          {/* Email / Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Email Address</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="e.g. john@example.com"
                className={`w-full bg-gray-50 border ${fieldErr('email') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
              />
              {fieldErr('email') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('email')}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Phone Number</label>
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="e.g. +94 71 234 5678"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Gender / NIC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Gender <span className="text-red-500">*</span></label>
              <select
                name="gender" value={form.gender} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">NIC Number</label>
              <input
                name="nic" type="text" value={form.nic} onChange={handleChange}
                placeholder="e.g. 199012345678 or 901234567V"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Date of Birth / Birth Certificate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Date of Birth</label>
              <input
                name="dob" type="date" value={form.dob} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Birth Certificate</label>
              <label className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#5B3DF5] hover:bg-gray-50/50 rounded-xl px-4 py-2.5 cursor-pointer transition-colors group">
                <div className="h-8 w-8 rounded-lg bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#5B3DF5]">
                  {birthCertFile ? <FileText className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-700 truncate">{birthCertFile ? birthCertFile.name : 'Upload File'}</p>
                  <p className="text-[9px] text-gray-400">PDF, JPG, PNG (5MB)</p>
                </div>
                <input
                  type="file" className="hidden"
                  onChange={(e) => setBirthCertFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>
          </div>

          {/* Status / Occupation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Standing Status</label>
              <select
                name="status" value={form.status} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Occupation</label>
              <input
                name="occupation" type="text" value={form.occupation} onChange={handleChange}
                placeholder="e.g. Software Engineer"
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Address Details (Permanent / Postal / Both) */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <label className="text-xs font-bold text-gray-500 block mb-1">Address Details</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="radio"
                  name="address_type"
                  value="permanent"
                  checked={form.address_type === 'permanent'}
                  onChange={handleChange}
                  className="text-[#5B3DF5] focus:ring-[#5B3DF5]"
                />
                <span>Permanent Address</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="radio"
                  name="address_type"
                  value="postal"
                  checked={form.address_type === 'postal'}
                  onChange={handleChange}
                  className="text-[#5B3DF5] focus:ring-[#5B3DF5]"
                />
                <span>Postal Address</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="radio"
                  name="address_type"
                  value="both"
                  checked={form.address_type === 'both'}
                  onChange={handleChange}
                  className="text-[#5B3DF5] focus:ring-[#5B3DF5]"
                />
                <span>Both Addresses</span>
              </label>
            </div>

            {(form.address_type === 'permanent' || form.address_type === 'both') && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Permanent Address</label>
                <textarea
                  name="permanent_address" value={form.permanent_address} onChange={handleChange}
                  rows={2}
                  placeholder="Street, City, Country"
                  className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400 resize-none"
                />
              </div>
            )}

            {(form.address_type === 'postal' || form.address_type === 'both') && (
              <div className="space-y-1 mt-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase">Postal Address</label>
                <textarea
                  name="postal_address" value={form.postal_address} onChange={handleChange}
                  rows={2}
                  placeholder="Street, City, Country"
                  className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400 resize-none"
                />
              </div>
            )}
          </div>

          {/* Holy Baptism Status (Yes / No) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500">Holy Baptism Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="radio"
                    name="is_baptized"
                    value="true"
                    checked={form.is_baptized === true}
                    onChange={() => setForm(prev => ({ ...prev, is_baptized: true }))}
                    className="text-[#5B3DF5] focus:ring-[#5B3DF5]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="radio"
                    name="is_baptized"
                    value="false"
                    checked={form.is_baptized === false}
                    onChange={() => setForm(prev => ({ ...prev, is_baptized: false }))}
                    className="text-[#5B3DF5] focus:ring-[#5B3DF5]"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {form.is_baptized && (
              <div className="space-y-3 pt-3 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Baptism Church</label>
                    <input
                      name="baptism_church" type="text" value={form.baptism_church} onChange={handleChange}
                      placeholder="e.g. Grace Fellowship"
                      className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Partner Pastor Name</label>
                    <input
                      name="baptism_partner_name" type="text" value={form.baptism_partner_name} onChange={handleChange}
                      placeholder="e.g. Rev. Miller"
                      className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Baptism Date</label>
                    <input
                      name="baptism_date" type="date" value={form.baptism_date} onChange={handleChange}
                      className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2 text-xs text-gray-900 font-semibold focus:outline-none min-h-[38px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Baptism Certificate</label>
                    <label className="flex items-center gap-2 border border-dashed border-gray-300 hover:border-[#5B3DF5] hover:bg-gray-50/50 rounded-xl px-3 py-2 cursor-pointer transition-colors group">
                      <div className="h-6 w-6 rounded bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#5B3DF5]">
                        {baptismCertFile ? <FileText className="h-3 w-3" /> : <UploadCloud className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[9px] font-bold text-gray-700 truncate">{baptismCertFile ? baptismCertFile.name : 'Upload File'}</p>
                      </div>
                      <input
                        type="file" className="hidden"
                        onChange={(e) => setBaptismCertFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Marital Status (Single / Married) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500">Marital Status</label>
              <select
                name="marital_status" value={form.marital_status} onChange={handleChange}
                className="bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-1.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="single">Single / Unmarried</option>
                <option value="married">Married</option>
              </select>
            </div>

            {form.marital_status === 'married' && (
              <div className="space-y-3 pt-3 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Marriage Date</label>
                    <input
                      name="marriage_date" type="date" value={form.marriage_date} onChange={handleChange}
                      className="w-full bg-white border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2 text-xs text-gray-900 font-semibold focus:outline-none min-h-[38px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Marriage Certificate</label>
                    <label className="flex items-center gap-2 border border-dashed border-gray-300 hover:border-[#5B3DF5] hover:bg-gray-50/50 rounded-xl px-3 py-2 cursor-pointer transition-colors group">
                      <div className="h-6 w-6 rounded bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#5B3DF5]">
                        {marriageCertFile ? <FileText className="h-3 w-3" /> : <UploadCloud className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[9px] font-bold text-gray-700 truncate">{marriageCertFile ? marriageCertFile.name : 'Upload File'}</p>
                      </div>
                      <input
                        type="file" className="hidden"
                        onChange={(e) => setMarriageCertFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2"
            >
              {submitting ? (
                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : null}
              {editingMember ? 'Save Changes' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
