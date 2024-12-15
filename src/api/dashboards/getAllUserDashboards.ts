import { sigbpsApi } from "../baseApi";

export const getAllUserDashboards = async (
  pageNumber: number, 
  limitPage: number,
  id_usuario: number,
  estado: string
) => {
  const response = await sigbpsApi.get('dashboard_kibana/getUserDashboardPaginated', {
    params: {
      page: pageNumber,
      limit: limitPage,
      id_usuario,
      estado
    }
  });
  return response.data;
};