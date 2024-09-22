export interface CompanyProps {
    id_empresa?: number;
    nombre_empresa?: string;
    rnc_empresa?: string;
    logo_empresa?: string;
    fecha_fundacion?: string;
    direccion_empresa?: string;
    numero_telefonico?: string;
    correo_empresa?: string;
    estado?: string;
}

export interface CompanyPaginatedProps {
    currentPage?: number;
    pageSize?: number;
    totalCompanies?: number;
    totalPages?: number;
    empresas: {
        id_empresa?: number;
        nombre_empresa?: string;
        rnc_empresa?: string;
        logo_empresa?: string;
        fecha_fundacion?: string;
        direccion_empresa?: string;
        numero_telefonico?: string;
        correo_empresa?: string;
        estado?: string;
    }[];
}