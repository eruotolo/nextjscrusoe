'use client';

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
import { getCitiesCountry } from '@/services/cityService';
import { getPlacesById } from '@/services/placesService';

import { EditMapsComponent } from '@/components/Maps/EditMapsComponents';

export default function ViewPlacesModal({ id, open, onClose }) {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                const cityData = await getCitiesCountry(selectedCountry);
                setCities(cityData);
            } else {
                setCities([]);
                setSelectedCity('');
            }
        };
        fetchCities();
    }, [selectedCountry]);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (id) {
                const placesData = await getPlacesById(id);
                if (placesData) {
                    setSelectedCountry(placesData.codeCountry);
                    const cityData = await getCitiesCountry(placesData.codeCountry);
                    setCities(cityData);
                    setSelectedCity(placesData.codeCity);
                    setLatitude(placesData.latitude || '');
                    setLongitude(placesData.longitude || '');
                    setName(placesData.name || '');
                    setAddress(placesData.address || '');
                    setZipCode(placesData.zipCode || '');
                    setContactName(placesData.contactName || '');
                    setContactPhone(placesData.contactPhone || '');
                    setContactEmail(placesData.contactEmail || '');
                }
            }
        };

        if (open) {
            fetchPlaces();
        }
    }, [id, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle>Ver Lugar</DialogTitle>
                    <DialogDescription>
                        Aquí puedes ver los detalles del lugar seleccionado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2">
                    <div className="col-span-1 flex flex-col justify-center pr-[10px]">
                        <div className="mb-[10px] grid grid-cols-3">
                            <label
                                htmlFor="name"
                                className="col-span-1 mr-[10px] px-[15px] pt-[13px] text-[14px] font-light text-[#646464]"
                            >
                                PAÍS
                            </label>
                            <select
                                id="country"
                                value={selectedCountry}
                                disabled
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
                                htmlFor="city"
                                className="col-span-1 mr-[10px] px-[15px] pt-[13px] text-[14px] font-light text-[#646464]"
                            >
                                CIUDAD
                            </label>
                            <select
                                id="city"
                                value={selectedCity}
                                disabled
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
                                value={name}
                                disabled
                            />
                        </div>
                        <div className="mb-[10px] grid grid-cols-1">
                            <label
                                htmlFor="address"
                                className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                            >
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="address"
                                placeholder="Dirección del lugar"
                                className="custom-input"
                                value={address}
                                disabled
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
                                    value={latitude}
                                    disabled
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
                                    value={longitude}
                                    disabled
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
                                    value={zipCode}
                                    disabled
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
                                    value={contactName}
                                    disabled
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
                                    value={contactPhone}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="mb-[10px] grid grid-cols-1">
                            <label
                                htmlFor="contactEmail"
                                className="mb-1 px-[15px] text-[13px] font-normal text-[#646464]"
                            >
                                Email Contacto
                            </label>
                            <input
                                type="text"
                                id="contactEmail"
                                className="custom-input"
                                value={contactEmail}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-span-1 pl-[10px]">
                        {latitude && longitude && (
                            <EditMapsComponent
                                lng={parseFloat(longitude)}
                                lat={parseFloat(latitude)}
                                disabled
                            />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <button onClick={onClose} className="custom-button">
                        Cerrar
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
