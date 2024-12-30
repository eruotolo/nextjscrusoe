const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function for common fetch options
const fetchOptions = (method = 'GET', body = null) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
        // Add any other common headers here
    },
    cache: 'no-store',
    ...(body && { body: JSON.stringify(body) }),
});

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/shipowner`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getShipOwner = async () => {
    try {
        const response = await fetch(`${API_URL}/api/shipowner`, fetchOptions());

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

export const deleteShipOwner = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/shipowner/${id}`, fetchOptions('DELETE'));

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

export const createShipOwner = async (shipOwnerData) => {
    try {
        const response = await fetch(
            `${API_URL}/api/shipowner`,
            fetchOptions('POST', shipOwnerData)
        );

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

export const getShipOwnerById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/shipowner/${id}`, fetchOptions());

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

export const updateShipOwner = async (id, shipOwnerData) => {
    try {
        const response = await fetch(
            `${API_URL}/api/shipowner/${id}`,
            fetchOptions('PUT', shipOwnerData)
        );

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
