export interface RequestProps {
  id_usuario_pedido?: number;
  id_usuario?: number;
  descripcion_pedido?: string;
  estado_pedido?: string;
  fecha_pedido?: string;
  estado?: string;

  nombres_usuario?: string;
  apellidos_usuario?: string;
  nombre_empresa?: string;

  fecha_actualizacion?: string;
  usuario_asignado?: string;
  id_usuario_asignado?: number;
}

export interface RequestPaginatedProps {
  currentPage?: number;
  pageSize?: number;
  totalPedidosUser?: number;
  totalPages?: number;
  pedidosUser: {
    id_usuario_pedido?: number;
    id_usuario?: number;
    descripcion_pedido?: string;
    estado_pedido?: string;
    fecha_pedido?: string;
    estado?: string;
  
    nombres_usuario?: string;
    apellidos_usuario?: string;
    nombre_empresa?: string;
  }[];
}