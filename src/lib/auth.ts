export const VALID_USER = {
  id: "user123",
  password: "0302",
};

export function login(id: string, password: string): boolean {
  return id === VALID_USER.id && password === VALID_USER.password;
}
