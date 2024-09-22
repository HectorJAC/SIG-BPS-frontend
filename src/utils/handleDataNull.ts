export const handleDataNull = (data: string | number | undefined) => {
  if (data === null) {
    return '';
  } else {
    return data;
  }
};