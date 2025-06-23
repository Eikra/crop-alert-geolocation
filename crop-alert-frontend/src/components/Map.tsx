"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, MapContainerProps } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

function FlyToCenter({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.2 });
  }, [center, map]);
  return null;
}

type Alert = {
  id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

export default function Map({ alerts, center }: { alerts: Alert[]; center: LatLngExpression }) {
  return (
    <MapContainer center={center} zoom={10} className="h-96 w-full rounded shadow">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToCenter center={center} />
      {alerts.map(alert => (
        <Marker position={[alert.latitude, alert.longitude]} key={alert.id}>
          <Popup>
            <b>{alert.title}</b><br />{alert.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


// "use client";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-defaulticon-compatibility';
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import { useEffect } from 'react';

// function ChangeCenter({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom(), { animate: true });
//   }, [center, map]);
//   return null;
// }

// export default function Map({
//   alerts,
//   center
// }: {
//   alerts: any[];
//   center: [number, number];
// }) {
//   return (
//     <MapContainer center={center} zoom={10} className="h-96 w-full rounded shadow">
//       <TileLayer
//         attribution='&copy; OpenStreetMap contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
      
//       <ChangeCenter center={center} />

//       {alerts.map(alert => (
//         <Marker position={[alert.latitude, alert.longitude]} key={alert.id}>
//           <Popup>
//             <b>{alert.title}</b><br />
//             {alert.description}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
