export interface ConsultExtractionProps {
  currentPage?: number;
  pageSize?: number;
  totalConsultas?: number;
  totalPages?: number;
  consultas: ConsultExtractionDataProps[];
}

export interface ConsultExtractionDataProps {
  id_consulta_extraccion?: number,
  id_conexion_db?: number,
  consulta_data?: string,
  transformacion_data?: string,
  index_data?: string,
  data_stream?: string,
  use_columns_value?: string,
  tracking_columns?: string,
  type?: string,
  id_conexion_elastic?: number,
  usuario_insercion?: string,
  fecha_insercion?: string,
  usuario_actualizacion?: string,
  fecha_actualizacion?: string,
  estado?: string,
  nombre_empresa?: string,
  hosts_elastic?: string

  path_logstash_config?: string,
  name_logstash_config?: string,
  conexion_driver_class?: string,
  conexion_driver_library?: string,
  conexion_password?: string,
  conexion_string?: string,
  conexion_user?: string
}