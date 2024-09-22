import { Navbar, Nav } from 'react-bootstrap';
import './styles/header.css';
import { CustomTooltip } from './CustomTooltip';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SlLogout } from "react-icons/sl";
import { useState } from 'react';
import { useUI } from '../context/useUI';
import { CustomBasicModal } from './CustomBasicModal';
import { useCompanyStore } from '../store/companyStore';
import { useEmployeeOrDepartmentSuccessStore, useProjectStore, useTaskSuccessStore } from '../store/projectStore';
import { useEmployeesStore } from '../store/employeesStore';

interface HeaderProps {
  companyName: string | undefined;
  userName: string | undefined;
}

export const Header = ({ companyName, userName }: HeaderProps) => {

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { dispatch } = useUI();
  const { onClearCompany } = useCompanyStore();
  const { onResetProject } = useProjectStore();
  const { onResetEmployee } = useEmployeesStore();
  const { resetAddingEmployeeDepartmentSuccess } = useEmployeeOrDepartmentSuccessStore();
  const { resetAddingTaskSuccess } = useTaskSuccessStore();

  const handleCloseAllSection = (section:string) => {
    dispatch({ type: 'SET_CLOSE_SECTION', payload: section });
  };

  const goToHome = () => {
    navigate('/');
    handleCloseAllSection('0');
    dispatch({ type: 'RESET_CONTEXT' });
    onResetProject();
    onResetEmployee();
    resetAddingEmployeeDepartmentSuccess();
    resetAddingTaskSuccess();
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    // Eliminar el token de acceso del almacenamiento local
    localStorage.removeItem('accesToken');
    localStorage.removeItem('username');
    localStorage.removeItem('id');

    dispatch({ type: 'RESET_CONTEXT' });
    onClearCompany();
    onResetProject();
    onResetEmployee();
    resetAddingEmployeeDepartmentSuccess();
    resetAddingTaskSuccess();

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <>
      <Navbar style={{
        backgroundColor: 'rgba(66, 198, 46, 0.837)',
        color: 'black',
        paddingRight: '1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 3,
        width: '100%',
      }}>
        <Navbar.Toggle />
        <Navbar.Brand className='navBar-title'>
          <CustomTooltip
            text="Inicio"
            placement="bottom"
            onClick={goToHome}
            style={{border: 'none', backgroundColor: 'transparent'}}
            isButton={true}
          >
            <span className='navBar-title'>SIG - BPS</span>
          </CustomTooltip>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-between">
          <Nav>
            <Nav.Item className='navBar-company'>
              {companyName ?? 'SIG-BPS - Administracion'}
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center">
              <span style={{ marginRight: '2rem', fontSize: '1.5rem' }}>{userName}</span>
              <div style={{ marginRight: '2rem' }}>
                <CustomTooltip
                  text="Perfil de usuario"
                  placement="bottom"
                  onClick={goToProfile}
                  isButton={true}
                >
                  <FaUser size={20} />
                </CustomTooltip>
              </div>
                            
              <div style={{ marginRight: '2rem' }}>
                <CustomTooltip
                  text="Cerrar sesión"
                  placement="bottom"
                  onClick={() => setShowLogoutModal(true)}
                  isButton={true}
                >
                  <SlLogout size={20} />
                </CustomTooltip>
              </div>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <CustomBasicModal 
        title="Cerrar Sesión"
        body="¿Desea cerrar sesión?"
        secondaryButton="Cancelar"
        primaryButton="Aceptar"
        showModal={showLogoutModal}
        setShowModal={() => setShowLogoutModal(false)}
        onClick={handleLogout}
      />
    </>
  );
};