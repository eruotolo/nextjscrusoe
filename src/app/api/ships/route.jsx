import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const ships = await prisma.ships.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                country: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                shipsType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                shipowner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Revalidate the path
        revalidatePath('/api/ships');

        const response = NextResponse.json(ships);
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
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        // console.log('Recibe los datos:', data);

        if (
            !data.name ||
            !data.code ||
            !data.shipownerId ||
            !data.codeCountry ||
            !data.shipsTypeId
        ) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newShips = await prisma.ships.create({
            data: {
                name: data.name,
                code: data.code,
                shipownerId: data.shipownerId,
                codeCountry: data.codeCountry,
                shipsTypeId: data.shipsTypeId,
            },
        });

        return NextResponse.json(newShips, { status: 201 });
    } catch (error) {
        console.error('Error creating:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
