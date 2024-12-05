import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function GET(request, { params }) {
    try {
        const viewRole = await prisma.role.findUnique({
            where: {
                id: Number(params.id),
            },
            select: {
                id: true,
                name: true,
                state: true,
            },
        });

        if (!viewRole) {
            notFound();
        }

        const response = NextResponse.json(viewRole);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Failed to fetch:' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const data = await request.json();
    const roleUpdate = await prisma.role.update({
        where: {
            id: Number(params.id),
        },
        data: data,
    });
    return NextResponse.json(roleUpdate);
}
