const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const suc1 = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Centro',
      direccion: 'Av. Corrientes 1234',
      telefono: '011-4321-0000',
      horarioApertura: '09:00',
      horarioCierre: '19:00',
    },
  })
  const suc2 = await prisma.sucursal.create({
    data: {
      nombre: 'Sucursal Norte',
      direccion: 'Av. Cabildo 567',
      telefono: '011-4765-0000',
      horarioApertura: '09:00',
      horarioCierre: '18:30',
    },
  })

  await prisma.barbero.createMany({
    data: [
      { nombre: 'Carlos', apellido: 'López', telefono: '11-1111-1111', sucursalId: suc1.id },
      { nombre: 'Martín', apellido: 'García', telefono: '11-2222-2222', sucursalId: suc1.id },
      { nombre: 'Diego', apellido: 'Fernández', telefono: '11-3333-3333', sucursalId: suc2.id },
      { nombre: 'Pablo', apellido: 'Rodríguez', telefono: '11-4444-4444', sucursalId: suc2.id },
    ],
  })

  await prisma.servicio.createMany({
    data: [
      { tipo: 'Corte de cabello', precio: 3500, duracion: 30 },
      { tipo: 'Corte + Barba', precio: 5500, duracion: 50 },
      { tipo: 'Barba', precio: 2500, duracion: 20 },
      { tipo: 'Corte + Lavado', precio: 4500, duracion: 45 },
      { tipo: 'Tintura', precio: 8000, duracion: 90 },
    ],
  })

  console.log('Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
