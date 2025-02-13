import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get('partnerId');

        const getContact = await prisma.contact.findMany({
            where: partnerId ? { partnerId } : {},
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
                partnerId: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        revalidatePath('/api/contacts');

        const response = NextResponse.json(getContact);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

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
                partnerId: data.partnerId,
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
