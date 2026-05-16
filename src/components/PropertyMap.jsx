import { useEffect, useRef, useId } from 'react';

export default function PropertyMap({ coordinates, projectName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const uid = useId().replace(/:/g, '');

  // Initialize map once
  useEffect(() => {
    if (!coordinates) return;

    const initMap = () => {
      if (!window.L || !mapRef.current || mapInstanceRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const orangeIcon = L.divIcon({
        html: `<div style="
          width:28px;height:28px;
          background:#FF5500;
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(255,85,0,0.5);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      });

      const marker = L.marker([coordinates.lat, coordinates.lng], { icon: orangeIcon })
        .addTo(map)
        .bindPopup(`<b>VVVA Developer</b><br>${projectName}`)
        .openPopup();

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    if (window.L) {
      initMap();
    } else {
      const existing = document.querySelector('script[data-leaflet]');
      if (existing) {
        existing.addEventListener('load', initMap);
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.setAttribute('data-leaflet', '1');
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live-update: re-center map and move marker when admin updates coordinates
  useEffect(() => {
    if (!coordinates || !mapInstanceRef.current || !markerRef.current) return;
    const { lat, lng } = coordinates;
    const latlng = [lat, lng];
    mapInstanceRef.current.setView(latlng, mapInstanceRef.current.getZoom(), { animate: true });
    markerRef.current.setLatLng(latlng);
    markerRef.current.setPopupContent(`<b>VVVA Developer</b><br>${projectName}`);
  }, [coordinates?.lat, coordinates?.lng, projectName]);

  if (!coordinates) return null;

  return (
    <div
      ref={mapRef}
      id={`map-${uid}`}
      className="w-full rounded-card overflow-hidden border border-vvva-sand"
      style={{ height: '300px', zIndex: 1 }}
      aria-label={`Map showing location of ${projectName} by VVVA Developer`}
    />
  );
}
