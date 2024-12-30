const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/airports`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getAirports = async () => {
    try {
        const response = await fetch(`${API_URL}/api/airports`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching airports:', error);
        return [];
    }
};

export const deleteAirport = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/airports/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        if (!response.ok) {
            console.error(`Error deleting Airports: ${response.status} - ${response.statusText}`);
            return false;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error deleting Shipping Port'.error);
        return false;
    }
};

export const createAirport = async (airportData) => {
    try {
        console.log('Actualizando los datos:', airportData);
        const response = await fetch(`${API_URL}/api/airports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(airportData),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error creating Airport: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.log('Error creating:', error);
        return null;
    }
};

export const getAirportById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/airports/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error fetching: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Shipping Port:', error);
        return null;
    }
};

export const updateAirport = async (id, airportData) => {
    try {
        console.log('Actualizando los datos:', airportData);
        const response = await fetch(`${API_URL}/api/airports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(airportData),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error updating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};
