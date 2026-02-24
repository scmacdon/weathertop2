export function isAuthenticated() {
  const token = localStorage.getItem("id_token");
  return !!token;
}