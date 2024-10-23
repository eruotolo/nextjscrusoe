import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const countries = await prisma.country.findMany();

        // Revalidate the path
        revalidatePath('/api/country');

        // Set cache headers
        const response = NextResponse.json(countries);
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return response;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCountry = await prisma.country.create({
            data: {
                name: data.name,
                code: data.code,
            },
        });

        const { ...country } = newCountry;
        return NextResponse.json(country);
    } catch (error) {
        if (error.code === 'P2002') {
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
