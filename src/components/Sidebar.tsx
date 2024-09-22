import { Accordion } from "react-bootstrap";
import './styles/sidebar.css';
import { FC, useEffect, useState } from "react";
import { useUI } from "../context/useUI";
import { getUserById } from "../api/usuarios/getUserById";
import { CustomSideBarItem } from "./CustomSideBarItem";
import { UserProps } from "../interfaces/userInterface";

export const Sidebar:FC = () => {
    
  const { state, dispatch } = useUI();
  const [user, setUser] = useState<UserProps>({} as UserProps);

  const handleSectionClick = (section: string) => {
    dispatch({ type: 'SET_OPEN_SECTION', payload: state.openSection === section ? null : section });
  };

  const handleActiveOption = (option: string) => {
    dispatch({ type: 'SET_ACTIVE_OPTION', payload: option });
  };

  useEffect(() => {
    getUserById()
      .then((response) => {
        setUser(response);
      })
  }, []);

  const handleOpenNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Accordion className="sidebar" activeKey={state.openSection} onSelect={(eventKey) => handleSectionClick(eventKey as string)}>
      <Accordion.Item eventKey="0">
        <Accordion.Header className="sidebar-header">Dashboard</Accordion.Header>
        <CustomSideBarItem 
          linkText="Dashboard"
          linkPath="/dashboard"
          activeOption={state.activeOption}
          handleActiveOption={() => handleActiveOption('Dashboard')}
        />
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header className="sidebar-header">Pedidos</Accordion.Header>
        <CustomSideBarItem 
          linkText="Solicitar Graficas"
          linkPath="/request_charts"
          activeOption={state.activeOption}
          handleActiveOption={() => handleActiveOption('Solicitar Graficas')}
        />
        <CustomSideBarItem 
          linkText="Ver Solicitudes Graficas"
          linkPath="/show_request_charts"
          activeOption={state.activeOption}
          handleActiveOption={() => handleActiveOption('Ver Solicitudes Graficas')}
        />
      </Accordion.Item>

      {
        user.id_rol === 1 && (
          <Accordion.Item eventKey="3">
          <Accordion.Header className="sidebar-header">Administración</Accordion.Header>
          <CustomSideBarItem 
            linkText="Registrar Empresas"
            linkPath="/register_company"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Registrar Empresas')}
          />
          <CustomSideBarItem 
            linkText="Registrar Roles"
            linkPath="/register_rol"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Registrar Roles')}
          />
          <CustomSideBarItem 
            linkText="Registrar Conexión Empresa"
            linkPath="/register_company_connection"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Registrar Conexión Empresa')}
          />
          <CustomSideBarItem 
            linkText="Registrar Conexión Base de Datos"
            linkPath="/register_db_connection"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Registrar Conexión Base de Datos')}
          />
          <CustomSideBarItem 
            linkText="Ver Pedidos Usuarios"
            linkPath="/show_orders_users"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Ver Pedidos Usuarios')}
          />
          <CustomSideBarItem 
            linkText="Extraer Data"
            linkPath="/extract_data"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Extraer Data')}
          />
          <CustomSideBarItem 
            linkText="Construir Graficas (Kibana)"
            activeOption={state.activeOption}
            handleActiveOption={() => {
              handleActiveOption('Construir Graficas (Kibana)');
              handleOpenNewTab(`${import.meta.env.VITE_API_URL_KIBANA}`);
            }}
          />
          <CustomSideBarItem 
            linkText="Asignar Graficas"
            linkPath="/asign_charts"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Asignar Graficas')}
          />
          <CustomSideBarItem 
            linkText="Consultar Clientes"
            linkPath="/consult_clients"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Consultar Clientes')}
          />
          <CustomSideBarItem 
            linkText="Consultar Administradores"
            linkPath="/consult_admins"
            activeOption={state.activeOption}
            handleActiveOption={() => handleActiveOption('Consultar Administradores')}
          />
        </Accordion.Item>
        )
      }
    </Accordion>
  );
};
