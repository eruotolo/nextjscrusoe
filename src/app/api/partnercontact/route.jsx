import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const getPartnerContact = await prisma.partnerContact.findMany({
            select: {
                id: true,
                contactId: true,
                partnerId: true,
            },
        });

        const response = NextResponse.json(getPartnerContact);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'No se pudieron obtener:' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const newPartnerContact = await prisma.partnerContact.create({
            data: {
                contactId: data.contactId,
                partnerId: data.partnerId,
            },
        });
        return NextResponse.json(newPartnerContact);
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
