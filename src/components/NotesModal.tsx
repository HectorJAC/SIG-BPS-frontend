import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getIdUser } from "../utils/getLocalStorageData";
import { CustomAsterisk } from "./CustomAsterisk";
import { formatterDate } from "../utils/formatters";
import { useNotesStore } from "../store/notesStore";
import { OneNoteProps } from "../interfaces/rolesInterface";
import { planificaTechApi } from "../api/baseApi";

interface NotesModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onHide?: () => void;
}

export const NotesModal:FC<NotesModalProps> = ({showModal, setShowModal, onHide}) => {

  const { onCreateNoteSuccess, id_nota, onResetNota } = useNotesStore();

  const [noteData, setNoteData] = useState<OneNoteProps>({} as OneNoteProps);

  useEffect(() => {
    if (showModal) {
      planificaTechApi.get('/notas/getNote', {
        params: {
          id_nota: id_nota
        }
      })
        .then((response) => {
          setNoteData(response.data);
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [id_nota, showModal]);

  // Función para obtener la fecha de creación de la nota
  const fechaCreacionNota = new Date().toLocaleDateString();

  const handleSaveNote = () => {
    if (noteData.titulo_nota === '' || noteData.descripcion_nota === '') {
      toast.error('Todos los campos son obligatorios');
      return;
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/notas/createNote`, {
        titulo_nota: noteData.titulo_nota,
        descripcion_nota: noteData.descripcion_nota,
        fecha_creacion_nota: fechaCreacionNota,
        id_usuario: getIdUser(),
        estado: 'ACTIVO'
      })
        .then((response) => {
          toast.success(`${response.data.message}`);
          onCreateNoteSuccess();
        })
        .catch((error) => {
          toast.error(`${error.response.data.message}`);
        });
    
      // Limpiar los campos del formulario
      setNoteData({} as OneNoteProps);
    
      // Cerrar el modal
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNoteData({} as OneNoteProps);
    onResetNota();  
  };

  const handleUpdateNote = () => {
    planificaTechApi.put(`/notas/updateNote`, {
      id_nota: id_nota,
      titulo_nota: noteData.titulo_nota,
      descripcion_nota: noteData.descripcion_nota,
    })
      .then((response) => {
        toast.success(response.data.message);
        onCreateNoteSuccess();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

    // Limpiar los campos del formulario
    setNoteData({} as OneNoteProps);

    // Cerrar el modal
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nota</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label><CustomAsterisk /> Titulo de la Nota</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ingrese el nombre de la nota" 
              value={noteData.titulo_nota}
              onChange={(e) => setNoteData({...noteData, titulo_nota: e.target.value})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Fecha Creación de la Nota</Form.Label>
            <Form.Control 
              type="text" 
              readOnly
              placeholder="Fecha de Creación de la Nota"
              value={
                id_nota === 0 
                  ? formatterDate(fechaCreacionNota) 
                  : formatterDate(noteData.fecha_creacion_nota)
              } 
            />
          </Form.Group>

          <Form.Group>
            <Form.Label><CustomAsterisk /> Descripción de la nota</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Ingrese la descripción de la nota"
              value={noteData.descripcion_nota}
              onChange={(e) => setNoteData({...noteData, descripcion_nota: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          onClick={
            id_nota === 0 
              ? handleSaveNote 
              : handleUpdateNote
          }
        >
          {id_nota === 0 ? 'Guardar Nota' : 'Actualizar Nota'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};