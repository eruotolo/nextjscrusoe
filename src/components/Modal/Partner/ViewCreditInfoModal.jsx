'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { getCreditInfoById } from '@/services/setting/creditInfoPartnerService';
import { getCurrencyById } from '@/services/setting/currencyService';
import Loading from '@/components/Loading/Loading';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ViewCreditInfoModal({ id, open, onClose }) {
    const [error, setError] = useState('');
    const [freightCreditCurrencyCode, setFreightCreditCurrencyCode] = useState('');
    const [termCreditCurrencyCode, setTermCreditCurrencyCode] = useState('');

    const { register, setValue } = useForm();

    useEffect(() => {
        const fetchUniqueCredit = async () => {
            if (id) {
                try {
                    const creditInfoData = await getCreditInfoById(id);
                    if (creditInfoData) {
                        // OBTENER LOS DATOS DE LAS MONEDAS FREIGHT
                        const currenciesData = await getCurrencyById(
                            creditInfoData.freightCreditCurrency,
                            creditInfoData.termCreditCurrency
                        );
                        setFreightCreditCurrencyCode(currenciesData.code);
                        setTermCreditCurrencyCode(currenciesData.code);

                        // LLENAR LOS VALORES DEL FORMULARIO
                        setValue('freightCreditTerm', creditInfoData.freightCreditTerm || '');
                        setValue('freightCreditAmount', creditInfoData.freightCreditAmount || '');
                        setValue('termCreditExpenses', creditInfoData.termCreditExpenses || '');
                        setValue('termCreditAmount', creditInfoData.termCreditAmount || '');
                        setValue('incomeAccountNumber', creditInfoData.incomeAccountNumber || '');
                        setValue(
                            'outgoingAccountNumber',
                            creditInfoData.outgoingAccountNumber || ''
                        );
                    }
                } catch (error) {
                    console.error('Error al obtener datos del partner:', error);
                    setError('Error al cargar los datos del crédito.');
                }
            }
        };
        fetchUniqueCredit();
    }, [id, setValue]);

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>Información Crédito Asociados al Socio</DialogTitle>
                    </DialogHeader>

                    <form>
                        <div className="my-[20px] flex flex-row justify-between">
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[140px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Plazo Crédito Flete
                                </label>
                                <input
                                    type="text"
                                    {...register('freightCreditTerm')}
                                    readOnly
                                    className="custom-input w-[120px] text-center"
                                />
                            </div>
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[150px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Crédito Monto
                                </label>
                                <input
                                    type="text"
                                    {...register('freightCreditAmount')}
                                    readOnly
                                    className="custom-input text-center"
                                />
                            </div>
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[120px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Crédito Moneda
                                </label>
                                <input
                                    type="text"
                                    value={freightCreditCurrencyCode}
                                    readOnly
                                    className="custom-input w-[120px] text-center"
                                />
                            </div>
                        </div>
                        <div className="my-[20px] flex flex-row justify-between">
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[140px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Plazo Crédito Gastos
                                </label>
                                <input
                                    type="text"
                                    {...register('termCreditExpenses')}
                                    readOnly
                                    className="custom-input w-[120px] text-center"
                                />
                            </div>
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[150px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Crédito Monto
                                </label>
                                <input
                                    type="text"
                                    {...register('termCreditAmount')}
                                    readOnly
                                    className="custom-input text-center"
                                />
                            </div>
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[120px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Crédito Moneda
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    className="custom-input w-[120px] text-center"
                                    value={termCreditCurrencyCode}
                                />
                            </div>
                        </div>
                        <div className="my-[20px] flex flex-row justify-between">
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[190px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Numero de cuenta de ingreso
                                </label>
                                <input
                                    type="text"
                                    {...register('incomeAccountNumber')}
                                    readOnly
                                    className="custom-input w-[250px] text-center"
                                />
                            </div>
                            <div className="flex h-[44px] items-center">
                                <label
                                    htmlFor=""
                                    className="w-[190px] text-[12px] font-medium text-[#8d8989]"
                                >
                                    Numero de cuenta de egreso
                                </label>
                                <input
                                    type="text"
                                    {...register('outgoingAccountNumber')}
                                    readOnly
                                    className="custom-input w-[250px] text-center"
                                />
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
