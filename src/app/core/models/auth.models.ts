export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
}

export interface AuthResponse {
  email: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}
