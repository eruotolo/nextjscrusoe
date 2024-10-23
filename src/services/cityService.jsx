export const getCities = async ({ search = '', page = 1, pageSize = 100 } = {}) => {
    try {
        const response = await fetch(
            `/api/city?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`
        );

        if (!response.ok) {
            console.error(`Error fetching cities: ${response.status} - ${response.statusText}`);
            return { data: [], meta: { total: 0, page: 1, pageSize: 100, totalPages: 1 } };
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        return { data: [], meta: { total: 0, page: 1, pageSize: 100, totalPages: 1 } };
    }
};

export const getAllCities = async (search = '') => {
    try {
        const response = await fetch(`/api/city/all?search=${encodeURIComponent(search)}`);

        if (!response.ok) {
            console.error(`Error fetching all cities: ${response.status} - ${response.statusText}`);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const deleteCity = async (id) => {
    try {
        const response = await fetch(`/api/city/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(`Error deleting city: ${response.status} - ${response.statusText}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting city'.error);
        return false;
    }
};

export const createCity = async (cityData) => {
    try {
        const response = await fetch(`/api/city`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData),
        });

        if (!response.ok) {
            console.error(`Error creating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error creating city:', error);
        return null;
    }
};

export const getCityById = async (id) => {
    try {
        const response = await fetch(`/api/city/${id}`);
        if (!response.ok) {
            console.error(`Error fetching city: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching city:', error);
        return null;
    }
};

export const updateCity = async (id, cityData) => {
    try {
        const response = await fetch(`/api/city/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData),
        });

        if (!response.ok) {
            console.error(`Error updating city: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating city:', error);
        return null;
    }
};
