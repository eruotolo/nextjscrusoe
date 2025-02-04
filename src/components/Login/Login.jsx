'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Eye, EyeOff, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const router = useRouter();
    const [error, setError] = useState(null);

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res.error) {
                switch (res.error) {
                    case 'No users found':
                        setError('No se encontró un usuario con este correo');
                        break;
                    case 'Wrong Password':
                        setError('La contraseña es incorrecta');
                        break;
                    default:
                        setError('Ha ocurrido un error durante el inicio de sesión');
                }
            } else {
                // Inicio de sesión exitoso, redirigir al dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            setError('Ha ocurrido un error inesperado. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <form className="mx-auto max-w-sm space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        {...register('email', { required: 'El correo electrónico es requerido' })}
                        className="w-[350px] pl-10"
                    />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={isPasswordHidden ? 'password' : 'text'}
                        placeholder="Ingresa tu contraseña"
                        {...register('password', {
                            required: 'La contraseña es requerida',
                        })}
                        className="w-[350px] pr-10"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setPasswordHidden(!isPasswordHidden)}
                    >
                        {isPasswordHidden ? (
                            <Eye className="h-4 w-4 text-gray-400" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <Link
                    href="/recovery"
                    className="block text-right text-sm text-primary hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="h-[50px] w-full rounded-[10px] bg-azul from-azul to-verde px-5 py-3 text-white duration-150 hover:bg-gradient-to-r active:bg-gradient-to-r"
            >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </form>
    );
}
