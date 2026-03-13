export declare class CreateOrderItemDto {
    medicine?: string;
    medicineName: string;
    manufacturer?: string;
    strength?: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
}
export declare class CreateOrderDto {
    orderDate?: Date;
    supplierName?: string;
    supplierPhone?: string;
    supplierEmail?: string;
    supplierAddress?: string;
    supplierInvoiceNumber?: string;
    supplierInvoiceDate?: Date;
    items: CreateOrderItemDto[];
    subtotal?: number;
    tax?: number;
    discount?: number;
    shippingCharges?: number;
    expectedDeliveryDate?: Date;
    notes?: string;
}
