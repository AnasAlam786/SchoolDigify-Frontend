import { useState, useMemo, useEffect } from 'react';
import {
  Building2, MapPin, Phone, Mail, UserRound, Image, X,
  School, Save, Loader2, Smartphone, Globe2, Shield, AlertCircle,
} from 'lucide-react';

import { apiPut } from '../../../api/api.js';

function EditSchoolModal({ initialData = {}, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    school_name: '',
    address: '',
    udise: '',
    phone: '',
    whatsapp: '',
    email: '',
    manager: '',
    logo: '',
    school_heading_image: '',
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const fieldDefinitions = useMemo(
    () => [
      { key: 'school_name', label: 'School Name', type: 'text', icon: <Building2 className="h-4 w-4" /> },
      { key: 'address', label: 'Address', type: 'textarea', icon: <MapPin className="h-4 w-4" /> },
      { key: 'udise', label: 'UDISE Code', type: 'text', icon: <Shield className="h-4 w-4" /> },
      { key: 'phone', label: 'Phone', type: 'tel', icon: <Phone className="h-4 w-4" /> },
      { key: 'whatsapp', label: 'WhatsApp', type: 'tel', icon: <Smartphone className="h-4 w-4" /> },
      { key: 'email', label: 'Email', type: 'email', icon: <Mail className="h-4 w-4" /> },
      { key: 'manager', label: 'Manager', type: 'text', icon: <UserRound className="h-4 w-4" /> },
      { key: 'logo', label: 'School Logo URL', type: 'url', icon: <Image className="h-4 w-4" /> },
      { key: 'school_heading_image', label: 'School Heading Image URL', type: 'url', icon: <Globe2 className="h-4 w-4" /> },
    ],
    []
  );

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validateForm() {
    const errors = {};

    if (!String(formData.school_name || '').trim()) {
      errors.school_name = 'School name is required.';
    }

    if (!String(formData.address || '').trim()) {
      errors.address = 'Address is required.';
    }

    if (!String(formData.udise || '').trim()) {
      errors.udise = 'UDISE code is required.';
    }

    if (!String(formData.phone || '').trim()) {
      errors.phone = 'Phone is required.';
    }

    if (!String(formData.whatsapp || '').trim()) {
      errors.whatsapp = 'WhatsApp number is required.';
    }

    if (!String(formData.email || '').trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!String(formData.manager || '').trim()) {
      errors.manager = 'Manager name is required.';
    }

    return errors;
  }

  async function handleSave(event) {
    event.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);

    const payload = {
      school_name: formData.school_name,
      address: formData.address,
      logo: formData.logo,
      udise: formData.udise,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      manager: formData.manager,
      school_heading_image: formData.school_heading_image,
    };

    try {
      const response = await apiPut('/api/update_school_data', payload);
      const data = await response.json();
  
      if (!response.ok) {
        let errorMessage = data.error || 'Unable to update school details.';

        setFormErrors({ submit: errorMessage });
        onError?.(errorMessage);
        return;
      }

      onSuccess?.(payload);
    } catch {
      const msg = 'Unable to update school details. Please try again later.';
      setFormErrors({ submit: msg });
      onError?.(msg);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="school-setup-modal-title"
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#181818] text-zinc-100 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              <School className="h-4 w-4" />
              School Detail Editor
            </div>
            <h2 id="school-setup-modal-title" className="mt-1 text-2xl font-bold text-white">
              Edit School Information
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="max-h-[calc(92vh-140px)] overflow-y-auto">
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            {fieldDefinitions.map((field) => (
              <div
                key={field.key}
                className={field.key === 'address' || field.key === 'school_heading_image' ? 'sm:col-span-2' : ''}
              >
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                  <span className="text-indigo-400">{field.icon}</span>
                  {field.label}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleFieldChange}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={handleFieldChange}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                )}

                {formErrors[field.key] && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
                    <AlertCircle className="h-3 w-3 inline" />
                    {formErrors[field.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {formErrors.submit && (
            <div className="mx-6 mt-1 flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formErrors.submit}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 px-6 py-4 bg-zinc-900/40">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSchoolModal;