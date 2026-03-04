import Link from 'next/link';
import type { Order } from '@/lib/types';
import { cargoLabel, formatDate } from '@/lib/format';

type Props = {
    order: Order;
    onDeleteClick: (id: string) => void;
};

export function OrderCard({ order, onDeleteClick }: Props) {
    function handleDelete() {
        onDeleteClick(order.id);
    }

    return (
        <div className="card-surface rounded-2xl border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Link
                        href={`/orders/${order.id}`}
                        className="text-on-surface block truncate text-base font-semibold hover:underline"
                    >
                        {order.sender.cityFrom} → {order.parcel.cityTo}
                    </Link>
                    <div className="mt-1 text-sm text-zinc-600">
                        Отправитель: <span className="text-zinc-900">{order.sender.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                        Получатель: <span className="text-zinc-900">{order.parcel.recipientName}</span>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <div className="text-xs text-zinc-500">{formatDate(order.createdAt)}</div>
                    <div className="text-muted mt-1 text-sm">{cargoLabel(order.parcel.cargoType)}</div>
                    <div className="mt-1 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <button
                    type="button"
                    className="btn-outline rounded-xl border px-3 py-1.5 text-sm"
                    onClick={handleDelete}
                >
                    Удалить
                </button>
            </div>
        </div>
    );
}
