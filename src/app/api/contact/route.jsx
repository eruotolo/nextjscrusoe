import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const getContact = await prisma.contact.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                contactType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        revalidatePath('/api/contact');
        const response = NextResponse.json(getContact);
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
        if (!data.name || !data.email || !data.phone || !data.contactTypeId) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newContact = await prisma.contact.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                contactTypeId: data.contactTypeId,
            },
        });

        revalidatePath('/api/contact');
        return NextResponse.json(newContact, { status: 201 });
    } catch (error) {
        console.error('Error creating:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
