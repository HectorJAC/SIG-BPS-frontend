export const showRequestState = (state:string | undefined) => {
  if (state === 'T') {
    return 'Trabajando';
  } else if (state === 'P') {
    return 'Pendiente';
  } else if (state === 'C') {
    return 'Completado';
  } else if (!state) {
    return '';
  }
};