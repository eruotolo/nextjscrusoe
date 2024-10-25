const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function seed() {
    console.log('Creando roles, usuarios y relaciones...');

    const SUPER_ADMIN = 1;
    const ADMIN = 2;

    // Crear roles
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

    // Crear usuario super admin
    const superAdmin = await prisma.user.create({
        data: {
            email: process.env.SUPER_EMAIL ?? 'hola@crowadvance.com',
            name: 'Edgardo',
            lastName: 'Ruotolo',
            phone: '+56967553841',
            address: 'Antonio Guarategua Lebe S/N',
            city: 'Castro',
            password: userPassHash,
            image: 'perfil-default.jpg',
        },
    });

    // Crear relación usuario-rol
    const userRole = await prisma.userRole.create({
        data: {
            userId: superAdmin.id,
            roleId: SUPER_ADMIN,
        },
    });

    // Lista de archivos SQL a ejecutar
    const sqlFiles = [
        'role.sql',
        'user.sql',
        'userrole.sql',
        'country.sql',
        'city.sql',
        'airports.sql',
        'shippingPorts.sql',
    ];

    // Ejecutar archivos SQL
    for (const file of sqlFiles) {
        const filePath = path.join(__dirname, '..', 'sql', file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Dividir el contenido del archivo en comandos individuales
        const commands = sql.split(';').filter((command) => command.trim() !== '');

        // Ejecutar cada comando por separado
        for (const command of commands) {
            await prisma.$executeRawUnsafe(command);
        }
    }

    // Desconectar Prisma
    await prisma.$disconnect();
}

seed()
    .catch((error) => {
        console.error('Error al ejecutar la semilla:', error);
        process.exit(1);
    })
    .finally(() => {
        console.log('Semilla completada.');
    });
