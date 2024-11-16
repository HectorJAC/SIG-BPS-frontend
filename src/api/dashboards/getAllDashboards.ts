import { sigbpsApi } from "../baseApi";

export const getAllDashboards = async (pageNumber: number, limitPage: number) => {
  const response = await sigbpsApi.get('dashboard_kibana/getAllDashboards', {
    params: {
      page: pageNumber,
      limit: limitPage
    }
  });
  return response.data;
};