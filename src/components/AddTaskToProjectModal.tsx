import { Button, Col, Row, Form, Modal, } from "react-bootstrap";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useProjectStore, useTaskSuccessStore } from "../store/projectStore";
import { addTaskToProject } from "../api/proyectos/addTaskToProject";
import { TaskProyectProps } from "../interfaces/requestInterface";
import { CustomAsterisk } from "./CustomAsterisk";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getTaskFromProject } from "../api/proyectos/getTaskFromProject";
import { updateTaskFromProject } from "../api/proyectos/updateTaskFromProject";

interface AsignTaskProjectModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export const AsignTaskProjectModal:FC<AsignTaskProjectModalProps> = ({
  showModal,
  setShowModal
}) => {
  const [tasksData, setTasksData] = useState<TaskProyectProps>({} as TaskProyectProps);

  const { id_proyecto, id_tarea_proyecto, onResetTaskProject } = useProjectStore();
  const { onAddingTaskSuccess } = useTaskSuccessStore();

  useEffect(() => {
    if (showModal && id_tarea_proyecto > 0) {
      getTaskFromProject(id_tarea_proyecto!)
        .then((response) => {
          setTasksData(response);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [id_tarea_proyecto, showModal]);

  const handleStartDateChange = (date:any) => {
    if (date !== null) {
      setTasksData(prevState => ({
        ...prevState,
        fecha_inicio_tarea_proyecto: date
      }));
    } else {
      toast.info('Ingrese una fecha')
    }
  };

  const handleEndDateChange = (date:any) => {
    if (date !== null) {
      setTasksData(prevState => ({
        ...prevState,
        fecha_fin_tarea_proyecto: date
      }));
    } else {
      toast.info('Ingrese una fecha')
    }
  };

  const addTaskProject = () => {
    addTaskToProject(
      tasksData.nombre_tarea_proyecto,
      tasksData.descripcion_tarea_proyecto,
      tasksData.fecha_inicio_tarea_proyecto,
      tasksData.fecha_fin_tarea_proyecto,
      id_proyecto!,
      tasksData.estado_tarea_proyecto,
    )
      .then((response) => {
        toast.success(response.message);
        setShowModal(false);
        onAddingTaskSuccess();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    onResetTaskProject();
    setTasksData({} as TaskProyectProps);
  };

  const updateTaskProject = () => {
    updateTaskFromProject(
      id_tarea_proyecto!,
      tasksData.nombre_tarea_proyecto,
      tasksData.descripcion_tarea_proyecto,
      tasksData.fecha_inicio_tarea_proyecto,
      tasksData.fecha_fin_tarea_proyecto,
      id_proyecto!,
      tasksData.estado_tarea_proyecto,
    )
      .then((response) => {
        toast.success(response.message);
        setShowModal(false);
        onAddingTaskSuccess();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {
            id_tarea_proyecto
              ? 'Editar Tarea'
              : 'Asignar Tarea'
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <Form.Group className='mb-4'>
              <Form.Label>Id Tarea</Form.Label>
              <Form.Control 
                type='text'
                disabled
                value={tasksData?.id_tarea_proyecto}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label><CustomAsterisk/> Fecha de Inicio</Form.Label>
              <br />
              <DatePicker
                selected={
                  tasksData.fecha_inicio_tarea_proyecto 
                    ? new Date(tasksData.fecha_inicio_tarea_proyecto)
                    : null
                }
                required
                onChange={handleStartDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="dd/mm/yyyy"
                customInput={
                  <Form.Control 
                    type="text"
                    required
                    value={tasksData.fecha_inicio_tarea_proyecto}
                    onChange={handleStartDateChange}
                  />
                }
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label><CustomAsterisk/> Estado Tarea</Form.Label>
              <Form.Select
                required
                value={tasksData.estado_tarea_proyecto}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTasksData(prevState => ({ ...prevState, estado_tarea_proyecto: e.target.value }))}
              >
                <option value="">-- Seleccione una opción --</option>
                <option value="En Espera">En Espera</option>
                <option value="Trabajando">Trabajando</option>
                <option value="Finalizado">Finalizado</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className='mb-4'>
              <Form.Label><CustomAsterisk/> Nombre Tarea</Form.Label>
              <Form.Control 
                type='text'
                value={tasksData.nombre_tarea_proyecto}
                onChange={(e) => setTasksData(prevState => ({ ...prevState, nombre_tarea_proyecto: e.target.value }))} 
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Fecha Fin</Form.Label>
              <br />
              <DatePicker
                selected={
                  tasksData.fecha_fin_tarea_proyecto 
                    ? new Date(tasksData.fecha_fin_tarea_proyecto)
                    : null
                }
                onChange={handleEndDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="dd/mm/yyyy"
                customInput={
                  <Form.Control 
                    type="text"
                    value={tasksData.fecha_fin_tarea_proyecto}
                    onChange={handleEndDateChange}
                  />
                }
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label> Estado</Form.Label>
              <Form.Control 
                disabled
                type='text'
                value={tasksData.estado}
                onChange={(e) => setTasksData(prevState => ({ ...prevState, estado: e.target.value }))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className='mb-4'>
              <Form.Label><CustomAsterisk/> Descripcion Proyecto</Form.Label>
              <textarea
                className="form-control"
                required
                value={tasksData.descripcion_tarea_proyecto}
                onChange={(e) => setTasksData(prevState => ({ ...prevState, descripcion_tarea_proyecto: e.target.value }))}
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label><CustomAsterisk/> ID Proyecto</Form.Label>
              <Form.Control 
                disabled
                type='number'
                value={id_proyecto}
                onChange={(e) => setTasksData(prevState => ({ ...prevState, id_proyecto: Number(e.target.value) }))}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
        <Button 
          variant="primary" 
          type="submit" 
          onClick={
            id_tarea_proyecto
              ? updateTaskProject
              : addTaskProject
          }
        >
          {
            id_tarea_proyecto
              ? 'Actualizar Tarea'
              : 'Crear Tarea'
          }
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  )
};