'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function MapsComponent({ lng, lat }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    const zoom = useRef(16); // valor por defecto

    useEffect(() => {
        if (window.innerWidth <= 480) {
            zoom.current = 12; // asignamos un valor de zoom para pantallas pequeñas
        } else {
            zoom.current = 12; // asignamos un valor de zoom para pantallas grandes
        }

        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/eruotolo/clu0c62dz004g01qq699vaglo',
            center: [lng, lat],
            zoom: zoom.current,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        marker.current = new mapboxgl.Marker({ color: '#2f5872' })
            .setLngLat([lng, lat])
            .addTo(map.current);
    }, [lng, lat]);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        map.current.setCenter([lng, lat]);
        marker.current.setLngLat([lng, lat]);
    }, [lng, lat]);

    return (
        <>
            <div ref={mapContainer} className="h-[350px] md:h-[400px]" />
        </>
    );
}
