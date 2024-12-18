import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewPartnerContact = await prisma.partnerContact.findUnique({
            where: { id },
            select: {
                id: true,
                contactId: true,
                partnerId: true,
            },
        });

        if (!viewPartnerContact) {
            return notFound();
        }

        return NextResponse.json(viewPartnerContact);
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();

        const { id } = params;

        const updatePartnerContact = await prisma.partnerContact.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updatePartnerContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating:' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const deletePartnerContact = await prisma.partnerContact.delete({
            where: { id },
        });

        return NextResponse.json(deletePartnerContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
