import type { Order } from './types';

const KEY = 'parcel_orders_v1';
const listeners = new Set<() => void>();
const EMPTY_ORDERS: Order[] = [];

let cachedRaw: string | null | undefined;
let cachedOrders: Order[] = EMPTY_ORDERS;

function safeParse(json: string | null): Order[] {
    if (!json) return [];
    try {
        const data = JSON.parse(json) as unknown;
        if (!Array.isArray(data)) return [];
        return data as Order[];
    } catch {
        return [];
    }
}

function emitChange(): void {
    for (const listener of listeners) listener();
}

export function loadOrders(): Order[] {
    if (typeof window === 'undefined') return EMPTY_ORDERS;

    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedOrders;

    cachedRaw = raw;
    cachedOrders = safeParse(raw);
    return cachedOrders;
}

export function saveOrders(orders: Order[]): void {
    const next = [...orders];
    const raw = JSON.stringify(next);

    window.localStorage.setItem(KEY, raw);
    cachedRaw = raw;
    cachedOrders = next;
    emitChange();
}

export function addOrder(order: Order): void {
    const current = loadOrders();
    saveOrders([order, ...current]);
}

export function deleteOrder(id: string): void {
    const current = loadOrders();
    saveOrders(current.filter((o) => o.id !== id));
}

export function getOrder(id: string): Order | null {
    const current = loadOrders();
    return current.find((o) => o.id === id) ?? null;
}

export function subscribeOrders(onStoreChange: () => void): () => void {
    listeners.add(onStoreChange);

    if (typeof window === 'undefined') {
        return () => {
            listeners.delete(onStoreChange);
        };
    }

    function handleStorage(e: StorageEvent) {
        if (e.key === KEY) onStoreChange();
    }

    window.addEventListener('storage', handleStorage);

    return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener('storage', handleStorage);
    };
}
