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
}

export interface ProductsOrdered {
    key: string;
}