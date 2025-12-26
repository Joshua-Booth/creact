export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  username?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  key: string
}
