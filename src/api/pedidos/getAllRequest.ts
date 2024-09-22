import { sigbpsApi } from "../baseApi";

export const getAllRequest = async () => {
  const response = await sigbpsApi.get('pedidos/getAllPedidos');
  return response.data;
};