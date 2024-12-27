import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const currencyView = await prisma.currencies.findUnique({
            where: { id },
            select: {
                id: true,
                code: true,
                name: true,
                symbol: true,
            },
        });

        if (!currencyView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json(currencyView);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
