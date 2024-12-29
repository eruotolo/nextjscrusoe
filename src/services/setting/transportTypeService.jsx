const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getTransportType = async () => {
    try {
        const response = await fetch(`${API_URL}/api/transporttype`, {
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

export const deleteTransporteType = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/transporttype/${id}`, {
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

export const createTransportType = async (transportData) => {
    try {
        //console.log('Cargando los datos:', transportData);
        const response = await fetch(`${API_URL}/api/transporttype`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transportData),
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

export const getTransportTypeById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/transporttype/${id}`, {
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

export const updateTransportType = async (id, transportData) => {
    try {
        //console.log('Actualizando los datos:', transportData);
        const response = await fetch(`${API_URL}/api/transporttype/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transportData),
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

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/transporttype`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};
