const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/country`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getCountries = async () => {
    try {
        const response = await fetch(`${API_URL}/api/country`, {
            cache: 'no-store',
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
};

export const deleteCountry = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/country/${id}`, {
            method: 'DELETE',
            ache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error deleting country: ${response.status} - ${response.statusText}`);
            return false;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error deleting country:', error);
        return false;
    }
};

export const createCountry = async (countryData) => {
    try {
        const response = await fetch(`${API_URL}/api/country`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: countryData.code,
                name: countryData.name,
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Error creating country: ${response.status} - ${response.statusText}`,
                errorData
            );
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.log('Error creating country:', error);
        return null;
    }
};

export const getCountryById = async (id) => {
    try {
        const response = await fetch(`/api/country/${id}`, {
            cache: 'no-store',
        });

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
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error updating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error updating country:', error);
        return null;
    }
};
