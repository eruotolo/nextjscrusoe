import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import AuthAdapter from '@/store/authAdapter'; // Importa el adaptador

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'ejemplo@ejemplo.com' },
                password: { label: 'Password', type: 'password', placeholder: '*************' },
            },
            async authorize(credentials, req) {
                //console.log(credentials);
                //console.log(`Credenciales recibidas: ${JSON.stringify(credentials)}`);

                const userFound = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    include: {
                        roles: {
                            include: {
                                role: true,
                            },
                        },
                    },
                });

                if (!userFound) throw new Error('No users found');

                //console.log(userFound);

                const matchPassword = await bcrypt.compare(
                    credentials.password,
                    userFound.password
                );

                if (!matchPassword) throw new Error('Wrong Password');

                // Verifica que el usuario tiene roles asociados
                if (!userFound.roles || userFound.roles.length === 0) {
                    throw new Error('El usuario no tiene roles asignados');
                }

                // Extrae los roles asociados como un array de strings
                const roles = userFound.roles.map((userRole) => userRole.role.name);

                //console.log('Roles asignados al usuario:', roles);

                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.name,
                    lastName: userFound.lastName,
                    phone: userFound.phone,
                    address: userFound.address,
                    city: userFound.city,
                    image: userFound.image,
                    state: userFound.state,
                    //roles: userFound.roles.map((userRole) => userRole.role.name),
                    roles,
                };
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },
    // Añade la secreta aquí
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },

    callbacks: {
        async session({ session, token }) {
            try {
                const { getUserById } = AuthAdapter(); // Inicializa el adaptador

                // Obtener la información más reciente del usuario
                const freshUserData = await getUserById(token.id);

                session.user = {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    lastName: token.lastName,
                    email: token.email,
                    phone: token.phone,
                    address: token.address,
                    city: token.city,
                    image: token.image,
                    state: token.state,
                    ...freshUserData,
                    roles: token.roles,
                };
                //console.log('Sesión generada:', session); // Verifica la salida final de la sesión
                return session;
            } catch (error) {
                console.error('Error actualizando la sesión:', error);
                // Maneja el error apropiadamente, tal vez regresa la sesión original o una sesión nula
                return session; // O return null; para invalidar la session
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                //console.log('Roles del usuario en el JWT:', user.roles); // Verifica los roles antes de asignarlos
                token.id = user.id;
                token.name = user.name;
                token.lastName = user.lastName;
                token.email = user.email;
                token.phone = user.phone;
                token.address = user.address;
                token.city = user.city;
                token.image = user.image;
                token.state = user.state;
                token.roles = user.roles;
            }
            //console.log(token);
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
