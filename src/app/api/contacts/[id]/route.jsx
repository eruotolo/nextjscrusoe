import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewContact = await prisma.contact.findUnique({
            where: { id },
            select: {
                id: true,
                contactTypeId: true,
                name: true,
                email: true,
                phone: true,
                partnerId: true,
            },
        });

        if (!viewContact) {
            notFound();
        }

        const response = NextResponse.json(viewContact);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const data = await request.json();
        const updateContact = await prisma.contact.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updateContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const deleteContact = await prisma.contact.delete({
            where: { id },
        });

        return NextResponse.json(deleteContact);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
