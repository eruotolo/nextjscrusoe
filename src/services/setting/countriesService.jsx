const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCountriesByCode = async (code) => {
    try {
        const response = await fetch(`/api/countries/${code}`);

        if (!response.ok) {
            console.error(`Error fetching country: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching country:', error);
        return null;
    }
};
