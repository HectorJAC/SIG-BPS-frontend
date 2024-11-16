export interface ConexionDBProps {
  currentPage?: number;
  pageSize?: number;
  totalConexions?: number;
  totalPages?: number;
  conexions: {
    id_conexion_db?: number;
    id_empresa?: number;
    conexion_driver_library?: string;
    conexion_driver_class?: string;
    conexion_string?: string;
    conexion_user?: string;
    conexion_password?: string;
    estado?: string;

    nombre_empresa?: string;
  }[];
}

export interface ConexionDBCompanyProps {
  id_conexion_db?: number;
  id_empresa?: number;
  conexion_driver_library?: string;
  conexion_driver_class?: string;
  conexion_string?: string;
  conexion_user?: string;
  conexion_password?: string;
  estado?: string;
  nombre_empresa?: string;
}
