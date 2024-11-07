import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    const viewShippingPort = await prisma.shippingPorts.findUnique({
        where: {
            id: params.id,
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
        const { codeCountry, ...res } = data;

        const updateShippingPort = await prisma.shippingPorts.update({
            where: {
                id: params.id,
            },
            data: {
                ...res,
                country: {
                    connect: {
                        code: codeCountry,
                    },
                },
            },
        });
        return NextResponse.json(updateShippingPort);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update shippingport' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const removeShippingPort = await prisma.shippingPorts.delete({
            where: {
                id: params.id,
            },
        });
        return NextResponse.json(removeShippingPort);
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
