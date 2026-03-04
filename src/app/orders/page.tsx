'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { CargoType, Order } from '@/lib/types';
import { deleteOrder as deleteOrderFromStorage, loadOrders, subscribeOrders } from '@/lib/storage';
import { OrderCard } from '@/components/OrderCard';
import { Modal } from '@/components/Modal';

type CargoFilter = 'all' | CargoType;
const EMPTY_ORDERS: Order[] = [];
const fieldClassName =
    'field-control w-full rounded-xl px-3 py-2 text-sm outline-none';

export default function OrdersPage() {
    const orders = useSyncExternalStore<Order[]>(subscribeOrders, loadOrders, () => EMPTY_ORDERS);
    const [q, setQ] = useState('');
    const [cargo, setCargo] = useState<CargoFilter>('all');

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return orders.filter((o) => {
            const matchesCargo = cargo === 'all' ? true : o.parcel.cargoType === cargo;
            if (!matchesCargo) return false;

            if (!query) return true;

            const byRecipient = o.parcel.recipientName.toLowerCase().includes(query);
            const byCityTo = o.parcel.cityTo.toLowerCase().includes(query);
            return byRecipient || byCityTo;
        });
    }, [orders, q, cargo]);

    function onChangeQuery(e: React.ChangeEvent<HTMLInputElement>) {
        setQ(e.target.value);
    }

    function onChangeCargo(e: React.ChangeEvent<HTMLSelectElement>) {
        setCargo(e.target.value as CargoFilter);
    }

    function openDeleteDialog(id: string) {
        setDeleteId(id);
    }

    function closeDeleteDialog() {
        setDeleteId(null);
    }

    function confirmDelete() {
        if (!deleteId) return;
        deleteOrderFromStorage(deleteId);
    }

    return (
        <main className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-bold">История заявок</h1>
                <Link
                    href="/create"
                    className="btn-primary rounded-xl px-4 py-2 text-sm"
                >
                    Новая заявка
                </Link>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                <input
                    className={`sm:col-span-2 ${fieldClassName}`}
                    placeholder="Поиск: получатель или город назначения…"
                    value={q}
                    onChange={onChangeQuery}
                />
                <select
                    className={fieldClassName}
                    value={cargo}
                    onChange={onChangeCargo}
                >
                    <option value="all">Все типы</option>
                    <option value="documents">Документы</option>
                    <option value="fragile">Хрупкое</option>
                    <option value="regular">Обычное</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="card-surface text-muted rounded-2xl border p-6 text-sm">
                    Заявок нет (или ничего не найдено).
                </div>
            ) : (
                <div className="grid gap-3">
                    {filtered.map((o) => (
                        <OrderCard key={o.id} order={o} onDeleteClick={openDeleteDialog} />
                    ))}
                </div>
            )}

            <Modal
                isOpen={deleteId !== null}
                title="Удалить заявку?"
                description="Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                onConfirm={confirmDelete}
                onClose={closeDeleteDialog}
            />
        </main>
    );
}
