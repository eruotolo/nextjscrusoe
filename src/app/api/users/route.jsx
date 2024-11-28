import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    //return NextResponse.json({ message: 'Soy Un Moustro' });
    try {
        const users = await prisma.user.findMany({
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
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener los usuarios' });
    }
}

export async function POST(request) {
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
        return NextResponse.json({ success: false, message: 'All fields are required' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = path.extname(file.name);
    const randomFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(process.cwd(), 'public/profile', randomFileName);
    await writeFile(filePath, buffer);
    //console.log(`open ${filePath} to see the uploaded file`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            lastName,
            email,
            phone,
            address,
            city,
            image: randomFileName, // Guardar el nombre de archivo aleatorio
            password: hashedPassword,
            state: 1,
        },
    });

    return NextResponse.json({ success: true, user });
}
