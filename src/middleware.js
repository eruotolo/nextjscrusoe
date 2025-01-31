/*
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/setting/:path*', '/api/:path*'],
};
*/
// middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import routeRoles from '@/lib/routeRoles';

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    //console.log('Middleware ejecutándose para la ruta:', pathname);

    // Excluir archivos de imagen (ej. .png, .jpg, .jpeg, .gif, .svg)
    if (/\.(png|jpg|jpeg|gif|svg)$/i.test(pathname)) {
        return NextResponse.next();
    }

    // Excluir rutas de autenticación (por ejemplo /api/auth)
    if (pathname.startsWith('/api/auth')) {
        //console.log('Ruta de autenticación, permitiendo acceso');
        return NextResponse.next();
    }

    // Obtener token
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    });

    //console.log('Token obtenido:', token);

    // Si no hay token y no estamos en /login, redirigir a login
    if (!token && pathname !== '/login') {
        //console.log('No se encontró token, redirigiendo al login');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Si hay token y estamos en /login, redirigir al dashboard
    if (token && pathname === '/login') {
        //console.log('Usuario ya autenticado, redirigiendo al dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Definir rutas y roles permitidos
    <routeRoles />;

    // Función para verificar si el usuario tiene al menos uno de los roles requeridos
    const checkAccess = (userRoles, allowedRoles) => {
        return userRoles.some((role) => allowedRoles.includes(role));
    };

    // Recorrer las rutas definidas y validar roles
    for (const [route, roles] of Object.entries(routeRoles)) {
        if (pathname.startsWith(route)) {
            //console.log('Verificando roles para la ruta:', route);
            //console.log('Roles del usuario:', token?.roles || []);
            if (!checkAccess(token?.roles || [], roles)) {
                //console.log('Usuario no tiene el rol requerido, redirigiendo a /acceso-denegado');
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
            break;
        }
    }

    //console.log('Acceso permitido');
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/setting/:path*',
        '/crm/:path*',
        '/api/:path*',
        '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
    ],
};
