import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Building2, MapPin, Globe, Image as ImageIcon, CheckCircle, Smartphone } from 'lucide-react';
import { apiService } from '../../services/api';

export default function ChurchProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    church_name: '',
    pastor_name: '',
    year_established: '',
    about: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
  });

  const [visibility, setVisibility] = useState({
    show_email: true,
    show_phone: true,
    show_address: true,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // We need an apiService method for this, or use raw fetch. 
      // Assuming apiService.api exposes axios instance
      const res = await apiService.api.get('/settings/church-profile');
      const data = res.data.data;
      
      setFormData({
        church_name: data.church_name || '',
        pastor_name: data.pastor_name || '',
        year_established: data.year_established || '',
        about: data.about || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        twitter: data.twitter || '',
      });

      if (data.visibility_settings) {
        setVisibility({
          show_email: data.visibility_settings.show_email ?? true,
          show_phone: data.visibility_settings.show_phone ?? true,
          show_address: data.visibility_settings.show_address ?? true,
        });
      }

      if (data.logo) {
        // Construct full URL if needed, or use as is if backend returns full URL
        setLogoPreview(data.logo.startsWith('http') ? data.logo : `http://localhost:8000/storage/${data.logo}`);
      }
      if (data.cover_image) {
        setCoverPreview(data.cover_image.startsWith('http') ? data.cover_image : `http://localhost:8000/storage/${data.cover_image}`);
      }
    } catch (err) {
      console.error('Error fetching church profile:', err);
      setError('Failed to load church profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVisibilityChange = (key: string) => {
    setVisibility({ ...visibility, [key]: !visibility[key as keyof typeof visibility] });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(url);
      } else {
        setCoverFile(file);
        setCoverPreview(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value.toString());
      });
      
      // Append visibility settings as array elements or JSON
      Object.entries(visibility).forEach(([key, value]) => {
        fd.append(`visibility_settings[${key}]`, value ? '1' : '0');
      });

      if (logoFile) fd.append('logo', logoFile);
      if (coverFile) fd.append('cover_image', coverFile);

      await apiService.api.post('/settings/church-profile', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Church profile updated successfully! The Mobile App will reflect these changes immediately.');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save church profile. Please check your inputs and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B3DF5]"></div>
      </div>
    );
  }

  return (
    <div className="pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Church Profile</h1>
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-2">
          <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
          <ChevronRight size={12} />
          <span className="text-[#5B3DF5]">Church Profile</span>
        </nav>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl flex items-center border border-green-200">
          <CheckCircle className="mr-3" size={20} />
          <span className="font-semibold text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-center border border-red-200">
          <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="text-[#5B3DF5]" size={20} />
              <h2 className="text-lg font-black text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Church Name</label>
                <input type="text" name="church_name" value={formData.church_name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Senior Pastor Name</label>
                <input type="text" name="pastor_name" value={formData.pastor_name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Year Established</label>
              <input type="number" name="year_established" value={formData.year_established} onChange={handleInputChange} className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">About / Description</label>
              <textarea name="about" value={formData.about} onChange={handleInputChange} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" placeholder="Write a short description about the church that will appear on the Mobile App..."></textarea>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="text-[#5B3DF5]" size={20} />
              <h2 className="text-lg font-black text-gray-900">Contact & Location</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all"></textarea>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="text-[#5B3DF5]" size={20} />
              <h2 className="text-lg font-black text-gray-900">Online Presence</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
                <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Instagram URL</label>
                <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">YouTube Channel URL</label>
                <input type="url" name="youtube" value={formData.youtube} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all" placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="bg-[#5B3DF5] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#4a30db] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#5B3DF5]/20">
              <Save size={18} />
              {saving ? 'Saving Profile...' : 'Save Church Profile'}
            </button>
          </div>
        </div>

        {/* Right Column: Images & App Settings */}
        <div className="space-y-6">
          
          {/* Images */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-[#5B3DF5]" size={20} />
              <h2 className="text-lg font-black text-gray-900">Church Branding</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-2">Church Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={24} />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" id="logo-upload" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
                  <label htmlFor="logo-upload" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer transition-colors block text-center mb-1">
                    Choose Logo
                  </label>
                  <p className="text-[10px] text-gray-400 font-semibold">Square image recommended</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Cover Image (Mobile App Header)</label>
              <div className="w-full h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-3">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="text-gray-300 mx-auto mb-1" size={24} />
                    <span className="text-[10px] text-gray-400 font-semibold">16:9 Landscape Image</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" id="cover-upload" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
              <label htmlFor="cover-upload" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer transition-colors block text-center">
                Upload Cover Image
              </label>
            </div>
          </div>

          {/* Mobile App Settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="text-[#5B3DF5]" size={20} />
              <h2 className="text-lg font-black text-gray-900">Mobile App Display</h2>
            </div>
            <p className="text-xs text-gray-500 font-semibold mb-5 leading-relaxed">
              Control what contact information is visible to your members on the mobile app.
            </p>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-gray-900">Show Email Address</span>
                  <span className="block text-[11px] text-gray-500 font-semibold mt-0.5">Display church email publicly</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${visibility.show_email ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <input type="checkbox" className="hidden" checked={visibility.show_email} onChange={() => handleVisibilityChange('show_email')} />
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${visibility.show_email ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-gray-900">Show Phone Number</span>
                  <span className="block text-[11px] text-gray-500 font-semibold mt-0.5">Allow members to call via app</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${visibility.show_phone ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <input type="checkbox" className="hidden" checked={visibility.show_phone} onChange={() => handleVisibilityChange('show_phone')} />
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${visibility.show_phone ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="block text-sm font-bold text-gray-900">Show Physical Address</span>
                  <span className="block text-[11px] text-gray-500 font-semibold mt-0.5">Display church location</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${visibility.show_address ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <input type="checkbox" className="hidden" checked={visibility.show_address} onChange={() => handleVisibilityChange('show_address')} />
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${visibility.show_address ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
