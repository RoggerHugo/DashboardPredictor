// src/app/models/alumno.model.ts
export interface Alumno {
  id: number;
  nombreCompleto: string;
  matricula: string;
  fechaNacimiento: string;
  edad: number;
  estadoCivil: string;
  turno: string;
  carrera: string;
  activo: boolean;
  creadoEn: string;

  editando?:boolean;
}
