import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewCommoditiesSection = await prisma.commoditiesSection.findMany({
            where: { id },
            select: {
                id: true,
                name: true,
            },
        });

        if (!viewCommoditiesSection) {
            notFound();
        }

        const response = NextResponse.json(viewCommoditiesSection);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updateCommoditiesSection = await prisma.commoditiesSection.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        return NextResponse.json(updateCommoditiesSection);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating:' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const deleteCommoditiesService = await prisma.commoditiesSection.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(deleteCommoditiesService);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
