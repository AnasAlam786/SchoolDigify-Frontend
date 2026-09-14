import { useState, useEffect, useCallback } from 'react';
import EditSchoolModal from './EditSchoolModal.jsx';
import { SchoolSetupSkeleton, SchoolSetupError } from '../components/PageStatus.jsx';
import { apiGet } from '../../../api/api.js';
import {
    Building2, MapPin, Phone, Mail, UserRound,
    Image as ImageIcon, School, Pencil, Smartphone,
    Shield, CheckCircle2, AlertCircle, BadgeInfo
} from 'lucide-react';

const EMPTY_SCHOOL_DATA = {
    id: '', school_name: '', address: '', logo: '',
    udise: '', phone: '', whatsapp: '', email: '',
    manager: '', school_heading_image: '',
};

function ImageCard({ title, imageUrl, fallbackLabel }) {
    const isValidUrl = Boolean(
        imageUrl && (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith('/'))
    );

    return (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-4">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    <ImageIcon className="h-4 w-4 text-indigo-400" />
                    {title}
                </div>
            </div>

            {isValidUrl ? (
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                    <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
                </div>
            ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-zinc-900/30 text-center">
                    <ImageIcon className="h-8 w-8 text-zinc-600" />
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        {fallbackLabel}
                    </span>
                </div>
            )}
        </div>
    );
}

function InfoBlock({ label, value, icon }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition hover:border-white/10 hover:bg-zinc-900/80">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                {icon}
                {label}
            </div>
            <div className="text-sm font-semibold leading-6 text-zinc-100 sm:text-[15px] break-words">
                {value || '—'}
            </div>
        </div>
    );
}

function SchoolDataSection() {
    const [schoolData, setSchoolData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadError, setLoadError] = useState('');

    const loadSchoolData = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            const response = await apiGet('/api/school_data_api_bp');
            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.error || 'Unable to fetch school data');
            }
            setSchoolData({ ...EMPTY_SCHOOL_DATA, ...(payload.school_data || {}) });
        } catch (error) {
            setLoadError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSchoolData();
    }, [loadSchoolData]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    const handleUpdateSuccess = (updatedData) => {
        setSchoolData((prev) => ({ ...prev, ...updatedData }));
        setIsModalOpen(false);
        showToast('success', 'School details updated successfully!');
    };

    if (isLoading) return <SchoolSetupSkeleton />;

    if (loadError) {
        return (
            <SchoolSetupError
                loadSchoolData={loadSchoolData}
                loadError={loadError}
            />
        );
    }

    return (
        <div className="min-h-screen text-zinc-100">
            <div className="mx-auto max-w-6xl mt-4">
                {/* Header Section */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                            <School className="h-4 w-4" />
                            School Administration
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">School Setup</h1>
                        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                            Manage your school's basic information and branding.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#111010]"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Information
                    </button>
                </div>

                {/* Info Grid Container */}
                <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#181818] shadow-2xl">
                    <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 px-6 py-5 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold tracking-wide sm:text-xl">School Information</h2>
                            <div className="flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-300 backdrop-blur">
                                <Building2 className="h-4 w-4" />
                                School Details
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 p-6 md:grid-cols-12 md:p-8">
                        <div className="md:col-span-7">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InfoBlock label="School Name" value={schoolData?.school_name} icon={<Building2 className="h-4 w-4 text-indigo-400" />} />
                                <InfoBlock label="UDISE Code" value={schoolData?.udise} icon={<Shield className="h-4 w-4 text-indigo-400" />} />

                                <div className="sm:col-span-2">
                                    <InfoBlock label="Address" value={schoolData?.address} icon={<MapPin className="h-4 w-4 text-indigo-400" />} />
                                </div>

                                <InfoBlock label="Phone" value={schoolData?.phone} icon={<Phone className="h-4 w-4 text-indigo-400" />} />
                                <InfoBlock label="WhatsApp" value={schoolData?.whatsapp} icon={<Smartphone className="h-4 w-4 text-indigo-400" />} />

                                <InfoBlock label="Email" value={schoolData?.email} icon={<Mail className="h-4 w-4 text-indigo-400" />} />
                                <InfoBlock label="Manager" value={schoolData?.manager} icon={<UserRound className="h-4 w-4 text-indigo-400" />} />
                            </div>
                        </div>

                        <div className="md:col-span-5">
                            <div className="grid gap-4">
                                <ImageCard
                                    title="School Logo"
                                    imageUrl={schoolData?.logo}
                                    fallbackLabel="No Logo Provided"
                                />
                                <ImageCard
                                    title="School Heading Image"
                                    imageUrl={schoolData?.school_heading_image}
                                    fallbackLabel="No Heading Image"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Edit Form Modal */}
            {isModalOpen && (
                <EditSchoolModal
                    initialData={schoolData}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleUpdateSuccess}
                    onError={(msg) => showToast('error', msg)}
                />
            )}

            {/* Feedback Toast */}
            {toast && (
                <div className="fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border border-white/10 bg-[#181818] p-4 text-white shadow-2xl backdrop-blur-lg">
                    <div className="flex items-start gap-3">
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        ) : (
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {toast.type === 'success' ? 'Success' : 'Error'}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-400">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SchoolDataSection;