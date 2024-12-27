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
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'No se pudieron obtener:' }, { status: 500 });
    }
}
