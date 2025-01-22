const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to revalidate data
const revalidateData = async () => {
    try {
        await fetch(`${API_URL}/api/revalidate?path=/api/users`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error revalidating:', error);
    }
};

export const getUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        let data = await response.json();
        return data.filter((user) => !user.roles.some((role) => role.roleId === 1));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const createUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            body: userData,
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error creating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error al obtener: ${response.status} - ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching:', error);
        return null;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            body: userData,
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error updating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

export const changeUserState = async (id, newState) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: newState }),
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error changing user state: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error changing user state:', error);
        throw error;
    }
};

export const changeUserPassword = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            body: formData,
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Error updating: ${response.status} - ${response.statusText}`);
            return null;
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error changing user state:', error);
        throw error;
    }
};
