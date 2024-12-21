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
                partnerTypeId: true,
                name: true,
                rut: true,
                socialReazon: true,
                taxId: true,
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
        });

        if (!partnerView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json(partnerView);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        const data = await request.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const { partnerTypeId, codeCountry, codeCity, creditInfoId, ...res } = data;

        const updatePartner = await prisma.partner.update({
            where: { id },
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
                PartnerCreditInfo: {
                    connect: {
                        id: partnerTypeId,
                    },
                },
            },
        });

        return NextResponse.json(updatePartner);
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
        return NextResponse.json(removePartner);
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
