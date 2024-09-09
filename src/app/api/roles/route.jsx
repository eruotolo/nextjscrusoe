import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newRole = await prisma.role.create({
            data: {
                name: data.name,
                state: 1,
            },
        });

        const { ...role } = newRole;
        return NextResponse.json(role);
    } catch (error) {
        if (error.code === 'P2002') {
            // Este código de error corresponde a una violación de restricción de unicidad en Prisma
            return NextResponse.json(
                {
                    message: 'Violación de restricción de unicidad en los campos.',
                },
                {
                    status: 400,
                }
            );
        }
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
