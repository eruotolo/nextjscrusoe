export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/dashboard/:path*', '/setting/:path*', '/api/:path*'],
};
