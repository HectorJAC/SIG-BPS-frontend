import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Login } from "./pages/Login";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { ForgetPasswordPage } from "./pages/ForgetPasswordPage";
import { ErrorPage } from "./pages/ErrorPage";
import { CreateCompanyPage } from "./pages/CreateCompanyPage";
import { ListOfClientsPage } from "./pages/ListOfClientsPage";
import { RequestChartsPage } from "./pages/RequestChartsPage";
import { RequestAdminPage } from "./pages/RequestAdminPage";
import { ConsultRequestUserPage } from "./pages/ConsultRequestUserPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ConexionDBPage } from "./pages/ConexionDBPage";
import { CreateConexionDBPage } from "./pages/CreateConexionDBPage";
import { ElkUbicationPage } from "./pages/ElkUbicationPage";
import { ListOfAdminsPage } from "./pages/ListOfAdminsPage";
import { SaveDashboardPage } from "./pages/SaveDashboardPage";
import { AsignDashboardPage } from "./pages/AsignDashboardPage";
import { AddUserDashboardPage } from "./pages/AddUserDashboardPage";
import { ConexionElasticPage } from "./pages/ConexionElasticPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ConsultExtractionPage } from "./pages/ConsultExtractionPage";
import { CreateConsultExtractionPage } from "./pages/CreateConsultExtractionPage";
import { ExtractDataPage } from "./pages/ExtractDataPage";
import { RegisterAdminPage } from "./pages/RegisterAdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/register_admin' element={<RegisterAdminPage />} />
        <Route path='/forget_password' element={<ForgetPasswordPage />} />
        
        <Route element={<ProtectedRoute />} >
          <Route path='*' element={<ErrorPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/register_company' element={<CreateCompanyPage />} />
          <Route path='/consult_clients' element={<ListOfClientsPage />} />
          <Route path='/request_charts' element={<RequestChartsPage />} />
          <Route path='/show_orders_users' element={<RequestAdminPage />} />
          <Route path='/show_request_charts' element={<ConsultRequestUserPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/register_company_connection' element={<ConexionDBPage />} />
          <Route path='/create_connection_db' element={<CreateConexionDBPage />} />
          <Route path='/register_elk_ubication' element={<ElkUbicationPage />} />
          <Route path='/consult_admins' element={<ListOfAdminsPage />} />
          <Route path='/save_dashboards' element={<SaveDashboardPage />} />
          <Route path='/asign_dashboard' element={<AsignDashboardPage />} />
          <Route path='/list_dashboards_users' element={<AddUserDashboardPage />} />
          <Route path='/elastic_search_connection' element={<ConexionElasticPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/consult_extraction' element={<ConsultExtractionPage />} />
          <Route path='/create_consult_extraction' element={<CreateConsultExtractionPage />} />
          <Route path='/extract_data' element={<ExtractDataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
