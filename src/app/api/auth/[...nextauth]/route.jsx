import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

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
                    roles: userFound.roles.map((userRole) => userRole.role.name),
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
        jwt: true,
        cookie: {
            secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
            sameSite: 'none',
        },
    },
    callbacks: {
        async session({ session, token }) {
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
                roles: token.roles,
            };
            //console.log(session);
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
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
