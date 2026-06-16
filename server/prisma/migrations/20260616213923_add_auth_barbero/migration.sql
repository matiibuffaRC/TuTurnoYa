/*
  Warnings:

  - Added the required column `email` to the `Barbero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Barbero` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Barbero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "sucursalId" INTEGER NOT NULL,
    CONSTRAINT "Barbero_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Barbero" ("activo", "apellido", "id", "nombre", "sucursalId", "telefono") SELECT "activo", "apellido", "id", "nombre", "sucursalId", "telefono" FROM "Barbero";
DROP TABLE "Barbero";
ALTER TABLE "new_Barbero" RENAME TO "Barbero";
CREATE UNIQUE INDEX "Barbero_email_key" ON "Barbero"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
