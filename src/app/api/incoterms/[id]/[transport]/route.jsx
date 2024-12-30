import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    try {
        const incotermsTransport = await prisma.incotermsTransport.findMany({
            where: { incotermsId: id },
            include: { transportType: true },
        });

        const response = NextResponse.json(incotermsTransport);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
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

        const response = NextResponse.json({
            message: 'Relaciones se actualizaron correctamente',
        });

        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Error actualizando las relaciones de transporte:', error);
        return NextResponse.json(
            { error: 'Error actualizando las relaciones de transporte' },
            { status: 500 }
        );
    }
}
