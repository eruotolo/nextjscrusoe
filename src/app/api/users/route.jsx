import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

import cloudinary from '@/lib/cloudinary';

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
        return NextResponse.json(
            { success: false, message: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        //console.log('Data received:', formData);

        const file = formData.get('file');
        let imageUrl = null;

        if (file) {
            // Convertir el archivo a un buffer para subirlo a Cloudinary
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Subir el archivo a Cloudinary utilizando un stream
            const { secure_url } = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'profile' },
                    (error, result) => {
                        if (error) {
                            console.error('Error al subir la imagen a Cloudinary:', error);
                            return reject(error);
                        }
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            imageUrl = secure_url;
        }

        const name = formData.get('name');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const city = formData.get('city');
        const password = formData.get('password');

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                phone,
                address,
                city,
                image: imageUrl,
                password: hashedPassword,
                state: 1,
            },
        });

        //console.log('Nuevo Usuario:', newUser);

        if (newUser) {
            return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Error al crear el usuario' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in POST /api/users:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
