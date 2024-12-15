export interface DashboardUserDataProps {
  id_usuario_dashboard?: number;
  id_usuario?: number;
  id_dashboard_kibana?: number;
  estado?: string;
  nombre_dashboard?: string;
  dashboard_source?: string;
}

export interface UserDashboardsProps {
  currentPage?: number;
  pageSize?: number;
  totalRol?: number;
  totalPages?: number;
  dashboardsUsuario: DashboardUserDataProps[];
}

export interface OneDashboardUserDataProps {
  id_dashboard_kibana?: number;
  id_empresa?: number;
  nombre_dashboard?: string;
  dashboard_source?: string;
  usuario_insercion?: number;
  fecha_insercion?: string;
  usuario_actualizacion?: number;
  fecha_actualizacion?: string;
  estado?: string;

  nombre_empresa?: string;
}

export interface DashboardKibanaProps {
  currentPage?: number;
  pageSize?: number;
  totalRol?: number;
  totalPages?: number;
  dashboards: OneDashboardUserDataProps[];
}