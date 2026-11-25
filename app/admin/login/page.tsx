'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrandLogo } from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Password yang dimasukkan salah');
        return;
      }

      router.push('/admin/submissions');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="border-border shadow-xs overflow-hidden bg-card">
          <div className="h-1.5 bg-gradient-to-r from-[#0a4da2] to-[#2aa8e8]" />
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={38} />
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                Liga PKM UTY 2026
              </p>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Akses Panitia
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Masukkan kunci akses admin untuk mengelola dan meninjau pendaftaran tim.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password Admin</Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="h-10 bg-background"
                  placeholder="Masukkan password admin..."
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>

              {error && (
                <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                  <AlertDescription className="text-rose-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-10 bg-primary text-primary-foreground hover:bg-[#083d82] font-semibold"
                disabled={loading}
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </main>
  );
}
