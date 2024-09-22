export interface DepartmentsProps {
    currentPage?: number;
    pageSize?: number;
    totalDepartments?: number;
    totalPages?: number;
    departments: {
        id_departamento?: number;
        nombre_departamento?: string;
        descripcion_departamento?: string;
        presupuesto_asignado?: number;
        id_gerente?: number;
        id_empresa?: number;
        estado?: string;
    }[];
}

export interface DepartmentProps {
    id_departamento?: number;
    nombre_departamento?: string;
    descripcion_departamento?: string;
    presupuesto_asignado?: number;
    id_gerente?: number;
    id_empresa?: number;
    estado?: string;
}