import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

import nodemailer from 'nodemailer';

// Reemplaza con tus credenciales SMTP de Brevo
const SMTP_HOST = 'smtp-relay.brevo.com';
const SMTP_PORT = 587;

// Usa las variables de entorno
const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

function generateRandomPassword(length = 12) {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(request) {
    try {
        const { email } = await request.json(); // Analizar el cuerpo de la solicitud
        // console.log('Request data received datos:', email);

        const user = await prisma.user.findUnique({
            where: { email },
        });
        // console.log('Datos del usuario: ', user);

        const newPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'Nuevo Password <noreply@sistema.cl>',
            to: email,
            subject: 'Nuevo Password',
            text: `Tu nuevo password es: ${newPassword}`,
            html: `
            <p>Hola,</p>
            <p>Tiene un nuevo mensaje del Sistema.</p>
            <p>Email: ${email}.</p>
            <p>Nuevo Password: <b>${newPassword}</b></p>
        `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Password updated and email sent' });
    } catch (error) {
        console.error('Error parsing request data:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
