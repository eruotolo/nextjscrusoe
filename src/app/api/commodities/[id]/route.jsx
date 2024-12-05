import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewCommodities = await prisma.commodities.findUnique({
            where: { id },

            select: {
                id: true,
                name: true,
                nameEnglish: true,
                dangerous: true,
                perishable: true,
                tariffPositional: true,
                commoditiesSectionId: true,
            },
        });

        if (!viewCommodities) {
            return notFound();
        }

        return NextResponse.json(viewCommodities);
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { id } = params;
        const updateCommodities = await prisma.commodities.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updateCommodities);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating:' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const deleteCommodities = await prisma.commodities.delete({
            where: { id },
        });

        return NextResponse.json(deleteCommodities);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
