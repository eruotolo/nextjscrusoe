import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params: { id } }) {
    try {
        const supplierPartner = await prisma.partnerSupplierType.findMany({
            where: { partnerId: id },
            include: { supplierType: true },
        });

        const response = NextResponse.json(supplierPartner);
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
