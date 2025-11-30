import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wheat, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar email',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wheat className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-3xl">AgrOmie</CardTitle>
              <p className="text-sm text-primary-foreground/90">Gestão Rural Simples</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {!emailSent ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-2">Recuperar Senha</h2>
              <p className="text-muted-foreground mb-6">
                Digite seu email para receber um link de recuperação de senha.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-primary text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-primary hover:underline justify-center"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Email Enviado!</h2>
              <p className="text-muted-foreground mb-6">
                Verifique sua caixa de entrada e spam. Você receberá um link para redefinir sua
                senha.
              </p>

              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-gradient-primary text-lg font-semibold"
              >
                Voltar para Login
              </Button>

              <button
                onClick={() => setEmailSent(false)}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Usar outro email
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
