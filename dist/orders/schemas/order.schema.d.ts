import { Document, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    medicine?: Types.ObjectId;
    medicineName: string;
    manufacturer?: string;
    strength?: string;
    dosageForm?: string;
    packing?: string;
    packSize?: number;
    quantity: number;
    unitPrice?: number;
    mrp?: number;
    cgst?: number;
    sgst?: number;
    totalPrice?: number;
    isVerified: boolean;
    isMatched: boolean;
}
export declare class Order {
    orderNumber: string;
    user: Types.ObjectId;
    orderDate: Date;
    supplierName?: string;
    supplierPhone?: string;
    supplierEmail?: string;
    supplierAddress?: string;
    supplierInvoiceNumber?: string;
    supplierInvoiceDate?: Date;
    items: OrderItem[];
    originalImageUrl?: string;
    processedImageUrl?: string;
    ocrRawData?: any;
    ocrStatus: string;
    ocrError?: string;
    ocrProcessedAt?: Date;
    subtotal?: number;
    tax?: number;
    discount?: number;
    shippingCharges?: number;
    totalAmount?: number;
    status: string;
    expectedDeliveryDate?: Date;
    receivedDate?: Date;
    paymentStatus: string;
    paidAmount: number;
    paymentReference?: string;
    notes?: string;
    isActive: boolean;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
