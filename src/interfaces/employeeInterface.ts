export interface EmployeesProps {
  currentPage?: number;
  pageSize?: number;
  totalEmployees?: number;
  totalPages?: number;
  employees: {
    id_empleado?: number;
    cedula?: number;
    nombres?: string;
    apellidos?: string;
    sexo?: string;
    fecha_nacimiento?: string;
    lugar_nacimiento?: string;
    direccion_residencia?: string;
    estado_civil?: string;
    numero_telefonico?: string;
    nivel_academico?: string;
    correo?: string;
    fecha_ingreso_empresa?: string;
    salario?: string;
    id_departamento?: number;
    id_puesto?: number;
    id_empresa?: number;
    id_usuario_creacion: number;
    id_usuario_actualizacion: number;
    estado?: string;

    nombre_departamento?: string;
    usuario_creacion?: string;
    usuario_actualizacion?: string;
    nombre_puesto?: string;
  }[];
}

export interface EmployeeProps {
  id_empleado?: number;
  cedula?: number;
  nombres?: string;
  apellidos?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  lugar_nacimiento?: string;
  direccion_residencia?: string;
  estado_civil?: string;
  numero_telefonico?: string;
  nivel_academico?: string;
  correo?: string;
  fecha_ingreso_empresa?: string;
  salario?: string;
  id_departamento?: number;
  id_puesto?: number;
  id_empresa?: number;
  id_usuario_creacion: number;
  id_usuario_actualizacion: number;
  estado?: string;

  nombre_departamento?: string;
  usuario_creacion?: string;
  usuario_actualizacion?: string;
  nombre_puesto?: string;
}
