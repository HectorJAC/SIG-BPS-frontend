import { sigbpsApi } from "../baseApi";

export const updateRequestStatus = async (id_usuario_pedido:number, estado_pedido:string) => {
  const response = await sigbpsApi.put('pedidos/updatePedidoStatus', {
    id_usuario_pedido: id_usuario_pedido,
    estado_pedido: estado_pedido
  });
  return response.data;
}