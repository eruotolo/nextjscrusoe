import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const getTraffics = await prisma.traffics.findMany({
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                code: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        revalidatePath('/api/traffics');

        const response = NextResponse.json(getTraffics);
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

export async function POST(request) {
    try {
        const data = await request.json();
        const newTraffics = await prisma.traffics.create({
            data: {
                code: data.code,
                name: data.name,
                nameEnglish: data.nameEnglish,
                modifiedBy: data.modifiedBy,
            },
        });

        return NextResponse.json(newTraffics);
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
