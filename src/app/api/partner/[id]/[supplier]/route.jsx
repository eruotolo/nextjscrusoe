import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    try {
        const supplierPartner = await prisma.partnerSupplierType.findMany({
            where: { partnerId: id },
            include: { supplierType: true },
        });

        const response = NextResponse.json(supplierPartner);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}

export async function PUT(request, { params: { id } }) {
    try {
        const { supplierRelations } = await request.json();

        await prisma.partnerSupplierType.deleteMany({
            where: { partnerId: id },
        });

        const newRelations = supplierRelations.map((supplierTypeId) => ({
            partnerId: id,
            supplierTypeId,
        }));
        await prisma.partnerSupplierType.createMany({ data: newRelations });

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
        console.error('Error actualizando las relaciones:', error);
        return NextResponse.json({ error: 'Error actualizando las relaciones' }, { status: 500 });
    }
}
