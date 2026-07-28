export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  user: AuthenticatedUser;
  token: string;
}
