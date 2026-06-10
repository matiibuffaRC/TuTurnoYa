-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "horarioApertura" TEXT NOT NULL,
    "horarioCierre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Barbero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "sucursalId" INTEGER NOT NULL,
    CONSTRAINT "Barbero_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "duracion" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "clienteId" INTEGER NOT NULL,
    "barberoId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Turno_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Turno_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Turno_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
