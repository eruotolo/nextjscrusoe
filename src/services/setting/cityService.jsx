const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/city`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getCities = async () => {
    try {
        const response = await fetch(`${API_URL}/api/city`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const deleteCity = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/city/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error(`Error deleting city: ${response.status} - ${response.statusText}`);
            return false;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error deleting city'.error);
        return false;
    }
};

export const createCity = async (cityData) => {
    try {
        const response = await fetch(`${API_URL}/api/city`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error creating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.log('Error creating city:', error);
        return null;
    }
};

export const getCityById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/city/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error fetching city: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching city:', error);
        return null;
    }
};

export const updateCity = async (id, cityData) => {
    try {
        console.log('Actualizando ciudad con datos:', cityData);
        const response = await fetch(`${API_URL}/api/city/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                `Error al actualizar la ciudad: ${response.status} - ${response.statusText}`,
                errorText
            );
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar la ciudad:', error);
        return null;
    }
};

export const getCitiesCountry = async (countryCode) => {
    try {
        const response = await fetch(`${API_URL}/api/city?country=${countryCode}`, {
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};
