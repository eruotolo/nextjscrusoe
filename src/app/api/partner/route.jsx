import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const getPartner = await prisma.partner.findMany({
            select: {
                id: true,
                partnerType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                name: true,
                socialReazon: true,
                rut: true,
                taxId: true,
                email: true,
                address: true,
                zipCode: true,
                locations: true,
                country: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                        countryCode: true,
                    },
                },
                phone: true,
                scacCode: true,
                userId: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        revalidatePath('/api/partner');

        const response = NextResponse.json(getPartner);
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
        console.log('Información Partner', data);
        const newPartner = await prisma.partner.create({
            data: {
                partnerTypeId: data.partnerTypeId,
                name: data.name,
                rut: data.rut,
                socialReazon: data.socialReazon,
                taxId: data.taxId,
                email: data.email,
                address: data.address,
                zipCode: data.zipCode,
                locations: data.locations,
                codeCountry: data.codeCountry,
                codeCity: data.codeCity,
                phone: data.phone,
                scacCode: data.scacCode,
                userId: data.userId,
            },
        });
        return NextResponse.json(newPartner);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
