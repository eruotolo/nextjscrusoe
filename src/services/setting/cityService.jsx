const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCities = async () => {
    try {
        const response = await fetch(`${API_URL}/api/city`, {
            next: { revalidate: 3600 },
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

export const getCitiesCountry = async (countryCode) => {
    try {
        const response = await fetch(`${API_URL}/api/city?country=${countryCode}`, {
            next: { revalidate: 3600 },
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

export const createCity = async (cityData) => {
    try {
        const response = await fetch(`${API_URL}/api/city`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData),
        });

        if (!response.ok) {
            console.error(`Error creating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log('Error creating city:', error);
        return null;
    }
};

export const deleteCity = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/city/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(`Error deleting city: ${response.status} - ${response.statusText}`);
            return false;
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting city'.error);
        return false;
    }
};

export const getCityById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/city/${id}`);

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

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar la ciudad:', error);
        return null;
    }
};
