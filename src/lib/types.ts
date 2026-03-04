export type CargoType = 'documents' | 'fragile' | 'regular';

export type Sender = {
    name: string;
    phone: string;
    cityFrom: string;
};

export type Parcel = {
    recipientName: string;
    cityTo: string;
    cargoType: CargoType;
    weightKg: number;
};

export type OrderStatus = 'created';

export type Order = {
    id: string;
    createdAt: string; // ISO
    status: OrderStatus;
    sender: Sender;
    parcel: Parcel;
};
