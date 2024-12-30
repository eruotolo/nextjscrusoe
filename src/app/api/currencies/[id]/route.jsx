import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const currencyView = await prisma.currencies.findUnique({
            where: { id },
            select: {
                id: true,
                code: true,
                name: true,
                symbol: true,
            },
        });

        if (!currencyView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        // Forzar revalidación
        revalidatePath(`/api/currencies/${params.id}`);

        const response = NextResponse.json(currencyView);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
