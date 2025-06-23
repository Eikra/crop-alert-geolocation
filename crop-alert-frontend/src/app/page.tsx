"use client";
import { useState, useEffect } from 'react';
import { authApi } from '@/lib/auth-api';
import { AuthGuard } from '@/lib/auth-guard';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import qs from 'qs';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function FeedPage() {
  const { user } = useAuth();
  const DEFAULT_LAT = 32.24337484258097;
  const DEFAULT_LNG = -7.947736927819076;
  const DEFAULT_RADIUS = 10;

  const [alerts, setAlerts] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([DEFAULT_LAT, DEFAULT_LNG]);

  const [filters, setFilters] = useState({
    lat: '' as string | number,
    lng: '' as string | number,
    radius: '' as string | number,
    crops: ''
  });

  // Initial geolocation on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      },
      () => {
        console.warn("Geolocation denied. Using default coordinates.");
        setFilters(prev => ({
          ...prev,
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG
        }));
      }
    );
  }, []);

  // Sync map center when filters change
  useEffect(() => {
    if (filters.lat && filters.lng) {
      setMapCenter([parseFloat(filters.lat.toString()), parseFloat(filters.lng.toString())]);
    }
  }, [filters.lat, filters.lng]);

  const fetchAlerts = async () => {
    const radius = filters.radius === '' ? 1 : filters.radius;
    const params: any = {
      lat: filters.lat,
      lng: filters.lng,
      radius: radius,
    };

    const cropsArray = (filters.crops || '').split(',').map(c => c.trim()).filter(c => c.length > 0);
    if (cropsArray.length > 0) {
      params.crops = cropsArray;
    }

    try {
      const res = await authApi.get('/alerts/nearby/search', {
        params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      setAlerts(res.data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    }
  };

  // // Handle socket only after user is authenticated
  // useEffect(() => {
  //   if (!user) return;

  //   const socket = io(process.env.BACKEND_URL!, {
  //     transports: ['websocket'],  // force websocket instead of polling
  //     withCredentials: true,
  //   });

  //   socket.on('new_alert', fetchAlerts);

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user]);


  // Recenter button with Permissions API check
  const handleRecenter = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    if (navigator.permissions) {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        alert("Geolocation is blocked. Please enable location access in browser settings.");
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFilters(prev => ({
          ...prev,
          lat: lat,
          lng: lng,
        }));
        setMapCenter([lat, lng]);
      },
      () => {
        alert("Failed to retrieve location.");
      }
    );
  };

  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">🌾 Search for Crop Alerts Nearby</h1>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="number"
              step="any"
              placeholder="📍 Latitude"
              value={filters.lat}
              onChange={e => setFilters({ ...filters, lat: parseFloat(e.target.value) || 0 })}
              className="border p-3 rounded w-full"
            />
            <input
              type="number"
              step="any"
              placeholder="📍 Longitude"
              value={filters.lng}
              onChange={e => setFilters({ ...filters, lng: parseFloat(e.target.value) || 0 })}
              className="border p-3 rounded w-full"
            />
            <input
              type="number"
              placeholder="📏 Radius (km)"
              value={filters.radius}
              onChange={e => setFilters({ ...filters, radius: parseFloat(e.target.value) || '' })}
              className="border p-3 rounded w-full"
            />
          </div>

          <input
            type="text"
            placeholder="🌽 Crops (comma-separated)"
            value={filters.crops}
            onChange={e => setFilters({ ...filters, crops: e.target.value })}
            className="border p-3 rounded w-full mb-3"
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={fetchAlerts}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded w-full"
            >
              🔍 Search Alerts
            </button>

            <button
              onClick={handleRecenter}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded w-full"
            >
              📍 Recenter to My Location
            </button>
          </div>
        </div>

        <Map alerts={alerts} center={mapCenter} />

        <div className="mt-8 space-y-4">
          {alerts.length === 0 && (
            <div className="text-gray-500 italic text-center">No alerts found.</div>
          )}
          {alerts.map(alert => (
            <div key={alert.id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-indigo-700">{alert.title}</h3>
              <p className="text-gray-600 mb-1">{alert.description}</p>
              <div className="flex flex-wrap text-sm text-gray-500 gap-2 mb-3">
                <span><b>Crops:</b> {alert.crops.join(', ')}</span>
                <span><b>Severity:</b> {alert.severity}</span>
                <span><b>Coordinates:</b> {alert.latitude}, {alert.longitude}</span>
              </div>

              <button
                onClick={() => setMapCenter([alert.latitude, alert.longitude])}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
              >
                🔎 Center on this Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
