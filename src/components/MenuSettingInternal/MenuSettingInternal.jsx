import ButtonSubMenu from '@/components/ButtonSubMenu/ButtonSubMenu';

export default function MenuSettingInternal() {
    return (
        <>
            <ButtonSubMenu titleButton="Usuarios" urlButton="/setting/users" />

            <ButtonSubMenu titleButton="Socios" urlButton="/setting/partners" />

            <ButtonSubMenu titleButton="Países" urlButton="/setting/country" />

            <ButtonSubMenu titleButton="Aeropuertos" urlButton="/setting/airport" />

            <ButtonSubMenu titleButton="Puertos" urlButton="/setting/port" />

            <ButtonSubMenu titleButton="Commodities" urlButton="/setting/commodities" />

            <ButtonSubMenu titleButton="Lugares" urlButton="/setting/places" />

            <ButtonSubMenu titleButton="Buques" urlButton="/setting/ships" />

            <ButtonSubMenu titleButton="Tráficos" urlButton="/setting/traffics" />

            <ButtonSubMenu titleButton="Incoterms" urlButton="/setting/incoterms" />
        </>
    );
}
