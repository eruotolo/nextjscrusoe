import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const getCurrencies = await prisma.currencies.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                symbol: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const response = NextResponse.json(getCurrencies);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'No se pudieron obtener:' }, { status: 500 });
    }
}
