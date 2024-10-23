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

        return NextResponse.json(newRole);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                {
                    message:
                        'Ya existe un rol con este nombre. Por favor, elige un nombre diferente.',
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
