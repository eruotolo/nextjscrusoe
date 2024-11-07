'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapsComponent({ lng, lat, onLocationChange, mapHeight = '100%' }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const zoom = useRef(14); // default zoom value
    const centerLat = -34.895671;
    const centerLog = -56.199952;

    useEffect(() => {
        if (!mapboxgl.accessToken) {
            console.error('Mapbox access token is missing');
            return;
        }

        if (map.current) return; // Initialize map only once

        // Create the Mapbox map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/eruotolo/clu0c62dz004g01qq699vaglo',
            center: [centerLog, centerLat],
            zoom: zoom.current,
        });

        // Add navigation control
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add draggable marker
        marker.current = new mapboxgl.Marker({ color: '#2f5872', draggable: true })
            .setLngLat([centerLog, centerLat])
            .addTo(map.current);

        // Handle marker drag event
        marker.current.on('dragend', () => {
            const { lng, lat } = marker.current.getLngLat();
            onLocationChange(lng, lat);
        });
    }, [onLocationChange]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded() && marker.current) {
            // Update marker position and fly to new location
            marker.current.setLngLat([lng, lat]);
            map.current.flyTo({ center: [lng, lat], essential: true, speed: 0.7 });
        }
    }, [lng, lat]);

    return <div ref={mapContainer} style={{ height: mapHeight }} className="map-container" />;
}
