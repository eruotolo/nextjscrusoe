'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getCommoditiesSection } from '@/services/setting/commoditiesSectionService';

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

import { Plus } from 'lucide-react';

export default function NewCommodities({ refresh }) {
    const [commoditiesSection, setCommoditiesSection] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCommoditiesSection = async () => {
            const commoditiesSectionData = await getCommoditiesSection();
            setCommoditiesSection(commoditiesSectionData);
        };
        fetchCommoditiesSection();
    }, []);
}
