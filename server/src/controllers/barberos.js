const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// GET /barberos - Listar todos los barberos
const listarBarberos = async (req, res) => {
    try {
        const { sucursalId, activo } = req.query;
        const where = {};

        if (sucursalId) {
            where.sucursalId = Number(sucursalId);
        }
        if (activo !== undefined) {
            where.activo = activo === 'true';
        } else {
            where.activo = true; // Por defecto, mostrar solo activos
        }

        const barberos = await prisma.barbero.findMany({
            where,
            include: { sucursal: true },
        });
        return res.status(200).json(barberos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al listar los barberos' });
    }
};

// GET /barberos/:id - Obtener un barbero por su ID
const obtenerBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) },
            include: { sucursal: true, usuario: true, turnos: true }
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }
        return res.status(200).json(barbero);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el barbero' });
    }
};

// POST /barberos - Crear barbero y su cuenta de Usuario de forma simultánea
const crearBarbero = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, password, sucursalId, horarioEntrada, horarioSalida } = req.body;

        // 1. Verificar que la sucursal existe
        const sucursal = await prisma.sucursal.findUnique({
            where: { id: Number(sucursalId) },
        });
        if (!sucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }

        // 2. Verificar que el email no esté duplicado en Usuarios
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya se encuentra registrado' });
        }

        if (!password) {
            return res.status(400).json({ error: 'La contraseña es obligatoria' });
        }
        const hash = bcrypt.hashSync(password, 10);

        // 3. Creación conjunta (Transacción Atómica usando relaciones anidadas de Prisma)
        const nuevoBarbero = await prisma.barbero.create({
            data: {
                nombre,
                apellido,
                telefono,
                email,
                activo: true,
                horarioEntrada: horarioEntrada || '09:00',
                horarioSalida: horarioSalida || '18:00',
                sucursal: {
                    connect: { id: Number(sucursalId) }
                },
                usuario: {
                    create: {
                        nombre: `${nombre} ${apellido}`,
                        email,
                        password: hash,
                        rol: 'BARBERO'
                    }
                }
            },
            include: {
                sucursal: true,
                usuario: true 
            },
        });

        return res.status(201).json(nuevoBarbero);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear barbero y su cuenta de usuario' });
    }
};

// PUT /barberos/:id - Actualizar datos del barbero
const actualizarBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, sucursalId, activo, horarioEntrada, horarioSalida } = req.body;

        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) },
            include: { sucursal: true }
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }

        let sucursal = barbero.sucursal;

        if (sucursalId) {
            sucursal = await prisma.sucursal.findUnique({
                where: { id: Number(sucursalId) },
            });
            if (!sucursal) {
                return res.status(404).json({ error: 'Sucursal no encontrada' });
            }
        }

        const newHorarioEntrada = horarioEntrada || barbero.horarioEntrada;
        const newHorarioSalida = horarioSalida || barbero.horarioSalida;

        if (newHorarioEntrada >= newHorarioSalida) {
            return res.status(400).json({ error: 'El horario de entrada debe ser anterior al horario de salida' });
        }

        // Validar que no se extienda más allá del horario de la sucursal
        if (newHorarioSalida > sucursal.horarioCierre) {
            return res.status(400).json({
                error: `El horario de salida no puede ser posterior al cierre de la sucursal (${sucursal.horarioCierre})`
            });
        }
        if (newHorarioEntrada < sucursal.horarioApertura) {
            return res.status(400).json({
                error: `El horario de entrada no puede ser anterior a la apertura de la sucursal (${sucursal.horarioApertura})`
            });
        }

        // Actualizamos el barbero. Si cambia nombre/apellido, también actualizamos el nombre en su Usuario asociado.
        const barberoActualizado = await prisma.barbero.update({
            where: { id: Number(id) },
            data: {
                nombre: nombre || barbero.nombre,
                apellido: apellido || barbero.apellido,
                telefono: telefono || barbero.telefono,
                sucursalId: sucursalId ? Number(sucursalId) : barbero.sucursalId,
                activo: activo !== undefined ? activo : barbero.activo,
                horarioEntrada: newHorarioEntrada,
                horarioSalida: newHorarioSalida,
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
        return res.status(200).json(barberoActualizado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar barbero' });
    }
};

// DELETE /barberos/:id - Eliminar al barbero seleccionado (soft delete)
const eliminarBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) },
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }

        const barberoActualizado = await prisma.barbero.update({
            where: { id: Number(id) },
            data: { activo: false },
            include: { sucursal: true }
        });
        return res.status(200).json({ mensaje: 'Barbero desactivado correctamente', barbero: barberoActualizado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar barbero' });
    }
};

// PATCH /barberos/:id/agenda - Abrir/cerrar agenda
const toggleAgenda = async (req, res) => {
    try {
        const { id } = req.params;
        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) }
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }

        const barberoActualizado = await prisma.barbero.update({
            where: { id: Number(id) },
            data: { agendaAbierta: !barbero.agendaAbierta },
            include: { sucursal: true }
        });
        return res.status(200).json(barberoActualizado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al cambiar estado de agenda' });
    }
};

// PATCH /barberos/:id/horarios - Actualizar horarios de entrada/salida
const actualizarHorarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { horarioEntrada, horarioSalida } = req.body;

        if (!horarioEntrada || !horarioSalida) {
            return res.status(400).json({ error: 'horarioEntrada y horarioSalida son obligatorios' });
        }

        if (horarioEntrada >= horarioSalida) {
            return res.status(400).json({ error: 'El horario de entrada debe ser anterior al horario de salida' });
        }

        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) },
            include: { sucursal: true }
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }

        if (horarioSalida > barbero.sucursal.horarioCierre) {
            return res.status(400).json({
                error: `El horario de salida no puede ser posterior al cierre de la sucursal (${barbero.sucursal.horarioCierre})`
            });
        }

        if (horarioEntrada < barbero.sucursal.horarioApertura) {
            return res.status(400).json({
                error: `El horario de entrada no puede ser anterior a la apertura de la sucursal (${barbero.sucursal.horarioApertura})`
            });
        }

        const barberoActualizado = await prisma.barbero.update({
            where: { id: Number(id) },
            data: {
                horarioEntrada,
                horarioSalida,
            },
            include: { sucursal: true },
        });
        return res.status(200).json(barberoActualizado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar horarios' });
    }
};

// GET /barberos/:id/servicios - Servicios que ofrece el barbero
const getServiciosBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(id) },
            include: { servicios: true },
        });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }
        return res.status(200).json(barbero.servicios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener servicios del barbero' });
    }
};

// PATCH /barberos/:id/servicios - Actualizar selección de servicios del barbero
const setServiciosBarbero = async (req, res) => {
    try {
        const { id } = req.params;
        const { servicioIds } = req.body;

        if (!Array.isArray(servicioIds)) {
            return res.status(400).json({ error: 'servicioIds debe ser un array' });
        }

        const barbero = await prisma.barbero.findUnique({ where: { id: Number(id) } });
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado' });
        }

        const barberoActualizado = await prisma.barbero.update({
            where: { id: Number(id) },
            data: {
                servicios: {
                    set: servicioIds.map((sid) => ({ id: Number(sid) })),
                },
            },
            include: { servicios: true },
        });
        return res.status(200).json(barberoActualizado.servicios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar servicios del barbero' });
    }
};

// EXPORTACIÓN DE TODOS LOS MÉTODOS
module.exports = {
    listarBarberos,
    obtenerBarbero,
    crearBarbero,
    actualizarBarbero,
    eliminarBarbero,
    toggleAgenda,
    actualizarHorarios,
    getServiciosBarbero,
    setServiciosBarbero,
};
