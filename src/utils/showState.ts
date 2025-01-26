export const showState = (state:string | undefined) => {
  if (state === 'A') {
    return 'ACTIVO';
  } else if (state === 'I') {
    return 'INACTIVO';
  } else if (!state) {
    return '';
  }
};