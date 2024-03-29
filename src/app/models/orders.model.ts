export interface Orderan {
    key: string;
    profileId: string;
    statusOrder: string;
    timeOrdered: Date;
    totalPrice: string;
    isAccepted: boolean;
    isCompleted: boolean;
    productsOrdered: ProductsOrdered[];
    orderLength?: number;
    opsibayar?: string;
    alasanBatal?: string;
}

export interface ProductsOrdered {
    key: string;
}