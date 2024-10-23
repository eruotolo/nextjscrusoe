import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const viewShippingPort = await prisma.shippingPorts.findUnique({
        where: {
            id: Number(params.id),
        },
        include: {
            country: true,
        },
    });
    return NextResponse.json(viewShippingPort);
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { countryCode, ...rest } = data;

        const shippingPortsUpdated = await prisma.shippingPorts.update({
            where: {
                id: Number(params.id),
            },
            data: {
                ...rest,
                country: {
                    connect: {
                        code: countryCode,
                    },
                },
            },
        });
        return NextResponse.json(shippingPortsUpdated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update shippingport' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const removeShippingPort = await prisma.shippingPorts.delete({
        where: {
            id: Number(params.id),
        },
    });
    return NextResponse.json(removeShippingPort);
}
