import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
                address: true,
                zipCode: true,
                locations: true,
                codeCountry: true,
                codeCity: true,
                phone: true,
                scacCode: true,
                creditInfoId: true,
                userId: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const response = NextResponse.json(getPartner);
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
        const newPostgres = await prisma.partner.create({
            data: {
                partnerTypeId: data.partnerTypeId,
                name: data.name,
                socialReazon: data.socialReazon,
                rut: data.rut,
                address: data.address,
                zipCode: data.zipCode,
                locations: data.locations,
                codeCountry: data.codeCountry,
                codeCity: data.codeCity,
                phone: data.phone,
                scacCode: data.scacCode,
                creditInfoId: data.creditInfoId,
                userId: data.userId,
            },
        });
        return NextResponse.json(newPostgres);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
