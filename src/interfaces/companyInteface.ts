export interface CompanyProps {
    id_empresa?: number;
    nombre_empresa?: string;
    rnc_empresa?: string;
    logo_empresa?: string;
    fecha_fundacion?: string;
    direccion_empresa?: string;
    telefono_empresa?: string;
    correo_empresa?: string;
    estado?: string;
    usuario_insercion?: number;
    fecha_insercion?: string;
    usuario_actualizacion?: number;
    fecha_actualizacion?: string;
}

export interface CompanyPaginatedProps {
    currentPage?: number;
    pageSize?: number;
    totalCompanies?: number;
    totalPages?: number;
    empresas: CompanyProps[];
}