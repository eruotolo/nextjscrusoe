import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const { partnerId } = params;

        if (!partnerId) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const creditInfoView = await prisma.partnerCreditInfo.findUnique({
            where: { partnerId },
            select: {
                id: true,
                freightCreditTerm: true,
                freightCreditAmount: true,
                freightCreditCurrency: true,
                termCreditExpenses: true,
                termCreditAmount: true,
                termCreditCurrency: true,
                incomeAccountNumber: true,
                outgoingAccountNumber: true,
                partnerId: true,
            },
        });

        if (!creditInfoView) {
            return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
        }

        const response = NextResponse.json(creditInfoView);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
