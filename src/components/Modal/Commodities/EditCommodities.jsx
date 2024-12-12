'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { getCommodities, updateCommodities } from '@/services/setting/commoditiesService';
import { getCommoditiesSection } from '@/services/setting/commoditiesSectionService';

export default function EditCommodities({ id, refresh, open, onClose }) {
    const [commoditiesSection, setCommoditiesSection] = useState([]);
    const [selectedCommoditiesSection, setSelectedCommoditiesSection] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCommoditiesSection = async () => {
            const commoditiesSectionData = await getCommoditiesSection();
            setCommoditiesSection(commoditiesSectionData);
        };
        fetchCommoditiesSection();
    }, []);
}
