'use client';

import { useState, Suspense } from 'react';

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Loading from '@/components/Loading/Loading';

export default function SingleTable({ columns, data, loading = false }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="w-full space-y-4">
            <Table>
                <TableHeader className="bg-grisclaro">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b-0 border-blanco">
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    className={`relative h-[45px] text-[12px] font-medium leading-[13px] text-[#8D8989] 2xl:text-[12px] ${index === 0 ? 'rounded-bl-[10px] rounded-tl-[10px]' : ''} ${index === headerGroup.headers.length - 1 ? 'rounded-br-[10px] rounded-tr-[10px] text-center' : ''} ${index !== headerGroup.headers.length - 1 ? 'separator' : ''}`}
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
                    <Suspense
                        fallback={
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        }
                    >
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
                                            className="px-4 py-3 text-[12px] font-light leading-[13px] 2xl:text-[12px] 2xl:font-normal"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </Suspense>
                </TableBody>
            </Table>
        </div>
    );
}
