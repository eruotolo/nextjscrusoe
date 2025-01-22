import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import cloudinary from '@/lib/cloudinary';

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

    if (contentType.includes('multipart/form-data')) {
        try {
            const formData = await request.formData();

            formData.forEach((value, key) => {
                data[key] = value;
            });

            const { password, file, ...rest } = data;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                rest.password = hashedPassword;
            }

            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const { secure_url } = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ folder: 'profile' }, (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        })
                        .end(buffer);
                });

                rest.image = secure_url;
            }

            const userUpdated = await prisma.user.update({
                where: {
                    id: Number.parseInt(id, 10),
                },
                data: rest,
            });

            const response = NextResponse.json(userUpdated);
            response.headers.set(
                'Cache-Control',
                'no-store, no-cache, must-revalidate, proxy-revalidate'
            );
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            return response;
        } catch (error) {
            console.error('Error in PUT /api/users:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
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
