import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import { Layout } from "../layout/Layout";
import { CustomAsterisk } from '../components/CustomAsterisk';
import { CustomBasicModal } from "../components/CustomBasicModal";
import { handleDataNull } from "../utils/handleDataNull";
import { useUserStore } from "../store/userStore";
import { CustomTitle } from "../components/CustomTitle";
import { UserProps } from "../interfaces/userInterface";
import { sigbpsApi } from "../api/baseApi";
import { formatterDateToBackend } from "../utils/formatters";
import { CustomPasswordInput } from "../components/CustomPasswordInput";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/useUI";
import { useCompanyStore } from "../store/companyStore";

export const ProfilePage = () => {
  const [userData, setUserData] = useState<UserProps>();
  const [editMode, setEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useUI();

  const { onClearCompany } = useCompanyStore();
  const { user } = useUserStore();

  const getUserData = useCallback(() => {
    setIsLoading(true);
    sigbpsApi.get('/usuarios/getUser', {
      params: {
        id_usuario: user?.id_usuario
      }
    })
      .then(response => {
        setUserData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [user?.id_usuario !== undefined]);

  useEffect(getUserData, [getUserData]);

  const handleChangePassword = () => {
    if (newPassword === '' || repeatNewPassword === '') {
      toast.error('Todos los campos son requeridos');
    } else if (newPassword !== repeatNewPassword) {
      toast.error('Las contraseñas no coinciden');
    } else {
      sigbpsApi.put('/usuarios/changePassword', {
        id_usuario: user?.id_usuario,
        new_password: newPassword
      })
        .then(response => {
          toast.success(`${response.data.message}`);
          handleCloseModal();
        })
        .catch(error => {
          toast.error(`${error.response.data.message}`);
        });
    }
  }; 

  const handleUpdateUser = () => {
    if (
      userData?.nombres === '' ||
      userData?.apellidos === '' ||
      userData?.cedula === undefined ||
      userData?.email === ''
    ) {
      toast.error('Debe completar los campos requeridos');
    } else {
      sigbpsApi.put('/usuarios/updateUser', {
        id_usuario: user?.id_usuario,
        nombres: userData?.nombres,
        apellidos: userData?.apellidos,
        cedula: userData?.cedula,
        email: userData?.email,
        numero_telefono: userData?.numero_telefono,
        fecha_actualizacion: formatterDateToBackend(new Date().toString())
      })
        .then(response => {
          toast.success(`${response.data.message}`);
          setEditMode(false);
          setShowConfirmModal(false);
          // onSetUser(response.data.user);
        })
        .catch(error => {
          toast.error(`${error.response.data.message}`);
      })
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    getUserData();
  };
    
  const handleCancel = () => {
    setShowCancelModal(false);
    setEditMode(false);
    getUserData();
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDeleteUser = () => {
    sigbpsApi.put('/usuarios/deleteUser', {
      id_usuario: user?.id_usuario,
      fecha_actualizacion: formatterDateToBackend(new Date().toString())
    })
      .then(response => {
        toast.success(`${response.data.message}`);
        setShowModalDeleteUser(false);

        setTimeout(() => {
          // Eliminar el token de acceso del almacenamiento local
          localStorage.removeItem('accesToken');
          localStorage.removeItem('username');
          localStorage.removeItem('id');
          localStorage.removeItem('state');

          dispatch({ type: 'RESET_CONTEXT' });
          onClearCompany();

          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
        }, 1000);
      })
      .catch(error => {
        toast.error(`${error.response.data.message}`);
      });
  };

  return (
    <Layout>
      {
        isLoading
        ?
          (
            <Container>
              <Spinner />
            </Container>
          )
        :
          (
            <Container>  
              <CustomTitle title="Perfil de Usuario" />
              <Row>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Nombre de Usuario</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled 
                        value={handleDataNull(userData?.username)}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Nombres</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled={!editMode}
                        value={handleDataNull(userData?.nombres)} 
                        onChange={(e) => setUserData({...userData, nombres: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Rol</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled
                        value={
                          userData?.id_rol === 1 ? 'Administrador' : 'Gerente'
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Cedula</Form.Label>
                      <Form.Control 
                        type="number" 
                        disabled={!editMode} 
                        value={handleDataNull(userData?.cedula)} 
                        onChange={(e) => setUserData({...userData, cedula: Number(e.target.value)})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Correo</Form.Label>
                      <Form.Control 
                        type="email" 
                        disabled={!editMode} 
                        value={handleDataNull(userData?.email)} 
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Fecha Actualizacion</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled
                        value={handleDataNull(userData?.fecha_actualizacion)} 
                        onChange={(e) => setUserData({...userData, fecha_actualizacion: e.target.value})}
                      />
                    </Form.Group>
                  </Form>
                </Col>

                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Contraseña</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control 
                          type='password'
                          disabled
                          value={handleDataNull(userData?.password)}
                        />
                        <Button 
                          variant="success" 
                          onClick={() => setShowModal(true)} 
                          className="ms-2"
                        >
                          Cambiar
                        </Button>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><CustomAsterisk/> Apellidos</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled={!editMode} 
                        value={handleDataNull(userData?.apellidos)} 
                        onChange={(e) => setUserData({...userData, apellidos: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Numero Telefonico</Form.Label>
                      <Form.Control 
                        type="number" 
                        disabled={!editMode} 
                        value={handleDataNull(userData?.numero_telefono)} 
                        onChange={(e) => setUserData({...userData, numero_telefono: Number(e.target.value)})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Empresa</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled
                        value={handleDataNull(userData?.nombre_empresa)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Fecha Insercion</Form.Label>
                      <Form.Control 
                        type="text" 
                        disabled
                        value={handleDataNull(userData?.fecha_insercion)}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>

              <Row>
              {!editMode ? (
                <Col md={12} className="d-flex justify-content-start">
                  <Button 
                    onClick={handleEdit}
                    variant="success"
                  >
                    Modo Edición
                  </Button>  
                </Col>
              ) : (
                <div className="d-flex justify-content-between mb-2">
                  <Button onClick={() => setShowConfirmModal(true)} variant="success">
                    Guardar
                  </Button>

                  <Button onClick={() => setShowCancelModal(true)} variant="secondary">
                    Cancelar
                  </Button>
                </div>
              )}

              {
                !editMode ? (
                  <Col md={12} className="d-flex justify-content-end">
                    <Button 
                      onClick={() => setShowModalDeleteUser(true)}
                      variant="danger"
                    >
                      Eliminar Usuario
                    </Button>
                  </Col>
                ) : (null)
              }
              </Row>

              <Modal show={showModal} onHide={handleCloseModal}>
                <form >
                  <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>

                    <CustomPasswordInput
                      nameLabel="Contraseña Actual" 
                      password={user.password!}
                      name="currentPassword"
                      readonly={true}
                    />

                    <CustomPasswordInput 
                      nameLabel="Nueva Contraseña"
                      password={newPassword}
                      name="newPassword"
                      readonly={false}
                      onchange={(e) => setNewPassword(e.target.value)}
                    />

                    <CustomPasswordInput
                      nameLabel="Repetir Nueva Contraseña"
                      password={repeatNewPassword}
                      name="repeatPassword"
                      readonly={false}
                      onchange={(e) => setRepeatNewPassword(e.target.value)}
                    />

                  </Modal.Body>
                  <Modal.Footer>
                    <Button 
                      variant="success" 
                      onClick={handleChangePassword}
                      >
                        Guardar
                      </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>

              <CustomBasicModal 
                title="Confirmación"
                body="¿Estás seguro que desea guardar los cambios?"
                secondaryButton="Cancelar"
                primaryButton="Aceptar"
                showModal={showConfirmModal}
                setShowModal={() => setShowConfirmModal(false)}
                onClick={handleUpdateUser}
              />

              <CustomBasicModal 
                title="Cancelar"
                body="¿Estás seguro de cancelar la operación?"
                secondaryButton="Cancelar"
                primaryButton="Aceptar"
                showModal={showCancelModal}
                setShowModal={() => setShowCancelModal(false)}
                onClick={handleCancel}
              />

              <CustomBasicModal 
                title="Eliminar Usuario"
                body="¿Estás seguro que desea eliminar su usuario?"
                secondaryButton="Cancelar"
                primaryButton="Aceptar"
                showModal={showModalDeleteUser}
                setShowModal={() => setShowModalDeleteUser(false)}
                onClick={handleDeleteUser}
              />
            </Container>
          )
      }
      <ToastContainer />
    </Layout>
  );
}