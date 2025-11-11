import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    const verifyToken = async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        // Panggil service yang baru kita buat
        const response = await authService.verifyEmail(token);
        setPassword(response.password);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Token verifikasi tidak valid atau sudah kedaluwarsa.');
        } else {
          setError('Terjadi kesalahan. Silakan coba lagi nanti.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken(token);
    } else {
      setError('Token verifikasi tidak ditemukan.');
      setLoading(false);
    }
  }, [searchParams]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Sedang memverifikasi akun Anda...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-semibold">{error}</p>
          <Button asChild variant="outline">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      );
    }

    if (password) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="text-lg font-semibold">Verifikasi Email Berhasil!</p>
          <p className="text-muted-foreground">
            Akun Anda telah aktif. Silakan gunakan password di bawah ini untuk login.
          </p>
          <div className="bg-muted p-4 rounded-md w-full">
            <p className="text-sm text-muted-foreground">Password Anda:</p>
            <p className="text-2xl font-bold tracking-wider">{password}</p>
          </div>
          <Button asChild className="mt-4 w-full">
            <Link to="/login">Lanjut ke Halaman Login</Link>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding container-custom flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Verifikasi Akun</CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;