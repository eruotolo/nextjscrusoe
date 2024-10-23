export const getAirports = async () => {
    try {
        const response = await fetch(`/api/airports`);

        if (!response.ok) {
            console.error(`Error fetching airports: ${response.status} - ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return { data: [], meta: { total: 0, page: 1, pageSize: 100, totalPages: 1 } };
    }
};

export const deleteAirport = async (id) => {
    try {
        const response = await fetch(`/api/airports/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(
                `Error deleting Shipping Port: ${response.status} - ${response.statusText}`
            );
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting Shipping Port'.error);
        return false;
    }
};

export const createAirport = async (airportData) => {
    try {
        const response = await fetch(`/api/airports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(airportData),
        });

        if (!response.ok) {
            console.error(
                `Error creating Shipping Port: ${response.status} - ${response.statusText}`
            );
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error creating country:', error);
        return null;
    }
};

export const getAirportBtId = async (id) => {
    try {
        const response = await fetch(`/api/airports/${id}`);

        if (!response.ok) {
            console.error(`Error fetching Airport: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Shipping Port:', error);
        return null;
    }
};

export const updateAirport = async (id, airportData) => {
    try {
        const response = await fetch(`/api/airports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(airportData),
        });

        if (!response.ok) {
            console.error(`Error updating country: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating country:', error);
        return null;
    }
};
