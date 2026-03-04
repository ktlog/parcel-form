import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="space-y-4">
            <h1 className="text-2xl font-bold">Parcel Orders</h1>
            <p className="text-subtle">Оформите заявку на доставку и смотрите историю.</p>

            <div className="flex flex-wrap gap-2">
                <Link href="/create" className="btn-primary rounded-xl px-4 py-2 text-sm">
                    Новая заявка
                </Link>
                <Link href="/orders" className="btn-outline rounded-xl border px-4 py-2 text-sm">
                    История заявок
                </Link>
            </div>
        </main>
    );
}
