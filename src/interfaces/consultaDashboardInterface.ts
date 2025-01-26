export interface ConsultaDashboardProps {
  id_consulta_dashboard?: number;
  id_dashboard_kibana?: number;
  id_consulta_extraccion?: number;
  usuario_insercion?: string;
  fecha_insercion?: string;
  usuario_actualizacion?: string;
  fecha_actualizacion?: string;
  estado?: string;
  type?: string;
  index_data?: string;
  hosts_elastic?: string;
  nombre_dashboard?: string;
}

export interface ConsultaDashboardRePaginatedProps {
  totalConsultaDashboards?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  consultaDashboardByDashboard?: ConsultaDashboardProps[];
}