import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const roleView = await prisma.role.findUnique({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(roleView);
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
