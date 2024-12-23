'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function EditMapsComponent({ lng, lat, onLocationChange }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const zoom = useRef(14); // default value

    useEffect(() => {
        if (!mapboxgl.accessToken) {
            console.error('Mapbox access token is missing');
            return;
        }

        // Inicializar el mapa una sola vez
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/eruotolo/clu0c62dz004g01qq699vaglo',
                center: [lng, lat],
                zoom: zoom.current,
            });

            // Añadir controles de navegación (zoom, rotación)
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Crear y añadir un marcador arrastrable
            marker.current = new mapboxgl.Marker({ color: '#2f5872', draggable: true })
                .setLngLat([lng, lat])
                .addTo(map.current);

            // Evento cuando se arrastra el marcador
            marker.current.on('dragend', () => {
                const { lng, lat } = marker.current.getLngLat();
                onLocationChange(lng, lat); // Llamar a la función onLocationChange con las nuevas coordenadas
            });
        }
    }, [lng, lat]);

    useEffect(() => {
        if (map.current && marker.current) {
            // Cada vez que las coordenadas cambian (vienen de props), actualizamos el marcador y centramos el mapa
            marker.current.setLngLat([lng, lat]); // Mover el marcador a las nuevas coordenadas
            map.current.flyTo({ center: [lng, lat], essential: true, speed: 1 }); // Volar suavemente a las nuevas coordenadas
        }
    }, [lng, lat]);

    return <div ref={mapContainer} className="h-[100%]" />;
}
