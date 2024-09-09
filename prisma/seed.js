// importando PrismaClient
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

// Instanciando PrismaClient
const prisma = new PrismaClient();

async function seed() {
    console.log('Creando roles, usuarios y relaciones...');

    const SUPER_ADMIN = 1;
    const ADMIN = 2;

    // Crear la categoría "Administrador"
    const superRole = await prisma.role.create({
        data: {
            id: SUPER_ADMIN,
            name: 'Super Administrador',
        },
    });

    const adminRole = await prisma.role.create({
        data: {
            id: ADMIN,
            name: 'Administrador',
        },
    });

    const userPass = process.env.SUPER_PASSWORD ?? 'Guns026772';
    const userPassHash = await hash(userPass, 10);

    const superAdmin = await prisma.user.create({
        data: {
            email: process.env.SUPER_EMAIL ?? 'hola@crowadvance.com',
            name: 'Edgardo',
            lastName: 'Ruotolo',
            phone: '+56967553841',
            address: 'Antonio Guarategua Lebe S/N',
            city: 'Castro',
            password: userPassHash,
        },
    });

    const userRole = await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: SUPER_ADMIN,
        },
    });

    // Fin de la función de semillas
    await prisma.$disconnect();
}

seed()
    .catch((error) => {
        console.error('Error al ejecutar la semilla:', error);
    })
    .finally(() => {
        console.log('Semilla completada.');
    });
