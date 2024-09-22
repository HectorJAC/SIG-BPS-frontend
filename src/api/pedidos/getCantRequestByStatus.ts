import { sigbpsApi } from "../baseApi";

export const getCantRequestByStatus = async (estado_pedido:string) => {
  const response = await sigbpsApi.get('pedidos/getPedidosCountByStatus', {
    params: {
      estado_pedido: estado_pedido
    }
  });
  return response.data[0].cantidad_pedidos;
};