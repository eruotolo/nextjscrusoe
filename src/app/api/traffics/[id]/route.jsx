import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const viewTraffics = await prisma.traffics.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                code: true,
                modifiedBy: true,
            },
        });

        if (!viewTraffics) {
            notFound();
        }

        const response = NextResponse.json(viewTraffics);
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
        const updateTraffics = await prisma.traffics.update({
            where: { id },
            data: data,
        });

        return NextResponse.json(updateTraffics);
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

        const deleteTraffics = await prisma.traffics.delete({
            where: { id },
        });

        return NextResponse.json(deleteTraffics);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting:' }, { status: 500 });
    }
}
