'use client';

import { useEffect, useState } from 'react';
import { getSupplierType } from '@/services/setting/supplierService';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

export default function AssignShupplierType({ id, refresh, open, onClose }) {
    const [supplierTypeData, setSupplierTypeData] = useState([]);
    const [selectedSupplierType, setSelectedSupplierType] = useState([]);

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
    }, [open, id]);

    const handleSupplierTypeChange = (supplierTypeId) => {
        setSelectedSupplierType((prevSelectedSupplierType) =>
            prevSelectedSupplierType.includes(supplierTypeId)
                ? prevSelectedSupplierType.filter((id) => id !== supplierTypeId)
                : [...prevSelectedSupplierType, supplierTypeId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/partner/${id}/supplier`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ supplierRelations: selectedSupplierType }),
            });

            if (response.ok) {
                console.log('Relaciones de transporte actualizadas correctamente');
                await refresh();
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Error actualizando las relaciones:', errorData);
            }
        } catch (error) {
            console.error('Error actualizando las relaciones:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Asignar Tipos de Proveedor</DialogTitle>
                    <DialogDescription>
                        Selecciona los tipos de proveedores que deseas asignar al Socio.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-[15px] grid grid-cols-1">
                        <div className="flex flex-row flex-wrap">
                            {supplierTypeData.map((type) => (
                                <div
                                    key={type.id}
                                    className="flex w-[150px] items-center px-4 py-1"
                                >
                                    <input
                                        type="checkbox"
                                        id={`supplierType-${type.id}`}
                                        checked={selectedSupplierType.includes(type.id)}
                                        onChange={() => handleSupplierTypeChange(type.id)}
                                        className={`mr-2 h-4 w-4 cursor-pointer rounded-[4px] ${
                                            selectedSupplierType.includes(type.id)
                                                ? 'checked:accent-[#01E469] focus:ring-offset-0'
                                                : ''
                                        }`}
                                    />
                                    <label
                                        htmlFor={`supplierType-${type.id}`}
                                        className="cursor-pointer text-[14px] font-normal text-[#646464]"
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
