import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getIncoterms = await prisma.incoterms.findMany({
            include: {
                transportRelation: {
                    include: {
                        transportType: true,
                    },
                },
            },
        });

        revalidatePath('/api/incoterms');

        // SET CACHE
        const response = NextResponse.json(getIncoterms);
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
        const newIncoterms = await prisma.incoterms.create({
            data: {
                code: data.code,
                name: data.name,
            },
        });

        return NextResponse.json(newIncoterms);
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
