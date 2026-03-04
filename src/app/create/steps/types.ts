import type { OrderDraft } from '@/lib/orderSchema';
import type { CargoType } from '@/lib/types';

export type Step = 1 | 2 | 3;

export type Errors = Partial<Record<keyof OrderDraft, string>>;

export type DraftState = Omit<OrderDraft, 'agree'> & { agree: boolean };

export type Summary = {
    sender: {
        name: string;
        phone: string;
        cityFrom: string;
    };
    parcel: {
        recipientName: string;
        cityTo: string;
        cargoType: CargoType;
        weightKg: number;
    };
};
