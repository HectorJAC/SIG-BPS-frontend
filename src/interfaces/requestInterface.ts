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