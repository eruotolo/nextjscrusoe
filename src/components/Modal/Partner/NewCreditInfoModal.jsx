'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { createCreditInfo } from '@/services/setting/creditInfoPartnerService';
import { getCurrenies } from '@/services/setting/currencyService';
import { Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

export default function NewCreditInfoModal({ id, refresh }) {
    const [currenciesOne, setCurrenciesOne] = useState([]);
    const [currenciesTwo, setCurrenciesTwo] = useState([]);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchCurrencies = async () => {
            const currenciesData = await getCurrenies();
            setCurrenciesOne(currenciesData);
            setCurrenciesTwo(currenciesData);
        };
        fetchCurrencies();
    }, []);

    const onSubmit = async (data) => {
        setError('');
        try {
            const formattedData = {
                freightCreditTerm: data.freightCreditTerm,
                freightCreditAmount: data.freightCreditAmount,
                freightCreditCurrency: data.freightCreditCurrency,
                termCreditExpenses: data.termCreditExpenses,
                termCreditAmount: data.termCreditAmount,
                termCreditCurrency: data.termCreditCurrency,
                incomeAccountNumber: data.incomeAccountNumber,
                outgoingAccountNumber: data.outgoingAccountNumber,
                partnerId: String(id),
            };

            const createdCreditInfo = await createCreditInfo(formattedData);
            //console.log('Datos:', createdCreditInfo);

            if (createdCreditInfo) {
                await refresh();
                reset();
            }
        } catch (error) {
            setError('Error de red');
            console.error('Error creating', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex h-[36px] w-[100px] items-center justify-center rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[100px]">
                Nuevo
                <Plus className="ml-[5px] h-3 w-3" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>Crear Información de Crédito</DialogTitle>
                    <DialogDescription>Introduce los detalles del crédito.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-between">
                        <div className="mb-[15px]">
                            <input
                                id="freightCreditTerm"
                                type="text"
                                placeholder="Plazo Credito Flete / Días"
                                {...register('freightCreditTerm', { required: true })}
                                className="custom-input w-[220px]"
                            />
                            {errors.freightCreditTerm && <span>Este campo es obligatorio</span>}
                        </div>
                        <div className="mb-[15px]">
                            <select
                                id="freightCreditCurrency"
                                {...register('freightCreditCurrency', { required: true })}
                                className="custom-select"
                                defaultValue=""
                            >
                                <option
                                    value=""
                                    disabled
                                    className="text-[14px] font-light text-muted-foreground"
                                >
                                    Seleccionar La Moneda
                                </option>
                                {currenciesOne.map((currency) => (
                                    <option key={currency.id} value={currency.id}>
                                        {currency.code}-{currency.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-[15px]">
                            <input
                                id="freightCreditAmount"
                                type="text"
                                placeholder="Crédito Monto"
                                {...register('freightCreditAmount', { required: true })}
                                className="custom-input"
                            />
                            {errors.freightCreditAmount && <span>Este campo es obligatorio</span>}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="mb-[15px]">
                            <input
                                id="termCreditExpenses"
                                type="text"
                                placeholder="Plazo Crédito Gastos / Días"
                                {...register('termCreditExpenses', { required: true })}
                                className="custom-input w-[220px]"
                            />
                            {errors.termCreditExpenses && <span>Este campo es obligatorio</span>}
                        </div>
                        <div className="mb-[15px]">
                            <select
                                id="termCreditCurrency"
                                {...register('termCreditCurrency', { required: true })}
                                className="custom-select"
                                defaultValue=""
                            >
                                <option
                                    value=""
                                    disabled
                                    className="text-[14px] font-light text-muted-foreground"
                                >
                                    Seleccionar La Moneda
                                </option>
                                {currenciesTwo.map((currency) => (
                                    <option key={currency.id} value={currency.id}>
                                        {currency.code}-{currency.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-[15px]">
                            <input
                                id="termCreditAmount"
                                type="text"
                                placeholder="Crédito Monto"
                                {...register('termCreditAmount', { required: true })}
                                className="custom-input"
                            />
                            {errors.termCreditAmount && <span>Este campo es obligatorio</span>}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mb-[15px] mr-[20px]">
                            <input
                                id="incomeAccountNumber"
                                type="text"
                                placeholder="Número de cuenta de ingreso"
                                {...register('incomeAccountNumber', { required: true })}
                                className="custom-input w-[300px]"
                            />
                            {errors.incomeAccountNumber && <span>Este campo es obligatorio</span>}
                        </div>
                        <div className="mb-[15px]">
                            <input
                                id="outgoingAccountNumber"
                                type="text"
                                placeholder="Número de cuenta de egreso"
                                {...register('outgoingAccountNumber', { required: true })}
                                className="custom-input w-[300px]"
                            />
                            {errors.outgoingAccountNumber && <span>Este campo es obligatorio</span>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button type="submit" className="custom-button">
                                Crear Crédito
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
