export interface ElkUbicationProps {
  currentPage?: number;
  pageSize?: number;
  totalRol?: number;
  totalPages?: number;
  elkUbicacion: {
    id_elk_ubicacion?: number;
    nombre_elk?: string;
    ubicacion_elk?: string;
    usuario_insercion?: number;
    fecha_insercion?: string;
    usuario_actualizacion?: number;
    fecha_actualizacion?: string;
    estado?: string;

    usuario_insercion_username?: string;
    usuario_actualizacion_username?: string;
  }[];
}

export interface ElkUbicationNoPaginatedProps {
  id_elk_ubicacion?: number;
  nombre_elk?: string;
  ubicacion_elk?: string;
  usuario_insercion?: number;
  fecha_insercion?: string;
  usuario_actualizacion?: number;
  fecha_actualizacion?: string;
  estado?: string;

  usuario_insercion_username?: string;
  usuario_actualizacion_username?: string;
}