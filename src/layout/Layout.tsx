import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useCompanyStore } from "../store/companyStore";
import { useUserStore } from "../store/userStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({children}: LayoutProps) => {
  const { company } = useCompanyStore();
  const { user } = useUserStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', zIndex: 1, marginLeft: '200px', marginTop: '50px' }}>
      <Header 
        companyName={company.nombre_empresa} 
        userName={user.nombres + ' ' + user.apellidos}
      />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
  );
};