export const getIdDirectorGeneral = () => {
  const data = localStorage.getItem('id');
  return data;
};

export const getIdUser = () => {
  const data = localStorage.getItem('id_usuario');
  return data;
};