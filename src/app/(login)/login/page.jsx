import Image from 'next/image';
import LoginPage from '@/components/Login/Login';

export default function Login() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Ingresar</h1>
                        <p className="text-balance text-muted-foreground">
                            Ingresa tu correo electrónico para iniciar sesión.
                        </p>
                    </div>
                    <LoginPage />
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/auth-bg.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    priority={true}
                    className="h-[100vh] w-full object-cover"
                />
            </div>
        </div>
    );
}
