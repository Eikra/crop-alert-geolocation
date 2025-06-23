"use client";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/auth-api";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/lib/auth-guard";

export default function EditAlertPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    authApi.get(`/alerts/${id}`).then(res => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await authApi.patch(`/alerts/${id}`, form);
      router.push("/my-alerts");
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <AuthGuard>
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Alert</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2" placeholder="Title"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full border p-2" placeholder="Description"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="w-full border p-2" placeholder="Crops (comma separated)"
            value={form.crops.join(',')} onChange={e => setForm({ ...form, crops: e.target.value.split(',') })} />
          <select className="w-full border p-2"
            value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <button className="w-full bg-blue-500 text-white p-2 rounded">Update</button>
        </form>
      </div>
    </AuthGuard>
  );
}
