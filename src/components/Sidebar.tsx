import { Accordion } from "react-bootstrap";
import './styles/sidebar.css';
import { FC, useEffect, useState } from "react";
import { useUI } from "../context/useUI";
import { getUserById } from "../api/usuarios/getUserById";
import { CustomSideBarItem } from "./CustomSideBarItem";
import { UserProps } from "../interfaces/userInterface";
import { initialState } from '../interfaces/contextInterfaces';

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

  useEffect(() => {
    const sidebarState = localStorage.getItem('state');
    const initialLocalState = sidebarState ? JSON.parse(sidebarState) : initialState;
    dispatch({ type: 'SET_OPEN_SECTION', payload: initialLocalState.openSection });
    dispatch({ type: 'SET_ACTIVE_OPTION', payload: initialLocalState.activeOption });
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
        <Accordion.Header className="sidebar-header">Solicitar Gráficas</Accordion.Header>
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
          <>
            <Accordion.Item eventKey="3">
              <Accordion.Header className="sidebar-header">Configuración General</Accordion.Header>
                <CustomSideBarItem 
                  linkText="Registrar Empresas"
                  linkPath="/register_company"
                  activeOption={state.activeOption}
                  handleActiveOption={() => handleActiveOption('Registrar Empresas')}
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

            <Accordion.Item eventKey="4">
              <Accordion.Header className="sidebar-header">Solicitudes Usuarios</Accordion.Header>
                <CustomSideBarItem 
                  linkText="Ver Solicitudes Usuarios"
                  linkPath="/show_orders_users"
                  activeOption={state.activeOption}
                  handleActiveOption={() => handleActiveOption('Ver Solicitudes Usuarios')}
                />
            </Accordion.Item>
          
           <Accordion.Item eventKey="5">
              <Accordion.Header className="sidebar-header">ELK Stack</Accordion.Header>
                <CustomSideBarItem 
                  linkText="Registrar Ubicación ELK"
                  linkPath="/register_elk_ubication"
                  activeOption={state.activeOption}
                  handleActiveOption={() => handleActiveOption('Registrar Ubicación ELK')}
                />
                <CustomSideBarItem 
                  linkText="Registrar Conexión Empresa"
                  linkPath="/register_company_connection"
                  activeOption={state.activeOption}
                  handleActiveOption={() => handleActiveOption('Registrar Conexión Empresa')}
                />
                <CustomSideBarItem 
                  linkText="Conexión ElasticSearch"
                  linkPath="/elastic_search_connection"
                  activeOption={state.activeOption}
                  handleActiveOption={() => handleActiveOption('Conexión ElasticSearch')}
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
              </Accordion.Item>
          </>
        )
      }
    </Accordion>
  );
};
