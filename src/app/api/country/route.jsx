import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                code: true,
                name: true,
            },
            orderBy: {
                code: 'asc',
            },
        });

        // Revalidate the path
        revalidatePath('/api/country');

        // Set cache headers
        const response = NextResponse.json(countries);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCountry = await prisma.country.create({
            data: {
                name: data.name,
                code: data.code,
            },
        });

        return NextResponse.json(newCountry);
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
