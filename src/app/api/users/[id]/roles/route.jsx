import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    const userRoles = await prisma.userRole.findMany({
        where: { userId: Number(id) },
        include: { role: true },
    });
    return NextResponse.json(userRoles.map((userRole) => userRole.role));
}

export async function PUT(request, { params: { id } }) {
    const { roles } = await request.json();

    // Delete existing roles
    await prisma.userRole.deleteMany({
        where: { userId: Number(id) },
    });

    // Assign new roles
    const userRoles = roles.map((roleId) => ({
        userId: Number(id),
        roleId: Number(roleId),
    }));
    await prisma.userRole.createMany({ data: userRoles });

    return NextResponse.json({ message: 'Roles updated successfully' });
}
