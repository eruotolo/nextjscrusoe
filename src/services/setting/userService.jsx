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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        return data.filter((user) => !user.roles.some((role) => role.roleId === 1));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const disableUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: 0 }),
            cache: 'no-store', // Ensure we're not caching this request
        });

        if (!response.ok) {
            throw new Error(`Error disabling user: ${response.status} - ${response.statusText}`);
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error disabling user:', error);
        throw error; // Re-throw the error for the component to handle
    }
};

export const activeUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: 1 }),
            cache: 'no-store', // Ensure we're not caching this request
        });

        if (!response.ok) {
            throw new Error(`Error activating user: ${response.status} - ${response.statusText}`);
        }

        await revalidateData();
        return await response.json();
    } catch (error) {
        console.error('Error activating user:', error);
        throw error; // Re-throw the error for the component to handle
    }
};
