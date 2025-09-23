export interface Alumno {
  id: number;
  nombreCompleto: string;
  matricula: string;
  fechaNacimiento: string;
  edad: number;
  estadoCivilId: number;
  estadoCivil: string;
  turnoId: number;
  turno: string;
  carreraId: number;
  carrera: string;
  activo: boolean;
  creadoEn: string;

  editando?:boolean;
}
