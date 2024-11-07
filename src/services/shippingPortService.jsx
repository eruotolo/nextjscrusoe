import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getShippingPorts = cache(async () => {
    try {
        const response = await fetch(`${API_URL}/api/shippingports`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching shippingports:', error);
        return [];
    }
});

export const deleteShippingPort = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/shippingports/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error(
                `Error deleting Shipping Port: ${response.status} - ${response.statusText}`
            );
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting Shipping Port'.error);
        return false;
    }
};

export const createShippingPort = async (shippingPortData) => {
    try {
        console.log('Actualizando los datos:', shippingPortData);
        const response = await fetch(`${API_URL}/api/shippingports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingPortData),
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

export const getShippingPortById = cache(async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/shippingports/${id}`, {
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

export const updateShippingPort = async (id, shippingPortData) => {
    try {
        console.log('Actualizando los datos:', shippingPortData);
        const response = await fetch(`${API_URL}/api/shippingports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingPortData),
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
