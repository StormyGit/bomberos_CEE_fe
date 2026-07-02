export interface incidente {
  // incidente
  incidente?       : string;
  colonia?         : string;
  referencia?      : string;
  direccion?       : string;
  // denunciante
  denunciante_nombre?: string;
  denunciante_telefono?: string;
  // operador recepcion
  recepcion_date?: string;
  recepcion_nombre?: string;
  recepcion_tipo?: "cce" | "911";


  punto?           : point;
}

export interface point{
  x: number;
  y: number;
}

export function incidentes_list(): string[] {
  return [
    "Incendio estructural",
    "Incendio vehicular",
    "Incendio forestal",
    "Incendio de basura",
    "Rescate vehicular",
    "Rescate en altura",
    "Rescate acuático",
    "Rescate en espacios confinados",
    "Emergencia médica",
    "Atención prehospitalaria",
    "Fuga de gas",
    "Derrame de combustible",
    "Materiales peligrosos",
    "Explosión",
    "Corto circuito",
    "Poste o cable caído",
    "Árbol caído",
    "Inundación",
    "Derrumbe",
    "Deslizamiento de tierra",
    "Persona atrapada",
    "Animal atrapado",
    "Accidente de tránsito",
    "Accidente industrial",
    "Alarma contra incendios",
    "Inspección preventiva",
    "Apoyo a otras instituciones",
    "Falsa alarma",
    "Otro"
  ];
}



export interface estaciones {
  nombre: string;
  point: point;
}
