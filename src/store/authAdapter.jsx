// Ajusta según tu configuración
import prisma from '@/lib/db';

const AuthAdapter = () => {
    const updateUserSession = async (userId, userData) => {
        if (!userId || !userData) {
            throw new Error('User ID and data must be provided.');
        }

        try {
            // Actualiza los datos del usuario en la base de datos
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: userData,
            });

            return updatedUser; // Devuelve los datos actualizados
        } catch (error) {
            throw new Error(`Error updating user session: ${error.message}`);
        }
    };

    const getUserById = async (userId) => {
        if (!userId) {
            throw new Error('User ID must be provided.');
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            return user;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    };

    return {
        updateUserSession,
        getUserById,
    };
};

export default AuthAdapter;
