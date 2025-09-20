export interface Prediccion {
 // alumnoId: number;
  //riesgo: string;          // Ej: "Alto", "Medio", "Bajo"
  //probabilidad: number;    // Ej: 0.85 (85%)
  //recomendacion: string;   // Texto con la recomendación
  // 👇 Si tu API trae más campos, los agregas aquí
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
}

