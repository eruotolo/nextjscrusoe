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

        return NextResponse.json(newCountry);
    } catch (error) {
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
