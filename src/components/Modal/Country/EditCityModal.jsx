'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSettingContext } from '@/context/SettingContext';
import { getCityById, updateCity } from '@/services/cityService';
import { getCountries } from '@/services/countryService';

import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FilePenLine } from 'lucide-react';

export default function EditCityModal({ id }) {
    const { updateCities, updateCountries } = useSettingContext();
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cityName, setCityName] = useState('');

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
            const cityData = await getCityById(id);
            if (cityData) {
                setValue('name', cityData.name);
                setSelectedCountry(cityData.countryCode);
            }
        };
        fetchCity();
    }, [id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const updatedCity = await updateCity(id, {
                ...data,
                countryCode: selectedCountry,
            });
            if (updatedCity) {
                updateCities();
                updateCountries();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    });

    return (
        <Dialog>
            <DialogTrigger>
                <FilePenLine className="h-[18px] w-[18px] hover:text-verde" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
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
                        <Select
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                            value={selectedCountry}
                            onValueChange={setSelectedCountry}
                        >
                            <SelectTrigger className="w-full border-0 bg-grisclaro text-[#8D8989]">
                                <SelectValue placeholder="Seleccionar el País" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>País</SelectLabel>
                                    {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="mb-[15px] grid grid-cols-1">
                        <Input
                            type="text"
                            placeholder="Nombre Ciudad"
                            className="rounded-[10px] border-0 bg-grisclaro px-[15px] text-[#8D8989] focus:ring-azul"
                            {...register('name', { required: true })}
                        />
                        {errors.name && <span>Este campo es obligatorio</span>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                className="h-[36px] w-[120px] rounded-[10px] border-0 bg-gris text-[12px] font-normal text-blanco hover:bg-grisclaro hover:text-gris 2xl:w-[120px]"
                            >
                                Actualizar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
