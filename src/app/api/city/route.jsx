import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const searchQuery = searchParams.get('search') || '';

    try {
        const [cities, totalCities] = await Promise.all([
            prisma.city.findMany({
                where: {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { country: { name: { contains: searchQuery, mode: 'insensitive' } } },
                    ],
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
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
            }),
            prisma.city.count({
                where: {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { country: { name: { contains: searchQuery, mode: 'insensitive' } } },
                    ],
                },
            }),
        ]);

        const result = {
            data: cities,
            meta: {
                total: totalCities,
                page,
                pageSize,
                totalPages: Math.ceil(totalCities / pageSize),
            },
        };

        revalidatePath('/api/city');

        const response = NextResponse.json(result);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCity = await prisma.city.create({
            data: {
                name: data.name,
                countryCode: data.countryCode,
            },
        });
        return NextResponse.json(newCity);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
