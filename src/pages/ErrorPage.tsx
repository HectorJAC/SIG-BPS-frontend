import { Layout } from "../layout/Layout";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/useUI";
import '../styles/pages/errorPageStyle.css';

export const ErrorPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useUI();

  const handleCloseAllSection = (section:string) => {
    dispatch({ type: 'SET_CLOSE_SECTION', payload: section });
  };

  const handleGoHome = () => {
    navigate('/');
    handleCloseAllSection('0');
    dispatch({ type: 'RESET_CONTEXT' });
    localStorage.removeItem('state');
  };

  return (
    <Layout>
      <Container className="text-center py-5">
        <h1 className="display-1 fw-bold text-danger">Error 404</h1>
        <p className="lead">La página que estás buscando no fue encontrada.</p>
        <Button 
          onClick={handleGoHome} 
          variant="success"
          className="mb-2 w-10 0 px-4 py-2 text-uppercase fw-bold shadow-sm border-0 rounded-pill bg-gradient bg-gradient hover-transition hover-shadow hover-translate-y-n3 hover-scale-lg transition-fast"
        >
          Volver a Inicio
        </Button>
      </Container>
    </Layout>
  );
};
