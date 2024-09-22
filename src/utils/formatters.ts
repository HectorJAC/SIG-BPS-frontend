export const formatterDate = (date: string | undefined) => {
  const newDate = new Date(date as string);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatterCedula = (cedula: number) => {
  return cedula.toString().replace(/(\d{1,3})(\d{1,7})(\d{1})/, '$1-$2-$3');
};

export const getYearforDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.getFullYear();
};