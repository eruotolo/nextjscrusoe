const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getAirports = async () => {
    try {
        const response = await fetch(`${API_URL}/api/airports`, {
            next: { revalidate: 3600 },
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
        });
        if (!response.ok) {
            console.error(`Error deleting Airports: ${response.status} - ${response.statusText}`);
            return false;
        }
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
        });

        if (!response.ok) {
            console.error(`Error creating Airport: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.log('Error creating:', error);
        return null;
    }
};

export const getAirportById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/airports/${id}`, {
            next: { revalidate: 3600 },
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
