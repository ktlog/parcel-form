import type { CargoType } from './types';

export function formatDate(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}

export function cargoLabel(t: CargoType): string {
    if (t === 'documents') return 'Документы';
    if (t === 'fragile') return 'Хрупкое';
    return 'Обычное';
}
