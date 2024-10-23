import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getShippingPorts = cache(async () => {
    const res = await fetch(`${API_URL}/api/shippingports`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error('Failed to fetch shipping ports');

    return res.json();
});

export const getShippingPortById = cache(async (id) => {
    const res = await fetch(`${API_URL}/api/shippingports/${id}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    return res.json();
});

export const createShippingPort = async (shippingPortData) => {
    const res = await fetch(`${API_URL}/api/shippingports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingPortData),
    });

    if (!res.ok) throw new Error('Failed to create shipping port');

    return res.json();
};

export const updateShippingPort = async (id, shippingPortData) => {
    const res = await fetch(`${API_URL}/api/shippingports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingPortData),
    });

    if (!res.ok) throw new Error('Failed to update shipping port');

    return res.json();
};

export const deleteShippingPort = async (id) => {
    const res = await fetch(`${API_URL}/api/shippingports/${id}`, {
        method: 'DELETE',
    });

    return res.ok;
};
