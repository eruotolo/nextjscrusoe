const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/creditinfopartner`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getCreditInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/api/creditinfopartner`, {
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

export const createCreditInfo = async (creditInfoData) => {
    try {
        const response = await fetch(`${API_URL}/api/creditinfopartner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(creditInfoData),
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

export const getCreditInfoById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/creditinfopartner/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) {
                // No se encontraron datos, devolvemos null en lugar de lanzar un error
                return null;
            }
            throw new Error(`¡Error HTTP! estado: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching:', error);
        return null;
    }
};
