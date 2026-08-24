/** Mirrors nest-gateway/src/modules/user/domain/user.model.ts's `User`. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  user: AuthenticatedUser;
}
