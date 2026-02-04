"use client";

import {
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2
} from "lucide-react";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    onEdit,
    onDelete,
    isLoading
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 flex justify-center items-center">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest ${col.className}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                    className="px-6 py-12 text-center text-gray-500 font-medium"
                                >
                                    Không có dữ liệu hiển thị.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    {columns.map((col, idx) => (
                                        <td key={idx} className={`px-6 py-4 text-sm font-bold text-gray-700 ${col.className}`}>
                                            {typeof col.accessor === "function"
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 hover:bg-white hover:text-blue-600 rounded-lg text-gray-400 transition-all"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="p-2 hover:bg-white hover:text-red-600 rounded-lg text-gray-400 transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination Placeholder */}
            <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">Hiển thị {data.length} kết quả</p>
                <div className="flex gap-2">
                    <button disabled className="p-1 rounded bg-white border border-gray-200 text-gray-400 opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                    <button disabled className="p-1 rounded bg-white border border-gray-200 text-gray-400 opacity-50"><ChevronRight className="h-4 w-4" /></button>
                </div>
            </div>
        </div>
    );
}
