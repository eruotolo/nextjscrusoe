import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
                partnerType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                name: true,
                socialReazon: true,
                taxId: true,
                address: true,
                zipCode: true,
                places: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            /*include: {
                PartnerType: {},
                PartnerContact: {
                    include: {
                        contact: {
                            include: {
                                contactType: true,
                            },
                        },
                    },
                },
            },*/
        });

        if (!partnerView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json(partnerView);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
