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

import { getCountries } from '@/services/setting/countryService';
import { getCitiesCountry } from '@/services/setting/cityService';
import { getPlacesById, updatePlace } from '@/services/setting/placesService';

import { EditMapsComponent } from '@/components/Maps/EditMapsComponents';

export default function EditPlacesModal({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

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

    // Cargar las ciudades cuando cambia el país seleccionado
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                const cityData = await getCitiesCountry(selectedCountry);
                setCities(cityData);

                // Solo resetea la ciudad si el país fue cambiado manualmente, no durante la carga inicial
                if (!id) {
                    setSelectedCity(''); // Resetea la ciudad seleccionada si el país fue cambiado manualmente
                }
            } else {
                setCities([]);
                setSelectedCity(''); // Resetea la ciudad seleccionada si no hay país seleccionado
            }
        };
        fetchCities();
    }, [selectedCountry, id]);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (id) {
                const placesData = await getPlacesById(id);
                if (placesData) {
                    setSelectedCountry(placesData.codeCountry);

                    // Carga las ciudades del país seleccionado para luego establecer la ciudad seleccionada
                    const cityData = await getCitiesCountry(placesData.codeCountry);
                    setCities(cityData);
                    setSelectedCity(placesData.codeCity); // Establece la ciudad seleccionada

                    setValue('name', placesData.name || '');
                    setValue('address', placesData.address || '');
                    setValue('zipCode', placesData.zipCode || '');
                    setValue('contactName', placesData.contactName || '');
                    setValue('contactEmail', placesData.contactEmail || '');
                    setValue('contactPhone', placesData.contactPhone || '');
                    setValue('latitude', placesData.latitude || '');
                    setValue('longitude', placesData.longitude || '');
                    setLatitude(placesData.latitude || '');
                    setLongitude(placesData.longitude || '');
                }
                console.log('PlacesData:', placesData);
            }
        };

        if (open) {
            fetchPlaces();
        }
    }, [id, open, setValue]);

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await updatePlace(id, {
                ...data,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                codeCountry: selectedCountry,
                codeCity: parseInt(selectedCity, 10),
            });
            console.log(response);
            if (response) {
                await refresh();
                onClose();
            } else {
                console.error('No se pudo actualizar la data');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle>Editar Lugar</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados al lugar. Asegúrate de
                        que los cambios reflejen correctamente la información antes de guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 flex flex-col justify-center pr-[10px]">
                            <div className="mb-[10px] grid grid-cols-3">
                                <label
                                    htmlFor="name"
                                    className="col-span-1 mr-[10px] px-[15px] pt-[13px] text-[14px] font-light text-[#646464]"
                                >
                                    ASIGNAR PAÍS
                                </label>
                                <select
                                    id="country"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="custom-select col-span-2"
                                >
                                    <option value="" disabled className="text-[15px] font-light">
                                        SELECCIONAR EL PAÍS
                                    </option>
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-[10px] grid grid-cols-3">
                                <label
                                    htmlFor="name"
                                    className="col-span-1 mr-[10px] px-[15px] pt-[13px] text-[14px] font-light text-[#646464]"
                                >
                                    ASIGNAR CIUDAD
                                </label>
                                <select
                                    id="city"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="custom-select col-span-2"
                                >
                                    <option value="" disabled className="text-[15px] font-light">
                                        SELECCIONAR LA CIUDAD
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-[10px] grid grid-cols-1">
                                <label
                                    htmlFor="name"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Nombre del Lugar
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nombre del lugar"
                                    className="custom-input"
                                    {...register('name')}
                                />
                            </div>
                            <div className="mb-[10px] grid grid-cols-1">
                                <label
                                    htmlFor="name"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="Dirección del lugar"
                                    className="custom-input"
                                    {...register('address')}
                                />
                            </div>
                            <div className="grid grid-cols-3">
                                <div className="col-span-1 mb-[10px] mr-[8px]">
                                    <label
                                        htmlFor="latitude"
                                        className="px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Latitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="latitude"
                                        className="custom-input"
                                        {...register('latitude')}
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-1 mb-[10px] mr-[8px]">
                                    <label
                                        htmlFor="longitude"
                                        className="px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Longitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="longitude"
                                        className="custom-input"
                                        {...register('longitude')}
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-1 mb-[10px]">
                                    <label
                                        htmlFor="zipCode"
                                        className="px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Zip Code
                                    </label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        className="custom-input"
                                        {...register('zipCode')}
                                    />
                                </div>
                            </div>
                            <div className="mb-[10px] grid grid-cols-2">
                                <div className="col-span-1 mr-[10px]">
                                    <label
                                        htmlFor="name"
                                        className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Nombre Contacto
                                    </label>
                                    <input
                                        type="text"
                                        id="contactName"
                                        className="custom-input"
                                        {...register('contactName')}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="name"
                                        className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                    >
                                        Teléfono Contacto
                                    </label>
                                    <input
                                        type="text"
                                        id="contactPhone"
                                        className="custom-input"
                                        {...register('contactPhone')}
                                    />
                                </div>
                            </div>
                            <div className="mb-[10px] grid grid-cols-1">
                                <label
                                    htmlFor="name"
                                    className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                                >
                                    Email Contacto
                                </label>
                                <input
                                    type="text"
                                    id="contactEmail"
                                    className="custom-input"
                                    {...register('contactEmail')}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 pl-[10px]">
                            {latitude && longitude && (
                                <EditMapsComponent
                                    lng={parseFloat(longitude)}
                                    lat={parseFloat(latitude)}
                                    onLocationChange={handleLocationChange}
                                />
                            )}
                        </div>
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
