import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getPlaces = cache(async () => {
    try {
        const response = await fetch(`${API_URL}/api/places`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching places:', error);
        return [];
    }
});

export const deletePlaces = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/places/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            console.error(`Error deleting: ${response.status} - ${response.statusText}`);
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting'.error);
        return false;
    }
};

export const createPlaces = async (placesData) => {
    try {
        //console.log('Cargando los datos:', placesData);
        const response = await fetch(`${API_URL}/api/places`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placesData),
        });

        if (!response.ok) {
            console.error(`Error creating: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log('Error creating:', error);
        return null;
    }
};

export const getPlacesById = cache(async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/places/${id}`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Error fetching: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching:', error);
        return null;
    }
});

export const updatePlace = async (id, placesData) => {
    try {
        console.log('Actualizando los datos:', placesData);
        const response = await fetch(`${API_URL}/api/places/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placesData),
        });
        if (!response.ok) {
            console.error(`Error updating: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};
