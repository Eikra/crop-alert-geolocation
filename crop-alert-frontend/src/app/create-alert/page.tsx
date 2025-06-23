"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth-api';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/lib/auth-guard';
import { RoleGuard } from '@/lib/RoleGuard';

export default function CreateAlertPage() {
    const router = useRouter();
    const { user } = useAuth();

    const DEFAULT_LAT = 48.8566;
    const DEFAULT_LNG = 2.3522;

    const [form, setForm] = useState({
        title: '',
        description: '',
        location: [DEFAULT_LNG, DEFAULT_LAT],
        crops: ['corn'],
        severity: 'MEDIUM',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm(prev => ({
                    ...prev,
                    location: [
                        position.coords.longitude,
                        position.coords.latitude
                    ]
                }));
            },
            () => {
                console.warn("Geolocation denied, using default location");
            }
        );
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await authApi.post('/alerts', form);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create alert');
        }
    };

    if (!user) {
        return <div className="p-8 text-center font-bold text-gray-600">Loading...</div>;
    }

    if (user?.role !== 'AGRONOMIST') {
        return <div className="p-8 text-red-500 font-bold">Access Denied (Agronomists only)</div>;
    }

    return (
        <AuthGuard>
            <RoleGuard role="AGRONOMIST">
                <div className="p-8 max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">🚜 Create New Crop Alert</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input className="w-full border p-3 rounded" placeholder="Alert Title (ex: Pest infestation)"
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

                        <textarea className="w-full border p-3 rounded" placeholder="Detailed Description (what's happening)"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                        <div className="flex flex-col md:flex-row gap-2">
                            <input className="border p-3 rounded w-full" placeholder="Latitude (ex: 48.8566)"
                                value={form.location[1]} type="number"
                                onChange={e => setForm({ ...form, location: [form.location[0], parseFloat(e.target.value)] })} />

                            <input className="border p-3 rounded w-full" placeholder="Longitude (ex: 2.3522)"
                                value={form.location[0]} type="number"
                                onChange={e => setForm({ ...form, location: [parseFloat(e.target.value), form.location[1]] })} />
                        </div>

                        <input className="w-full border p-3 rounded" placeholder="Crops (comma separated, e.g. wheat, corn, rice)"
                            value={form.crops.join(',')}
                            onChange={e => setForm({ ...form, crops: e.target.value.split(',').map(c => c.trim()) })} />

                        <select className="w-full border p-3 rounded"
                            value={form.severity}
                            onChange={e => setForm({ ...form, severity: e.target.value })}>
                            <option value="LOW">Low Severity</option>
                            <option value="MEDIUM">Medium Severity</option>
                            <option value="HIGH">High Severity</option>
                        </select>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded">
                            🚀 Publish Alert
                        </button>
                    </form>
                </div>
            </RoleGuard>
        </AuthGuard>
    );
}
