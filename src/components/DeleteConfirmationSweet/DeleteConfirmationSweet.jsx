import Swal from 'sweetalert2';
import { BtnDeleteTable } from '@/components/BtnTable/BtnTable';

const DeleteConfirmationSweet = ({ id, deleteFunction, refreshFunction, itemName }) => {
    const handleDelete = async () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await deleteFunction(id);
                if (success) {
                    await refreshFunction();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: `${itemName} ha sido eliminado.`,
                        icon: 'success',
                    });
                } else {
                    console.error(`Error deleting ${itemName}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelado',
                    text: `${itemName} está a salvo :)`,
                    icon: 'error',
                });
            }
        });
    };

    return <BtnDeleteTable onClick={handleDelete} />;
};

export default DeleteConfirmationSweet;
