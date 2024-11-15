import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    try {
        const incotermsTransport = await prisma.incotermsTransport.findMany({
            where: { incotermsId: id },
            include: { transportType: true },
        });
        return NextResponse.json(incotermsTransport);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching incoterms transport relations' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params: { id } }) {
    try {
        const { transportRelations } = await request.json();

        // Eliminar relaciones existentes
        await prisma.incotermsTransport.deleteMany({
            where: { incotermsId: id },
        });

        // Crear nuevas relaciones
        const newRelations = transportRelations.map((transportTypeId) => ({
            incotermsId: id,
            transportTypeId,
        }));
        await prisma.incotermsTransport.createMany({ data: newRelations });

        return NextResponse.json({
            message: 'Relaciones de transporte actualizadas correctamente',
        });
    } catch (error) {
        console.error('Error actualizando las relaciones de transporte:', error);
        return NextResponse.json(
            { error: 'Error actualizando las relaciones de transporte' },
            { status: 500 }
        );
    }
}
