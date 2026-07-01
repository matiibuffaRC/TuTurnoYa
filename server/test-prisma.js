const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        const id = 1;
        const nombre = "Mateo Editado";
        const apellido = undefined;
        
        const barbero = await prisma.barbero.findUnique({
            where: { id },
            include: { sucursal: true }
        });

        console.log("Found barbero:", barbero.id);

        const barberoActualizado = await prisma.barbero.update({
            where: { id },
            data: {
                nombre: nombre || barbero.nombre,
                apellido: apellido || barbero.apellido,
                usuario: {
                    update: {
                        nombre: `${nombre || barbero.nombre} ${apellido || barbero.apellido}`
                    }
                }
            },
            include: {
                sucursal: true,
                usuario: true
            },
        });
        
        console.log("Success");
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
run();
