import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const getTransportType = await prisma.transportType.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Forzar revalidación
        revalidatePath('/api/transporttype');

        const response = NextResponse.json(getTransportType);
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
        const newTransportType = await prisma.transportType.create({
            data: {
                name: data.name,
            },
        });

        // Forzar revalidación después de crear
        revalidatePath('/api/transporttype');

        const response = NextResponse.json(newTransportType);
        // Deshabilitar el caché para la respuesta POST también
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
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

// Agregar endpoints para PUT y DELETE con el mismo manejo de caché
export async function PUT(request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        const data = await request.json();

        const updatedTransportType = await prisma.transportType.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
            },
        });

        // Forzar revalidación después de actualizar
        revalidatePath('/api/transporttype');

        const response = NextResponse.json(updatedTransportType);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
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

export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        const deletedTransportType = await prisma.transportType.delete({
            where: { id: parseInt(id) },
        });

        // Forzar revalidación después de eliminar
        revalidatePath('/api/transporttype');

        const response = NextResponse.json(deletedTransportType);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
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
