const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/traffics`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getTraffics = async () => {
    try {
        const response = await fetch(`${API_URL}/api/traffics`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const deleteTraffics = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/traffics/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error deleting: ${response.status} - ${response.statusText}`);
            return false;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error deleting'.error);
        return false;
    }
};

export const createTraffics = async (trafficsData) => {
    try {
        const response = await fetch(`${API_URL}/api/traffics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trafficsData),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error creating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.log('Error creating:', error);
        return null;
    }
};

export const getTrafficsById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/traffics/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error fetching: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const updateTraffics = async (id, trafficsData) => {
    try {
        const response = await fetch(`${API_URL}/api/traffics/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trafficsData),
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
