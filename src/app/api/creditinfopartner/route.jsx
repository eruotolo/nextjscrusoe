import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const getCreditInfoPartner = await prisma.partnerCreditInfo.findMany({
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

        const response = NextResponse.json(getCreditInfoPartner);
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
        if (
            !data.freightCreditTerm ||
            !data.freightCreditAmount ||
            !data.freightCreditCurrency ||
            !data.termCreditExpenses ||
            !data.termCreditAmount ||
            !data.termCreditCurrency ||
            !data.incomeAccountNumber ||
            !data.outgoingAccountNumber ||
            !data.partnerId
        ) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        const newCreditInfo = await prisma.partnerCreditInfo.create({
            data: {
                freightCreditTerm: data.freightCreditTerm,
                freightCreditAmount: data.freightCreditAmount,
                freightCreditCurrency: data.freightCreditCurrency,
                termCreditExpenses: data.termCreditExpenses,
                termCreditAmount: data.termCreditAmount,
                termCreditCurrency: data.termCreditCurrency,
                incomeAccountNumber: data.incomeAccountNumber,
                outgoingAccountNumber: data.outgoingAccountNumber,
                partnerId: data.partnerId,
            },
        });

        return NextResponse.json(newCreditInfo, { status: 201 });
    } catch (error) {
        console.error('Error creating:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'Unique constraint violation.' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
