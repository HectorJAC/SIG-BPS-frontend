export interface RoleProps {
    currentPage?: number;
    pageSize?: number;
    totalRol?: number;
    totalPages?: number;
    roles: {
        id_rol?: number;
        tipo_rol?: string;
        estado?: string;
    }[];
}
