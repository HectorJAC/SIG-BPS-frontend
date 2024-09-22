import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { Layout } from "../layout/Layout";
import { CustomAsterisk } from '../components/CustomAsterisk';
import { CompanyProps } from "../interfaces/companyInteface";
import { getIdDirectorGeneral } from "../utils/getLocalStorageData";
import { findCompanyByDirector } from "../api/empresas/findCompanyByDirector";
import { CustomBasicModal } from "../components/CustomBasicModal";
import DatePicker from "react-datepicker";
import { formatterDate } from "../utils/formatters";
import { useCompanyStore } from "../store/companyStore";
import { planificaTechApi } from "../api/baseApi";
import { CustomImage } from "../components/CustomImage";

export const EditCompanyPage = () => {
  const [companyData, setCompanyData] = useState<CompanyProps>({} as CompanyProps);
  const [showModal, setShowModal] = useState(false);

  const { onSetCompany } = useCompanyStore();

  const getCompanyData = useCallback(() => {
    findCompanyByDirector()
      .then((response) => {
        setCompanyData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(getCompanyData, [getCompanyData]);

  const handleShowModalAceptarCancelar = () => {
    setShowModal(true);
  };

  const handleCloseModalAceptarCancelar = () => {
    setShowModal(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1];
        if (base64String) {
          setCompanyData(prevState => ({ ...prevState, logo_empresa: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleFormSubmit = async () => {
    if (companyData.nombre_empresa === '' || companyData.rnc_empresa === '' || companyData.direccion_empresa === '' || companyData.numero_telefonico === '') {
      toast.error('Llenar los campos requeridos');
    } else {
      planificaTechApi.put('/empresas/updateCompany', {
        id_empresa: companyData.id_empresa,
        nombre_empresa: companyData.nombre_empresa,
        rnc_empresa: companyData.rnc_empresa,
        logo_empresa: companyData.logo_empresa,
        fecha_fundacion: companyData.fecha_fundacion,
        direccion_empresa: companyData.direccion_empresa,
        numero_telefonico: companyData.numero_telefonico,
        correo_empresa: companyData.correo_empresa,
        id_director_general: getIdDirectorGeneral(),
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
          onSetCompany(companyData);
        })
        .catch((error) => {
          console.log(error);
        });

      // Cerrar el modal
      setShowModal(false);

      // Volver a cargar los datos de la empresa
      getCompanyData();
    }
  };

  const handleDateChange = (date:any) => {
    if (date !== null) {
      setCompanyData(prevState => ({
        ...prevState,
        fecha_fundacion: date
      }));
    } else {
      toast.info('Ingrese una fecha')
    }
  };

  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <h1 className="mt-3 mb-4">
              Editar Empresa
            </h1>
          </Col>
        </Row>

        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label><CustomAsterisk /> Nombre de la empresa</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_empresa"
                  value={companyData.nombre_empresa}
                  onChange={(e) => setCompanyData(prevState => ({ ...prevState, nombre_empresa: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><CustomAsterisk /> RNC de la empresa</Form.Label>
                <Form.Control
                  type="text"
                  name="rnc_empresa"
                  value={companyData.rnc_empresa}
                  onChange={(e) => setCompanyData(prevState => ({ ...prevState, rnc_empresa: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="mt-3">Logo de la Empresa</Form.Label>
                {
                  companyData?.logo_empresa ? (
                    <div>
                      <CustomImage 
                        imageData={companyData?.logo_empresa}
                        alt="Logo de la empresa"
                        style={{ width: "200px", height: "auto" }}
                        className="mb-2"
                      />
                      <Form.Control
                        type="file"
                        name="logo_empresa"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <Form.Control
                      type="file"
                      name="logo_empresa"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  )
                }
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="mt-3">Fecha de fundación</Form.Label>
                <br />
                <DatePicker
                  value={
                    companyData.fecha_fundacion 
                      ? formatterDate(companyData.fecha_fundacion)
                      : undefined
                  }
                  required
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="dd/mm/yyyy"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="mt-3"><CustomAsterisk /> Dirección de la empresa</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion_empresa"
                  value={companyData.direccion_empresa}
                  onChange={(e) => setCompanyData(prevState => ({ ...prevState, direccion_empresa: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label className="mt-3"><CustomAsterisk /> Número telefónico</Form.Label>
                <Form.Control
                  type="text"
                  name="numero_telefonico"
                  value={companyData.numero_telefonico}
                  onChange={(e) => setCompanyData(prevState => ({ ...prevState, numero_telefonico: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="mt-3">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo_empresa"
                  value={companyData.correo_empresa}
                  onChange={(e) => setCompanyData(prevState => ({ ...prevState, correo_empresa: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="id_empresa"
                  value={companyData.id_empresa}
                  hidden
                />
              </Form.Group>
            </Col>
          </Row>
          <Button onClick={handleShowModalAceptarCancelar} className="mt-3">Guardar cambios</Button>
        </Form>

        <CustomBasicModal 
          title="Guardar Cambios"
          body="¿Estás seguro de guardar los cambios realizados?"
          secondaryButton="Cancelar"
          primaryButton="Aceptar"
          showModal={showModal}
          setShowModal={handleCloseModalAceptarCancelar}
          onClick={handleFormSubmit}
        />
      </Container>
      <ToastContainer />
    </Layout>
  );
};