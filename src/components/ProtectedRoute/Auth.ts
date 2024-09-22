export const isAuthenticated = () => {
  const token = localStorage.getItem('accesToken');
  return token !== null;
};