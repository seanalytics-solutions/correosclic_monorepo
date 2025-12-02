import { z } from 'zod';

export const ProfileUserSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  numero: z.string().nullable().optional(),
  estado: z.string(),
  ciudad: z.string(),
  fraccionamiento: z.string(),
  calle: z.string(),
  codigoPostal: z.string(),
  imagen: z.string(),
});
export const ProfilesSchema = z.array(ProfileUserSchema);
export type SchemaProfileUser = z.infer<typeof ProfileUserSchema>;
