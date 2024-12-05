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

import { getCountries } from '@/services/countryService';
import { getAirportById, updateAirport } from '@/services/airportService';

import { EditMapsComponent } from '@/components/Maps/EditMapsComponents';

export default function EditAirportModal({ id, refresh, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

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

    useEffect(() => {
        const fetchAirport = async () => {
            if (id) {
                const airportData = await getAirportById(id);
                console.log('Airport data fetched:', airportData);
                if (airportData) {
                    setSelectedCountry(airportData.codeCountry);
                    setValue('name', airportData.name);
                    setValue('gcdiata', airportData.gcdiata || '');
                    setValue('gcdicao', airportData.gcdicao || '');
                    setValue('geocode', airportData.geocode || '');
                    setValue('latitude', airportData.latitude || '');
                    setValue('longitude', airportData.longitude || '');
                    setLatitude(airportData.latitude || '');
                    setLongitude(airportData.longitude || '');
                }
            }
        };
        if (open) {
            fetchAirport();
        }
    }, [id, open, setValue]);

    const handleLocationChange = (lng, lat) => {
        setLongitude(lng);
        setLatitude(lat);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await updateAirport(id, {
                ...data,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                codeCountry: selectedCountry,
            });
            console.log(response);
            if (response) {
                await refresh();
                onClose();
            } else {
                console.error('No se pudo actualizar la data');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Editar Airport</DialogTitle>
                    <DialogDescription>
                        Edita el nombre y actualiza los datos relacionados con este airport.
                        Asegúrate de que los cambios reflejen correctamente la información antes de
                        guardar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="mb-[15px] grid grid-cols-2">
                        <div className="col-span-1 pr-[10px]">
                            <div className="mb-[15px] grid grid-cols-1">
                                <label htmlFor="country" className="custom-label">
                                    País
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
                            <div className="mb-[15px]">
                                <label htmlFor="name" className="custom-label">
                                    Nombre Aeropuerto
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="custom-input"
                                    {...register('name')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label htmlFor="gcdiata" className="custom-label">
                                    GCDIATA
                                </label>
                                <input
                                    type="text"
                                    id="gcdiata"
                                    className="custom-input"
                                    {...register('gcdiata')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label htmlFor="gcdicao" className="custom-label">
                                    GCDICAO
                                </label>
                                <input
                                    type="text"
                                    id="gcdicao"
                                    className="custom-input"
                                    {...register('gcdicao')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label htmlFor="geocode" className="custom-label">
                                    GEOCODE
                                </label>
                                <input
                                    type="text"
                                    id="geocode"
                                    className="custom-input"
                                    {...register('geocode')}
                                />
                            </div>
                            <div className="mb-[15px]">
                                <label htmlFor="latitude" className="custom-label">
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
                            <div className="mb-[15px]">
                                <label htmlFor="longitude" className="custom-label">
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
                        </div>
                        <div className="col-span-1 pr-[10px]">
                            <EditMapsComponent
                                lat={latitude}
                                lng={longitude}
                                onLocationChange={handleLocationChange}
                            />
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
