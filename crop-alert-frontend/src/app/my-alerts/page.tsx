"use client";
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/auth-api';
import { AuthGuard } from '@/lib/auth-guard';
import { useRouter } from 'next/navigation';

export default function MyAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const router = useRouter();

  const fetchMyAlerts = async () => {
    const res = await authApi.get('/alerts');
    setAlerts(res.data);
  };

  const deleteAlert = async (id: number) => {
    if (confirm("Are you sure?")) {
      await authApi.delete(`/alerts/${id}`);
      fetchMyAlerts();
    }
  };

  useEffect(() => {
    fetchMyAlerts();
  }, []);

  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Alerts</h1>
        <ul className="space-y-4">
          {alerts.map(alert => (
            <li key={alert.id} className="border p-4 rounded">
              <h3 className="font-bold">{alert.title}</h3>
              <p>{alert.description}</p>
              <p>Crops: {alert.crops.join(', ')}</p>
              <p>Severity: {alert.severity}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => router.push(`/edit-alert/${alert.id}`)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteAlert(alert.id)} className="bg-red-500 px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AuthGuard>
  );
}
