import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewShippingPort = await prisma.shippingPorts.findUnique({
            where: { id },
            select: {
                id: true,
                unCode: true,
                name: true,
                latitude: true,
                longitude: true,
                codeCountry: true,
            },
        });

        if (!viewShippingPort) {
            notFound();
        }

        // Forzar revalidación
        revalidatePath(`/api/shippingports/${params.id}`);

        const response = NextResponse.json(viewShippingPort);
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

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { codeCountry, ...res } = data;

        const updateShippingPort = await prisma.shippingPorts.update({
            where: {
                id: params.id,
            },
            data: {
                ...res,
                country: {
                    connect: {
                        code: codeCountry,
                    },
                },
            },
        });

        // Forzar revalidación
        revalidatePath(`/api/shippingports/${params.id}`);

        const response = NextResponse.json(updateShippingPort);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removeShippingPort = await prisma.shippingPorts.delete({
            where: {
                id: params.id,
            },
        });

        const response = NextResponse.json(removeShippingPort);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to delete' },
            {
                status: 500,
            }
        );
    }
}
