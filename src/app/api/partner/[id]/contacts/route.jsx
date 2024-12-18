import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    try {
        const partnerContact = await prisma.partnerContact.findMany({
            where: { partnerId: id },
            include: {
                contact: {
                    include: {
                        contactType: true,
                    },
                },
            },
        });

        return NextResponse.json(partnerContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating' }, { status: 500 });
    }
}

export async function POST(request, { params: { id } }) {
    try {
        const { newContactData } = await request.json();

        const newContact = await prisma.partnerContact.create({
            data: {
                ...newContactData,
                partnerId: id,
            },
        });

        return NextResponse.json(newContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating contact' }, { status: 500 });
    }
}

export async function PUT(request, { params: { id } }) {
    try {
        const { contactId, updatedData } = await request.json();

        const updatedContact = await prisma.partnerContact.update({
            where: { id: contactId },
            data: updatedData,
        });

        return NextResponse.json(updatedContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
    }
}

export async function DELETE(request, { params: { id } }) {
    try {
        const { contactId } = await request.json();

        await prisma.partnerContact.delete({
            where: { id: contactId },
        });

        return NextResponse.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting contact' }, { status: 500 });
    }
}
