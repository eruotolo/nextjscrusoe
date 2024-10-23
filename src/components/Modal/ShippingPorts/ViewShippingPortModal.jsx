'use client';

import { useEffect, useState } from 'react';
import { getCountries } from '@/services/countryService';
import { getShippingPortById, updateShippingPort } from '@/services/shippingPortService';
import { MapsComponent } from '@/components/Maps/MapsComponent';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

export function ViewShippingPortModal() {
    const [countries, setCountries] = useState([]);
    const [countryName, setCountryName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
        };
        fetchCountries();
    }, []);

    return <></>;
}
