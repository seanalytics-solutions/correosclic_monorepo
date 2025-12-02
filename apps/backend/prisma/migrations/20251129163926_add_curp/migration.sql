/*
  Warnings:

  - Added the required column `curp` to the `asignaciones_historial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_conductor` to the `asignaciones_historial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "asignaciones_historial" ADD COLUMN     "curp" VARCHAR(18) NOT NULL,
ADD COLUMN     "nombre_conductor" VARCHAR(255) NOT NULL;
