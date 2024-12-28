'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { getPartnerById } from '@/services/setting/partnerService';
import { getPartnerTypeById } from '@/services/setting/partnerTypeService';
import { getCountriesByCode } from '@/services/setting/countriesService';
import { getCityById } from '@/services/setting/cityService';
import { getSupplierType } from '@/services/setting/supplierService';
import Loading from '@/components/Loading/Loading';

export default function UniquePartner({ id }) {
    const [partnerTypeName, setPartnerTypeName] = useState('');
    const [cityName, setCityName] = useState('');
    const [countryName, setCountryName] = useState('');

    const [supplierTypeData, setSupplierTypeData] = useState([]);
    const [selectedSupplierType, setSelectedSupplierType] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const { register, setValue } = useForm();

    // Cargar datos del partner único
    useEffect(() => {
        const fetchUniquePartner = async () => {
            if (id) {
                try {
                    setIsLoading(true);
                    const partnerUniqueData = await getPartnerById(id);
                    if (partnerUniqueData) {
                        // OBTENER LOS DATOS DE PARTNERTYPE
                        const partnerTypeData = await getPartnerTypeById(
                            partnerUniqueData.partnerTypeId
                        );
                        setPartnerTypeName(partnerTypeData.name || '');

                        // OBTENER LOS DATOS DEL PAÍS
                        const codeCountryData = await getCountriesByCode(
                            partnerUniqueData.codeCountry
                        );
                        setCountryName(codeCountryData.name || '');

                        // OBTENER LOS DATOS DE LA CIUDAD
                        const codeCityData = await getCityById(partnerUniqueData.codeCity);
                        setCityName(codeCityData.name || '');

                        // Llenar los valores del formulario
                        setValue('name', partnerUniqueData.name || '');
                        setValue('rut', partnerUniqueData.rut || '');
                        setValue('socialReazon', partnerUniqueData.socialReazon || '');
                        setValue('taxId', partnerUniqueData.taxId || '');
                        setValue('address', partnerUniqueData.address || '');
                        setValue('zipCode', partnerUniqueData.zipCode || '');
                        setValue('locations', partnerUniqueData.locations || '');
                        setValue('phone', partnerUniqueData.phone || '');
                        setValue('scacCode', partnerUniqueData.scacCode || '');
                    }
                } catch (error) {
                    console.error('Error al obtener datos del partner:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUniquePartner();
    }, [id, setValue]);

    // OBTENGO LOS SUPPLIER TYPE
    useEffect(() => {
        const fecthSupplierType = async () => {
            try {
                const data = await getSupplierType();
                setSupplierTypeData(data);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };

        fecthSupplierType();
    }, []);

    // OBTENGO LOS SUPPLIER ASIGNADOS AL PARTNER
    useEffect(() => {
        const fetchPartnerSupplierType = async () => {
            try {
                const response = await fetch(`/api/partner/${id}/supplier`);
                const data = await response.json();
                setSelectedSupplierType(data.map((relation) => relation.supplierTypeId));
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };

        if (open) {
            fetchPartnerSupplierType();
        }
    }, [id]);

    return (
        <div>
            <div className="mb-[20px]">
                <h5 className="mb-[5px] font-medium leading-none tracking-tight">
                    Información del Socio Comercial
                </h5>
                <p className="text-[13px] text-muted-foreground">
                    Consulta y visualiza los datos clave del Socio Comercial, incluyendo información
                    de contacto, ubicación, tipo de socio y otros detalles relevantes para facilitar
                    la gestión.
                </p>
            </div>
            {isLoading ? (
                <div className="h-[40px]">
                    <Loading />
                </div>
            ) : (
                <form>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="mb-[7px]">
                            <label htmlFor="partnerType" className="custom-label">
                                Tipo de Socio
                            </label>
                            <input
                                type="text"
                                readOnly
                                className="custom-input"
                                value={partnerTypeName}
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="name" className="custom-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                readOnly
                                className="custom-input"
                                {...register('name')}
                            />
                        </div>
                    </div>

                    {partnerTypeName === 'Proveedor' && (
                        <div className="mb-[15px] grid grid-cols-1">
                            <label className="custom-label">Tipos de Proveedor Asignados</label>
                            <div className="flex flex-row flex-wrap gap-2">
                                {supplierTypeData
                                    .filter((type) => selectedSupplierType.includes(type.id))
                                    .map((type) => (
                                        <span key={type.id} className="custom-input w-auto">
                                            {type.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2">
                        <div className="mb-[7px]">
                            <label htmlFor="socialReazon" className="custom-label">
                                Razón Social
                            </label>
                            <input
                                type="text"
                                id="socialReazon"
                                {...register('socialReazon')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="mb-[7px]">
                            <label htmlFor="rut" className="custom-label">
                                RUT
                            </label>
                            <input
                                type="text"
                                id="rut"
                                {...register('rut')}
                                readOnly
                                className="custom-input"
                            />
                        </div>

                        <div className="mb-[7px]">
                            <label htmlFor="taxId" className="custom-label">
                                Tax Id
                            </label>
                            <input
                                type="text"
                                id="taxId"
                                {...register('taxId')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="scacCode" className="custom-label">
                                SCAC Code
                            </label>
                            <input
                                type="text"
                                id="scacCode"
                                {...register('scacCode')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="phone" className="custom-label">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                id="city"
                                {...register('phone')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="mb-[7px]">
                            <label htmlFor="address" className="custom-label">
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="address"
                                {...register('address')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="mb-[7px]">
                            <label htmlFor="zipCode" className="custom-label">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                {...register('zipCode')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="locations" className="custom-label">
                                Localidad
                            </label>
                            <input
                                type="text"
                                id="locations"
                                {...register('locations')}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="pais" className="custom-label">
                                País
                            </label>
                            <input
                                type="text"
                                id="pais"
                                value={countryName}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                        <div className="mb-[7px]">
                            <label htmlFor="city" className="custom-label">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={cityName}
                                readOnly
                                className="custom-input"
                            />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
