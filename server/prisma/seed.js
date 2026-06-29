const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando el Seed ---');

  // 1. Limpiar datos viejos en orden inverso a las dependencias
  await prisma.turno.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.servicio.deleteMany({});
  await prisma.barbero.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.sucursal.deleteMany({});
  console.log('Base de datos limpia.');

  // Hashes de contraseñas para los entornos de prueba
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const barberoPasswordHash = bcrypt.hashSync('barbero123', 10);

  // 2. Crear Sucursales por defecto
  const sucCentro = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Centro',
      direccion: 'Av. Corrientes 1234',
      telefono: '011-4321-0000',
      horarioApertura: '09:00',
      horarioCierre: '19:00',
    },
  });
  console.log(`Sucursal creada: ${sucCentro.nombre}`);

  const sucNorte = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Norte',
      direccion: 'Av. Cabildo 567',
      telefono: '011-4765-0000',
      horarioApertura: '09:00',
      horarioCierre: '18:30',
    },
  });
  console.log(`Sucursal creada: ${sucNorte.nombre}`);

  // 3. Crear Servicios
  await prisma.servicio.createMany({
    data: [
      { tipo: 'Corte de cabello', precio: 15000, duracion: 30 },
      { tipo: 'Corte + Barba', precio: 18000, duracion: 50 },
      { tipo: 'Barba', precio: 4000, duracion: 20 },
      { tipo: 'Corte + Lavado', precio: 20000, duracion: 45 },
      { tipo: 'Tintura', precio: 70000, duracion: 90 },
    ],
  });
  console.log('Servicios creados.');

  // 4. Crear un Usuario Super Administrador (no vinculado a ningún barbero)
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Admin General',
      email: 'admin@tuturnoya.com',
      password: adminPasswordHash,
      rol: 'SUPER_ADMIN',
    },
  });
  console.log(`Usuario super administrador creado: ${admin.email}`);

  // 5. Crear Barberos con sus Usuarios asociados de forma anidada
  const barberosData = [
    {
      nombre: 'Mateo',
      apellido: 'Gomez',
      telefono: '3564112233',
      email: 'mateo@tuturnoya.com',
      horarioEntrada: '09:00',
      horarioSalida: '19:00',
      sucursalId: sucCentro.id,
    },
    {
      nombre: 'Carlos',
      apellido: 'López',
      telefono: '11-1111-1111',
      email: 'carlos@tuturnoya.com',
      horarioEntrada: '09:00',
      horarioSalida: '19:00',
      sucursalId: sucCentro.id,
    },
    {
      nombre: 'Martín',
      apellido: 'García',
      telefono: '11-2222-2222',
      email: 'martin@tuturnoya.com',
      horarioEntrada: '09:00',
      horarioSalida: '19:00',
      sucursalId: sucCentro.id,
    },
    {
      nombre: 'Diego',
      apellido: 'Fernández',
      telefono: '11-3333-3333',
      email: 'diego@tuturnoya.com',
      horarioEntrada: '09:00',
      horarioSalida: '18:30',
      sucursalId: sucNorte.id,
    },
  ];

  const todosLosServicios = await prisma.servicio.findMany({ select: { id: true } });

  for (const b of barberosData) {
    const barbero = await prisma.barbero.create({
      data: {
        nombre: b.nombre,
        apellido: b.apellido,
        telefono: b.telefono,
        email: b.email,
        activo: true,
        horarioEntrada: b.horarioEntrada,
        horarioSalida: b.horarioSalida,
        sucursal: {
          connect: { id: b.sucursalId },
        },
        usuario: {
          create: {
            nombre: `${b.nombre} ${b.apellido}`,
            email: b.email,
            password: barberoPasswordHash,
            rol: 'BARBERO',
          },
        },
        servicios: {
          connect: todosLosServicios,
        },
      },
    });
    console.log(`Barbero y cuenta creados para: ${barbero.nombre} ${barbero.apellido}`);
  }

  console.log('--- Seed completado con éxito ---');
}

main()
  .catch((e) => {
    console.error('Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
