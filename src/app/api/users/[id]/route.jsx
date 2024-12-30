import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request, { params }) {
    try {
        //return NextResponse.json({ message: 'Obtengo un usuario' });

        const userView = await prisma.user.findUnique({
            where: { id: Number(params.id) },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        const response = NextResponse.json(userView);
        // Deshabilitar el caché completamente
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching:' }, { status: 500 });
    }
}

export async function DELETE(request, { id }) {
    try {
        const userRemoved = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        const response = NextResponse.json(userRemoved);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        return NextResponse.json(error.message);
    }
}

export async function PUT(request, { params: { id } }) {
    let data = {};

    const contentType = request.headers.get('Content-Type');
    //console.log('Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const { password, file, ...rest } = data;
        //console.log('Form Data:', data);

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            rest.password = hashedPassword;
        }

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExtension = path.extname(file.name);
            const randomFileName = `${uuidv4()}${fileExtension}`;
            const filePath = path.join(process.cwd(), 'public/profile', randomFileName);
            await writeFile(filePath, buffer);
            rest.image = randomFileName; // Update the image field with the new file name
        }

        // Convert state to integer if it exists
        if (rest.state) {
            rest.state = parseInt(rest.state, 10);
        }

        data = rest;
    } else if (contentType.includes('application/json')) {
        data = await request.json();
        //console.log('JSON Data:', data);

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
        }

        // Convert state to integer if it exists
        if (data.state) {
            data.state = parseInt(data.state, 10);
        }
    } else {
        return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
    }

    try {
        //console.log('Data to update:', data);
        const userUpdated = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: data,
        });
        //console.log('User updated:', userUpdated);

        const response = NextResponse.json(userUpdated);
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        //console.error('Error updating user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
