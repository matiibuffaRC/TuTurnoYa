const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
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

  const hash = (pw) => bcrypt.hashSync(pw, 10)

  await prisma.barbero.createMany({
    data: [
      { nombre: 'Carlos', apellido: 'López', telefono: '11-1111-1111', email: 'carlos@tuturnoya.com', password: hash('carlos123'), sucursalId: suc1.id },
      { nombre: 'Martín', apellido: 'García', telefono: '11-2222-2222', email: 'martin@tuturnoya.com', password: hash('martin123'), sucursalId: suc1.id },
      { nombre: 'Diego', apellido: 'Fernández', telefono: '11-3333-3333', email: 'diego@tuturnoya.com', password: hash('diego123'), sucursalId: suc2.id },
      { nombre: 'Pablo', apellido: 'Rodríguez', telefono: '11-4444-4444', email: 'pablo@tuturnoya.com', password: hash('pablo123'), sucursalId: suc2.id },
    ],
  })

  await prisma.servicio.createMany({
    data: [
      { tipo: 'Corte de cabello', precio: 15000, duracion: 30 },
      { tipo: 'Corte + Barba', precio: 18000, duracion: 50 },
      { tipo: 'Barba', precio: 4000, duracion: 20 },
      { tipo: 'Corte + Lavado', precio: 20000, duracion: 45 },
      { tipo: 'Tintura', precio: 70000, duracion: 90 },
    ],
  })

  console.log('Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
