import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    FilePenLine,
    PowerOff,
    KeyRound,
    View,
    UserCog,
    Trash2,
    CircleFadingPlus,
    CreditCard,
    ContactRound,
} from 'lucide-react';

export function BtnChangeTable({ onClick }) {
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger onClick={onClick}>
                        <PowerOff className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Cambiar Estado</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
}

export function BtnEditTable({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <FilePenLine className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Editar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnDeleteTable({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <Trash2 className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Eliminar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnChangePassTable({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <KeyRound className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Cambiar Password</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnViewTable({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <View className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ver</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnAssignRole({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <UserCog className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Asignar Role</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnAssign({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <CircleFadingPlus className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Asignar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnCredit({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <CreditCard className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Crédito</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function BtnContact({ onClick }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger onClick={onClick}>
                    <ContactRound className="h-[16px] w-[16px] cursor-pointer hover:text-verde" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Contactos</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
