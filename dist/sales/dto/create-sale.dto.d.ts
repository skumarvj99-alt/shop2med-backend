export declare class CreateSaleItemDto {
    medicine: string;
    inventory: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxPercent?: number;
}
export declare class CreateSaleDto {
    saleDate?: Date;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    doctorName?: string;
    prescriptionNumber?: string;
    items: CreateSaleItemDto[];
    shippingCharges?: number;
    otherCharges?: number;
    amountPaid: number;
    paymentMethod: string;
    transactionId?: string;
    notes?: string;
}
