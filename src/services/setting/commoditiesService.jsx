const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCommodities = async () => {
    try {
        const response = await fetch(`${API_URL}/api/commodities`, { next: { revalidate: 3600 } });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching:', error);
        return [];
    }
};

export const deleteCommodities = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/commodities/${id}`, { method: 'DELETE' });

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

export const createCommodities = async (commoditiesData) => {
    try {
        const response = await fetch(`${API_URL}/api/commodities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commoditiesData),
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

export const getCommoditiesId = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/commodities/${id}`, {
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

export const updateCommodities = async (id, commoditiesData) => {
    try {
        const response = await fetch(`${API_URL}/api/commodities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commoditiesData),
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
