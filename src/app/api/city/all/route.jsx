import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';

    try {
        const cities = await prisma.city.findMany({
            where: {
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { country: { name: { contains: searchQuery, mode: 'insensitive' } } },
                ],
            },
            include: {
                country: {
                    select: {
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error fetching all cities:', error);
        return NextResponse.json({ error: 'Failed to fetch all cities' }, { status: 500 });
    }
}
