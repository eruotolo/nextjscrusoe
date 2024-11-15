'use client';

import { useEffect, useState } from 'react';
import { getTransportType } from '@/services/transportTypeService';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function AssignTransportIncotermsModal({ id, refresh, open, onClose }) {
    const [transportTypeData, setTransportTypeData] = useState([]);
    const [selectedTransportType, setSelectedTransportType] = useState([]);

    // OBTIENE LOS TIPOS DE TRANSPORTE
    useEffect(() => {
        const fetchTransportType = async () => {
            try {
                const data = await getTransportType();
                setTransportTypeData(data);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };

        fetchTransportType();
    }, []);

    // OBTIENE LOS TRANSPORTES ASIGNADOS AL INCOTERMS
    useEffect(() => {
        const fetchIncotermsTransport = async () => {
            try {
                const res = await fetch(`/api/incoterms/${id}/transport`);
                const data = await res.json();
                setSelectedTransportType(data.map((relation) => relation.transportTypeId));
            } catch (error) {
                console.error('Error fetching incoterms transport relations:', error);
            }
        };

        if (open) {
            fetchIncotermsTransport();
        }
    }, [open, id]);

    const handleTransportTypeChange = (transportTypeId) => {
        setSelectedTransportType((prevSelectedTransportType) =>
            prevSelectedTransportType.includes(transportTypeId)
                ? prevSelectedTransportType.filter((id) => id !== transportTypeId)
                : [...prevSelectedTransportType, transportTypeId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/incoterms/${id}/transport`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transportRelations: selectedTransportType }),
            });

            if (res.ok) {
                console.log('Relaciones de transporte actualizadas correctamente');
                await refresh();
                onClose();
            } else {
                const errorData = await res.json();
                console.error('Error actualizando las relaciones de transporte:', errorData);
            }
        } catch (error) {
            console.error('Error actualizando las relaciones de transporte:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Asignar Tipos de Transporte</DialogTitle>
                    <DialogDescription>
                        Selecciona los tipos de transporte que deseas asignar al Incoterms.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <div className="flex flex-row flex-wrap">
                            {transportTypeData.map((type) => (
                                <div key={type.id} className="flex items-center px-4 py-1">
                                    <input
                                        type="checkbox"
                                        id={`transportType-${type.id}`}
                                        checked={selectedTransportType.includes(type.id)}
                                        onChange={() => handleTransportTypeChange(type.id)}
                                        className={`mr-2 h-4 w-4 rounded-[4px] ${
                                            selectedTransportType.includes(type.id)
                                                ? 'checked:accent-[#01E469] focus:ring-offset-0'
                                                : ''
                                        }`}
                                    />
                                    <label
                                        htmlFor={`transportType-${type.id}`}
                                        className="text-[14px] font-normal text-[#646464]"
                                    >
                                        {type.name}
                                    </label>
                                </div>
                            ))}
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
