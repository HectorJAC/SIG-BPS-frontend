export interface GerentesProps {
    currentPage?: number;
    pageSize?: number;
    totalGerentes?: number;
    totalPages?: number;
    managers: {
        id_gerente?: number;
        id_usuario?: number;
        cedula?: number;
        nombres?: string;
        apellidos?: string;
        sexo?: string;
        fecha_nacimiento?: string;
        lugar_nacimiento?: string;
        direccion_residencia?: string;
        estado_civil?: string;
        numero_telefonico?: string;
        correo?: string;
        id_empresa?: number;
        fecha_ingreso_empresa?: string;
        estado?: string;
    }[];
}

export interface GerenteProps {
    id_gerente?: number;
    id_usuario?: number;
    cedula?: number;
    nombres?: string;
    apellidos?: string;
    sexo?: string;
    fecha_nacimiento?: string;
    lugar_nacimiento?: string;
    direccion_residencia?: string;
    estado_civil?: string;
    numero_telefonico?: string;
    correo?: string;
    id_empresa?: number;
    fecha_ingreso_empresa?: string;
    estado?: string;
}