export interface StudentDetail {
   alumnoId: number;
    nombreCompleto:string;
    matricula: string;
    activo: boolean;
    creadoEn: string;
    estadoCivil: string;
    turno: string;
    carrera: string;
    minutosDetalle: number;
    promedioDetalle: number;
    tieneHijos: boolean;
    cuentaEquipoComputo: boolean;
    viveCon: string;
    apoyoFinanciero: string;
    situacionActual: string;
    situacionEstudiantil: string;
    observacionesDetalle: string;
    minutosEncuesta: number;
    promedioEncuesta: number;
    problemasEconomicos: boolean;
    equipoComputo: boolean;
    consideroAbandonar: string;
    metodosOProblemasAprendizaje: string;
    fortalezasDebilidades: string;
    tratamientoMedico: string;
    consumoNicotina: string;
    consumoAlcohol: string;
    consumoOtrasSustancias: string;
    estadoAnimo: string;
    saludMental: string;
    problemasViolencia: string;
    statusFinalIncorporacion: string;
    observacionesEncuesta: string;
}

export interface PredictionData {
  prediction_label: string;
  score: number;
  model_used: string;
  model_version: string;
  models: {
    prediction: {
      RandomForest: number;
      XGBoost: number;
      SVM: number;
    };
    probabilities: {
      RandomForest: number;
      XGBoost: number;
      SVM: number;
    };
  };
}

export interface ApiResponse {
  detail: StudentDetail;
  prediction: PredictionData;
}