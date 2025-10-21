import api from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nama: string;
  nisn: string;
}

export interface User {
  id: string;
  email: string;
  nama: string;
  role: 'siswa' | 'admin';
}

// Mock authentication - nanti akan diganti dengan real API Go + JWT
export const authService = {
  async login(data: LoginData): Promise<{ token: string; user: User }> {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock response
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser: User = {
      id: '1',
      email: data.email,
      nama: 'User Mock',
      role: data.email.includes('admin') ? 'admin' : 'siswa',
    };
    
    // Simpan ke localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return { token: mockToken, user: mockUser };
    
    // Real implementation nanti:
    // const response = await api.post('/auth/login', data);
    // return response.data;
  },

  async register(data: RegisterData): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return { message: 'Registrasi berhasil! Silakan login.' };
    
    // Real implementation:
    // const response = await api.post('/auth/register', data);
    // return response.data;
  },

  async getMe(): Promise<User> {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not authenticated');
    
    return JSON.parse(userStr);
    
    // Real implementation:
    // const response = await api.get('/auth/me');
    // return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
