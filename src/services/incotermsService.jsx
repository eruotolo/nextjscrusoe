const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getIncoterms = async () => {
    try {
        const response = await fetch(`${API_URL}/api/incoterms`, {
            next: { revalidate: 3600 },
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

export const deleteIncoterms = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/incoterms/${id}`, {
            method: 'DELETE',
        });
        //console.log('Eliminado:', response);

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

export const createIncoterms = async (incotermsData) => {
    try {
        const response = await fetch(`${API_URL}/api/incoterms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incotermsData),
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

export const getIncotermsById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/incoterms/${id}`, {
            next: { revalidate: 3600 },
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

export const updateIncoterms = async (id, incotermsData) => {
    try {
        const response = await fetch(`${API_URL}/api/incoterms/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incotermsData),
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
