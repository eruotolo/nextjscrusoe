import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const { code } = params;

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Invalid country code' }, { status: 400 });
        }

        // Asegurémonos de que el código esté en mayúsculas para coincidir con el formato en la base de datos
        const normalizedCode = code.toUpperCase();

        const viewCountryByCode = await prisma.country.findUnique({
            where: { code: normalizedCode },
            select: {
                id: true,
                name: true,
                code: true, // Añadimos el código a la selección para verificar
            },
        });

        if (!viewCountryByCode) {
            return NextResponse.json({ error: 'Country not found' }, { status: 404 });
        }

        const response = NextResponse.json(viewCountryByCode);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        return response;
    } catch (error) {
        console.error('Error detallado:', error);
        return NextResponse.json({ error: 'Failed to fetch: ' + error.message }, { status: 500 });
    }
}
