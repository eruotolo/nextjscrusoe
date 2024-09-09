import Image from 'next/image';
import barco from '../../public/barco.jpg';
import HeaderPage from '@/components/HeaderPage/HeaderPage';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <section>
            <div className="container z-10 mx-auto">
                <HeaderPage />

                <div className="flex h-[80vh] flex-col justify-center">
                    <h1 className="z-10 font-bold text-blanco">Somos Crusoe Cargo</h1>
                    <h4 className="text-light z-10 mb-[20px] pr-[50%] font-light text-blanco">
                        Movemos tus cargas desde y hacia cualquier lugar del mundo sin trabas ni
                        demoras para que tu logística sea eficiente.
                    </h4>
                    <Button className="z-10 mb-[70px] mt-[20px] w-[140px] rounded-[20px] bg-azul bg-gradient-to-r from-azul to-verde hover:bg-gradient-to-l active:bg-gradient-to-r">
                        <a
                            href="https://crusoecargo.com/"
                            target="_blank"
                            className="text-[16px] font-light"
                        >
                            Mas info
                        </a>
                    </Button>

                    <h5 className="z-10 mb-[10px] font-light text-blanco">
                        Realiza seguimiento en línea
                    </h5>
                    <div className="flex">
                        <div className="relative z-10 flex-1 md:grow-0">
                            <Input
                                type="search"
                                placeholder="Ingrese Nro de Track..."
                                className="z-10 w-full rounded-[10px] bg-background pl-10 md:w-[200px] lg:w-[500px]"
                            />
                            <Search className="absolute left-2.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        </div>
                        <Button className="z-10 ml-[10px] w-[120px] rounded-[20px] bg-verde from-azul to-verde text-[16px] font-light hover:bg-gradient-to-r">
                            Buscar
                        </Button>
                    </div>
                </div>
            </div>

            <Image
                src={barco}
                alt="Imagen principal"
                placeholder="blur"
                quality={100}
                fill
                sizes="100vw"
                style={{
                    objectFit: 'cover',
                }}
            />
        </section>
    );
}
