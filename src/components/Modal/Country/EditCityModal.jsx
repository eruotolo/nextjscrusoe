'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getCityById, updateCity } from '@/services/cityService';
import { getCountries } from '@/services/countryService';

export default function EditCityModal({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCity = async () => {
            if (id) {
                const cityData = await getCityById(id);
                //console.log('City data fetched:', cityData);
                if (cityData) {
                    setValue('name', cityData.name);
                    setSelectedCountry(cityData.countryCode);
                }
            }
        };
        if (open) {
            fetchCity();
        }
    }, [id, setValue, open]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedCity = await updateCity(id, {
                ...data,
                countryCode: selectedCountry,
            });
            if (updatedCity) {
                await refresh();
                onClose();
            } else {
                console.error('No se pudo actualizar la ciudad');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Ciudad</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con esta ciudad.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="country" className="custom-label">
                            Páis
                        </label>
                        <select
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="custom-select"
                        >
                            <option value="" disabled>
                                Seleccionar el País
                            </option>
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <label htmlFor="name" className="custom-label">
                            Ciudad
                        </label>
                        <input
                            className="custom-input"
                            type="text"
                            {...register('name', { required: true })}
                        />

                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <DialogFooter>
                        <button type="submit" className="custom-button">
                            Actualizar
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
