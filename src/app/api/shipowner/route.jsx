import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const shipowner = await prisma.shipowner.findMany({
            select: {
                id: true,
                name: true,
                code: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        // Revalidate the path
        revalidatePath('/api/shipowner');

        const response = NextResponse.json(shipowner);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newShipOwner = await prisma.shipowner.create({
            data: {
                name: data.name,
                code: data.code,
            },
        });

        return NextResponse.json(newShipOwner);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                {
                    message:
                        'Ya existe un item con este nombre. Por favor, elige un nombre diferente.',
                },
                {
                    status: 400,
                }
            );
        }
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
