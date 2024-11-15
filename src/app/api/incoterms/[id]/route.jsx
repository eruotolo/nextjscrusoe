import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const viewIncoterms = await prisma.incoterms.findUnique({
            where: {
                id: params.id,
            },
            include: {
                transportRelation: {
                    include: {
                        transportType: true,
                    },
                },
            },
        });

        return NextResponse.json(viewIncoterms);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updateIncoterms = await prisma.incoterms.update({
            where: {
                id: params.id,
            },
            data: data,
        });

        return NextResponse.json(updateIncoterms);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating incoterms' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        // Eliminar relaciones asociadas
        await prisma.incotermsTransport.deleteMany({
            where: {
                incotermsId: params.id,
            },
        });

        const deleteIncoterms = await prisma.incoterms.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json(deleteIncoterms);
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting incoterms' }, { status: 500 });
    }
}
