import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const getUsers = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                state: true,
                roles: {
                    select: {
                        id: true,
                        userId: true,
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                                state: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        revalidatePath('/api/users');
        const response = NextResponse.json(getUsers);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener los usuarios' });
    }
}

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('file');
        const name = data.get('name');
        const lastName = data.get('lastName');
        const email = data.get('email');
        const phone = data.get('phone');
        const address = data.get('address');
        const city = data.get('city');
        const password = data.get('password');

        if (!file || !name || !lastName || !email || !phone || !address || !city || !password) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = path.extname(file.name);
        const randomFileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(process.cwd(), 'public/profile', randomFileName);
        await writeFile(filePath, buffer);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                phone,
                address,
                city,
                image: randomFileName,
                password: hashedPassword,
                state: 1,
            },
        });

        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
