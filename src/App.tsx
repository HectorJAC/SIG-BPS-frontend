import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Login } from "./pages/Login";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { ForgetPasswordPage } from "./pages/ForgetPasswordPage";
import { ErrorPage } from "./pages/ErrorPage";
import { CreateCompanyPage } from "./pages/CreateCompanyPage";
import { CreateRolPage } from "./pages/CreateRolPage";
import { ListOfClientsPage } from "./pages/ListOfClientsPage";
import { RequestChartsPage } from "./pages/RequestChartsPage";
import { RequestAdminPage } from "./pages/RequestAdminPage";
import { ConsultRequestUserPage } from "./pages/ConsultRequestUserPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ConexionDBPage } from "./pages/ConexionDBPage";
import { CreateConexionDBPage } from "./pages/CreateConexionDBPage";
import { ElkUbicationPage } from "./pages/ElkUbicationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forget_password' element={<ForgetPasswordPage />} />
        
        <Route element={<ProtectedRoute />} >
          <Route path='*' element={<ErrorPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/register_company' element={<CreateCompanyPage />} />
          <Route path='/register_rol' element={<CreateRolPage />} />
          <Route path='/consult_clients' element={<ListOfClientsPage />} />
          <Route path='/request_charts' element={<RequestChartsPage />} />
          <Route path='/show_orders_users' element={<RequestAdminPage />} />
          <Route path='/show_request_charts' element={<ConsultRequestUserPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/register_company_connection' element={<ConexionDBPage />} />
          <Route path='/create_connection_db' element={<CreateConexionDBPage />} />
          <Route path='/register_elk_ubication' element={<ElkUbicationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
