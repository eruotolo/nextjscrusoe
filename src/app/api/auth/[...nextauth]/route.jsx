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
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                const userFound = await db.user.findUnique({
                    where: { email: credentials.email },
                    include: { roles: { include: { role: true } } },
                });

                if (!userFound) throw new Error('No user found');

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
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
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
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
