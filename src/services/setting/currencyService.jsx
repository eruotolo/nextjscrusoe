const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCurrenies = async () => {
    try {
        const response = await fetch(`${API_URL}/api/currencies`, {
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

export const getCurrencyById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/currencies/${id}`, {
            cache: 'no-store',
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
