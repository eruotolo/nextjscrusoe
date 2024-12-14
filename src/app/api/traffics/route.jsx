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
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

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
                name: data.name,
                nameEnglish: data.nameEnglish,
                code: data.code,
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
