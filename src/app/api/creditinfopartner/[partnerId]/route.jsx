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

        return NextResponse.json(creditInfoView);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching partner' }, { status: 500 });
    }
}
