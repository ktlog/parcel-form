'use client';

import Link from 'next/link';
import { use, useCallback, useSyncExternalStore } from 'react';
import type { Order } from '@/lib/types';
import { cargoLabel, formatDate } from '@/lib/format';
import { getOrder, subscribeOrders } from '@/lib/storage';

type Props = {
    params: Promise<{ id: string }>;
};

export default function OrderDetailsPage({ params }: Props) {
    const { id } = use(params);
    const getOrderSnapshot = useCallback(() => getOrder(id), [id]);
    const order = useSyncExternalStore<Order | null>(subscribeOrders, getOrderSnapshot, () => null);

    if (!order) {
        return (
            <main className="space-y-3">
                <Link href="/orders" className="text-subtle text-sm hover:underline">
                    ← Назад
                </Link>
                <div className="card-surface text-muted rounded-2xl border p-6 text-sm">
                    Заявка не найдена.
                </div>
            </main>
        );
    }

    return (
        <main className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <Link href="/orders" className="text-subtle text-sm hover:underline">
                    ← Назад
                </Link>
                <div className="text-subtle text-xs">{formatDate(order.createdAt)}</div>
            </div>

            <h1 className="text-xl font-bold">
                {order.sender.cityFrom} → {order.parcel.cityTo}
            </h1>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="card-surface rounded-2xl border p-5">
                    <div className="text-sm font-semibold">Отправитель</div>
                    <div className="mt-2 text-sm text-zinc-700">
                        <div className="text-zinc-900">{order.sender.name}</div>
                        <div>{order.sender.phone}</div>
                        <div>{order.sender.cityFrom}</div>
                    </div>
                </div>

                <div className="card-surface rounded-2xl border p-5">
                    <div className="text-sm font-semibold">Получатель и посылка</div>
                    <div className="mt-2 text-sm text-zinc-700">
                        <div className="text-zinc-900">{order.parcel.recipientName}</div>
                        <div>Город: {order.parcel.cityTo}</div>
                        <div>Тип: {cargoLabel(order.parcel.cargoType)}</div>
                        <div>Вес: {order.parcel.weightKg} кг</div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700">
                Статус: <span className="font-semibold text-zinc-900">{order.status}</span>
            </div>
        </main>
    );
}
