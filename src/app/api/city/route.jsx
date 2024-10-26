import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            include: {
                country: true,
            },
        });
        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error city:', error);
        return NextResponse.json({ error: 'Failed get city' }, { status: 500 });
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
