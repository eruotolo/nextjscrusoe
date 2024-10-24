import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCountries = cache(async () => {
    try {
        const response = await fetch(`${API_URL}/api/country`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
});

export const createCountry = async (countryData) => {
    try {
        const response = await fetch(`${API_URL}/api/country`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryData),
        });

        if (!response.ok) {
            console.error(`Error creating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log('Error creating country:', error);
        return null;
    }
};

export const deleteCountry = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/country/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            console.error(`Error deleting country: ${response.status} - ${response.statusText}`);
            return false;
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting country:', error);
        return false;
    }
};

export const getCountryById = async (id) => {
    try {
        const response = await fetch(`/api/country/${id}`);

        if (!response.ok) {
            console.error(`Error fetching country: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching country:', error);
        return null;
    }
};

export const updateCountry = async (id, countryData) => {
    try {
        const response = await fetch(`/api/country/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryData),
        });

        if (!response.ok) {
            console.error(`Error updating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating country:', error);
        return null;
    }
};
