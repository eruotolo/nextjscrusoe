import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { get } from 'react-hook-form';

export async function GET() {
    try {
        const getSupplier = await prisma.supplierType.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const response = NextResponse.json(getSupplier);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'No se pudieron obtener:' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newSupplier = await prisma.supplierType.create({
            data: {
                name: data.name,
            },
        });

        return NextResponse.json(newSupplier);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                {
                    message:
                        'Ya existe un item con este nombre. Por favor, elige un nombre diferente.',
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
