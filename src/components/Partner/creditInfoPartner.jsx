'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';

import { getCreditInfoById } from '@/services/setting/creditInfoPartnerService';
import { getCurrencyById } from '@/services/setting/currencyService';
import Loading from '@/components/Loading/Loading';
import NewCreditInfoModal from '@/components/Modal/Partner/NewCreditInfoModal';

export default function CreditInfoPartner({ id }) {
    const [error, setError] = useState('');
    const [freightCreditCurrencyCode, setFreightCreditCurrencyCode] = useState('');
    const [termCreditCurrencyCode, setTermCreditCurrencyCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { register, setValue, watch } = useForm();

    const fetchUniqueCredit = useCallback(async () => {
        if (id) {
            try {
                setIsLoading(true);
                const creditInfoData = await getCreditInfoById(id);
                if (creditInfoData) {
                    const currenciesData = await getCurrencyById(
                        creditInfoData.freightCreditCurrency,
                        creditInfoData.termCreditCurrency
                    );
                    setFreightCreditCurrencyCode(currenciesData.code);
                    setTermCreditCurrencyCode(currenciesData.code);

                    setValue('freightCreditTerm', creditInfoData.freightCreditTerm || '');
                    setValue('freightCreditAmount', creditInfoData.freightCreditAmount || '');
                    setValue('termCreditExpenses', creditInfoData.termCreditExpenses || '');
                    setValue('termCreditAmount', creditInfoData.termCreditAmount || '');
                    setValue('incomeAccountNumber', creditInfoData.incomeAccountNumber || '');
                    setValue('outgoingAccountNumber', creditInfoData.outgoingAccountNumber || '');
                }
            } catch (error) {
                console.error('Error al obtener datos del partner:', error);
                setError('Error al cargar los datos del credito.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [id, setValue]);

    useEffect(() => {
        fetchUniqueCredit();
    }, [fetchUniqueCredit]);

    const formValues = watch();

    const isFormEmpty = Object.values(formValues).every((value) => !value);

    return (
        <>
            <div className="flex h-auto w-full justify-between">
                <div>
                    <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                        Información Crédito
                    </h5>
                    <p className="text-[13px] text-muted-foreground">Crear, Editar y Eliminar</p>
                </div>
                <div>
                    {isFormEmpty ? (
                        <NewCreditInfoModal id={id} refresh={fetchUniqueCredit} />
                    ) : (
                        <button>Editar</button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="h-[40px]">
                    <Loading />
                </div>
            ) : (
                <div>
                    <div className="my-[20px] flex flex-row justify-between">
                        <div>
                            <label htmlFor="" className="custom-label">
                                Plazo Crédito Flete
                            </label>
                            <input
                                type="text"
                                {...register('freightCreditTerm')}
                                readOnly
                                className="custom-input text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="custom-label">
                                Crédito Monto
                            </label>
                            <input
                                type="text"
                                {...register('freightCreditAmount')}
                                readOnly
                                className="custom-input text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="custom-label">
                                Crédito Moneda
                            </label>
                            <input
                                type="text"
                                value={freightCreditCurrencyCode}
                                readOnly
                                className="custom-input text-center"
                            />
                        </div>
                    </div>
                    <div className="my-[20px] flex flex-row justify-between">
                        <div>
                            <label htmlFor="" className="custom-label">
                                Plazo Crédito Gastos
                            </label>
                            <input
                                type="text"
                                {...register('termCreditExpenses')}
                                readOnly
                                className="custom-input text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="custom-label">
                                Crédito Monto
                            </label>
                            <input
                                type="text"
                                {...register('termCreditAmount')}
                                readOnly
                                className="custom-input text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="" className="custom-label">
                                Crédito Moneda
                            </label>
                            <input
                                type="text"
                                readOnly
                                className="custom-input text-center"
                                value={termCreditCurrencyCode}
                            />
                        </div>
                    </div>
                    <div className="my-[20px] flex flex-row justify-between">
                        <div className="w-[48%]">
                            <label htmlFor="" className="custom-label">
                                Numero de cuenta de ingreso
                            </label>
                            <input
                                type="text"
                                {...register('incomeAccountNumber')}
                                readOnly
                                className="custom-input w-full text-center"
                            />
                        </div>
                        <div className="w-[48%]">
                            <label htmlFor="" className="custom-label">
                                Numero de cuenta de egreso
                            </label>
                            <input
                                type="text"
                                {...register('outgoingAccountNumber')}
                                readOnly
                                className="custom-input w-full text-center"
                            />
                        </div>
                    </div>
                    {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
                </div>
            )}
        </>
    );
}
