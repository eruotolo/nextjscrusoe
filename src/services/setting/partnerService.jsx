const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getPartner = async () => {
    try {
        const response = await fetch(`${API_URL}/api/partner`, {
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
