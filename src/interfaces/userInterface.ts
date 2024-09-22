export interface UserProps {
    id_usuario?: number
    username?: string
    password?: string
    id_rol?: number
    nombres?: string
    apellidos?: string
    cedula?: number
    email?: string
    numero_telefono?: number
    id_empresa?: number
    estado?: string
    rol?: string
    nombre_empresa?: string
}

export interface UsersPaginatedProps {
    totalUsers?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
    usuarios?: UserProps[];
}