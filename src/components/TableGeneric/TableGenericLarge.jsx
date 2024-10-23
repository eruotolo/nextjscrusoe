'use client';
import { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import Loading from '@/components/Loading/Loading';

export default function TableGenericLarge({
    columns,
    data,
    exportToExcel,
    isExporting,
    loading = false,
    pagination,
    globalFilter,
    onGlobalFilterChange,
}) {
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: onGlobalFilterChange,
    });

    useEffect(() => {
        table.setPageSize(pagination.pageSize || 100);
    }, [pagination.pageSize, table]);

    const getDisplayedPages = () => {
        const totalPages = pagination.totalPages;
        const currentPage = pagination.currentPage;
        const delta = 2;
        const range = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }
        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-start justify-between">
                <Input
                    type="text"
                    placeholder="Filtrar..."
                    value={globalFilter}
                    onChange={(e) => onGlobalFilterChange(e.target.value)}
                    className="h-[38px] w-[180px] rounded-[10px] border-0 bg-[#faf8f8] px-[15px] py-[4px] text-[12px] text-[#8D8989] focus:ring-azul xl:w-[280px]"
                />
                <Button
                    onClick={exportToExcel}
                    disabled={isExporting}
                    className="mb-4 h-[38px] w-[150px] rounded-[10px] bg-verde text-[12px] font-normal hover:bg-gris 2xl:w-[150px]"
                >
                    {isExporting ? 'Exportando...' : 'Exportar a Excel'}
                    <FileSpreadsheet className="ml-[5px] h-[20px]" />
                </Button>
            </div>

            <Table>
                <TableHeader className="bg-grisclaro">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b-0 border-blanco">
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    className={`relative h-[45px] text-[12px] font-normal leading-[13px] text-[#8D8989] 2xl:text-[13px] ${index === 0 ? 'rounded-bl-[10px] rounded-tl-[10px]' : ''} ${index === headerGroup.headers.length - 1 ? 'rounded-br-[10px] rounded-tr-[10px] text-center' : ''} ${index !== headerGroup.headers.length - 1 ? 'separator' : ''}`}
                                    style={{
                                        width: header.column.columnDef.size
                                            ? `${header.column.columnDef.size}px`
                                            : 'auto',
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                <Loading />
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="border-0">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-4 py-3 text-[12px] font-light leading-[13px] 2xl:text-[13px] 2xl:font-normal"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            className={
                                pagination.currentPage === 1
                                    ? 'pointer-events-none text-[13px] font-normal opacity-50'
                                    : 'cursor-pointer text-[13px] font-normal'
                            }
                        />
                    </PaginationItem>
                    {getDisplayedPages().map((page, index) => (
                        <PaginationItem key={index}>
                            {typeof page === 'string' ? (
                                <span className="h-[30px] w-[30px] text-[13px] font-normal leading-[13px]">
                                    {page}
                                </span>
                            ) : (
                                <PaginationLink
                                    onClick={() => pagination.onPageChange(page)}
                                    isActive={pagination.currentPage === page}
                                    className="h-[30px] w-[30px] cursor-pointer border-verde text-[13px] font-normal leading-[13px]"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            className={
                                pagination.currentPage === pagination.totalPages
                                    ? 'pointer-events-none text-[13px] font-normal opacity-50'
                                    : 'cursor-pointer text-[13px] font-normal'
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
