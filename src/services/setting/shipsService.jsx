const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getShips = async () => {
    try {
        const response = await fetch(`${API_URL}/api/ships`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Ships:', error);
        return [];
    }
};

export const deleteShips = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/ships/${id}`, {
            method: 'DELETE',
        });

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

export const createShips = async (shipsData) => {
    try {
        const response = await fetch(`${API_URL}/api/ships`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipsData),
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

export const getShipsById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/ships/${id}`, {
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
};

export const updateShips = async (id, shipsData) => {
    try {
        const response = await fetch(`${API_URL}/api/ships/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipsData),
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
