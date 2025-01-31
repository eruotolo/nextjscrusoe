const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/roles`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getRoles = async () => {
    try {
        const response = await fetch(`${API_URL}/api/roles`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }
        const roles = await response.json();

        return roles.filter((role) => role.name !== 'SuperAdministrador');
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const getRoleById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/roles/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error deleting: ${response.status} - ${response.statusText}`);
            return false;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const changeStateRole = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: 0 }),
            cache: 'no-store', // Ensure we're not caching this request
        });

        if (!response.ok) {
            console.error(`Error creating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};
