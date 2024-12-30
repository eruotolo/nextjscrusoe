import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const partnerView = await prisma.partner.findUnique({
            where: { id },
            select: {
                id: true,
                partnerTypeId: true,
                name: true,
                rut: true,
                socialReazon: true,
                taxId: true,
                email: true,
                address: true,
                zipCode: true,
                locations: true,
                codeCountry: true,
                codeCity: true,
                phone: true,
                scacCode: true,
                userId: true,
            },
        });

        if (!partnerView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        // Forzar revalidación
        revalidatePath(`/api/partner/${params.id}`);

        const response = NextResponse.json(partnerView);
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

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { partnerTypeId, codeCountry, codeCity, userId, ...res } = data;

        //console.log('Datos API:', data);

        const updatePartner = await prisma.partner.update({
            where: {
                id: params.id,
            },
            data: {
                ...res,
                partnerType: {
                    connect: {
                        id: partnerTypeId,
                    },
                },
                country: {
                    connect: {
                        code: codeCountry,
                    },
                },
                city: {
                    connect: {
                        id: codeCity,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        // Forzar revalidación después de actualizar
        revalidatePath(`/api/partner/${params.id}`);

        const response = NextResponse.json(updatePartner);
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
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const removePartner = await prisma.partner.delete({
            where: { id },
        });

        const response = NextResponse.json(removePartner);
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
