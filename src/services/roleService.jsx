const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getRoles = async () => {
    try {
        const response = await fetch(`${API_URL}/api/roles`, {
            next: { revalidate: 60 },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const getRoleById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/roles/${id}`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) {
            throw new Error(`Error disabling: ${response.status} - ${response.statusText}`);
        }
        let data = await response.json();
        return data;
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
            throw new Error(`Error disabling: ${response.status} - ${response.statusText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating:', error);
        return null;
    }
};
