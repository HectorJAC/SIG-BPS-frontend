import { sigbpsApi } from "../baseApi";

export const getAllElkUbicacion = async (pageNumber: number, limitNumber: number) => {
  const response = await sigbpsApi.get('ubicacion_elk/findAllElkUbication', {
    params: {
      page: pageNumber,
      limit: limitNumber
    }
  });
  return response.data;
};