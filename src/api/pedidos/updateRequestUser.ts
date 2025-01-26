import { sigbpsApi } from "../baseApi";

export const updateRequestUser = async (id_usuario_pedido:number, id_usuario_asignado:number, fecha_actualizacion: string) => {
  const response = await sigbpsApi.put('pedidos/updatePedidoUser', {
    id_usuario_pedido: id_usuario_pedido,
    id_usuario_asignado: id_usuario_asignado,
    fecha_actualizacion: fecha_actualizacion
  });
  return response.data;
}