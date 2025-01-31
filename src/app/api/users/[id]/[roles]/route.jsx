import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    const userRoles = await prisma.userRole.findMany({
        where: { userId: id },
        include: { role: true },
    });
    const response = NextResponse.json(userRoles);

    // Deshabilitar el caché completamente
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
}

export async function PUT(request, { params: { id } }) {
    try {
        const { roles } = await request.json();

        // Delete existing roles
        await prisma.userRole.deleteMany({
            where: { userId: id },
        });

        // Assign new roles
        const newUserRoles = roles.map((roleId) => ({
            userId: id,
            roleId,
        }));
        await prisma.userRole.createMany({ data: newUserRoles });

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
