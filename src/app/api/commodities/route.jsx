import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const commodities = await prisma.commodities.findMany({
            select: {
                id: true,
                name: true,
                nameEnglish: true,
                commoditiesSection: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Revalidate the path
        revalidatePath('/api/commodities');

        const response = NextResponse.json(commodities);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        if (
            !data.name ||
            !data.nameEnglish ||
            !data.dangerous ||
            !data.perishable ||
            !data.tariffPositional ||
            !data.commoditiesSectionId
        ) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newCommodities = await prisma.commodities.create({
            data: {
                name: data.name,
                nameEnglish: data.nameEnglish,
                dangerous: data.dangerous,
                perishable: data.perishable,
                tariffPositional: data.tariffPositional,
                commoditiesSectionId: data.commoditiesSectionId,
            },
        });

        revalidatePath('/api/commodities');
        return NextResponse.json(newCommodities, { status: 201 });
    } catch (error) {
        console.error('Error creating:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}