import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET(request, { params }) {
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

    return NextResponse.json(userView);
}

export async function DELETE(request, { id }) {
    try {
        const userRemoved = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        return NextResponse.json(userRemoved);
    } catch (error) {
        return NextResponse.json(error.message);
    }
}

export async function PUT(request, { params: { id } }) {
    let data = {};

    const contentType = request.headers.get('Content-Type');

    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const { password, file, ...rest } = data;

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

        data = rest;
    } else if (contentType.includes('application/json')) {
        data = await request.json();

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
        }
    } else {
        return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 415 });
    }

    try {
        const userUpdated = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: data,
        });
        return NextResponse.json(userUpdated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
