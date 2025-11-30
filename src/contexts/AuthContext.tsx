/**
 * AuthContext simplificado - sem Supabase
 * Autenticação mock usando localStorage
 * TODO: Implementar autenticação real quando necessário
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  session: { user: User } | null;
  isLoading: boolean;
  user: User | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'agromie_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há sessão salva
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession({ user: parsed });
        setUser(parsed);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Mock: sempre cria usuário com sucesso
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      full_name: fullName,
    };
    
    const newSession = { user: newUser };
    setSession(newSession);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const signIn = async (email: string, password: string) => {
    // Mock: sempre faz login com sucesso
    // Em produção, validaria credenciais
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      full_name: 'Usuário',
    };
    
    const newSession = { user: mockUser };
    setSession(newSession);
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetPassword = async (email: string) => {
    // Mock: sempre retorna sucesso
    console.log('Reset password requested for:', email);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        user,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
