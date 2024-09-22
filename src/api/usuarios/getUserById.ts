import { sigbpsApi } from "../baseApi";
import { getIdUser } from "../../utils/getLocalStorageData";

export const getUserById = async () => {
  const response = await sigbpsApi.get('usuarios/getUser', {
    params: {
      id_usuario: getIdUser()
    }
  });
  return response.data;
};