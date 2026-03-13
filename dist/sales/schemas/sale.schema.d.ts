import { Document, Types } from 'mongoose';
export type SaleDocument = Sale & Document;
export declare class SaleItem {
    medicine: Types.ObjectId;
    inventory: Types.ObjectId;
    medicineName: string;
    batchNumber?: string;
    type?: string;
    dosageForm?: string;
    quantity: number;
    unitPrice: number;
    mrp?: number;
    discountPercent: number;
    discountAmount: number;
    taxPercent: number;
    taxAmount: number;
    totalAmount: number;
}
export declare class Sale {
    billNumber: string;
    user: Types.ObjectId;
    saleDate: Date;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    doctorName?: string;
    prescriptionNumber?: string;
    items: SaleItem[];
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    shippingCharges: number;
    otherCharges: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    paymentMethod: string;
    paymentStatus: string;
    transactionId?: string;
    status: string;
    isActive: boolean;
    notes?: string;
    cancellationReason?: string;
    cancelledAt?: Date;
}
export declare const SaleSchema: import("mongoose").Schema<Sale, import("mongoose").Model<Sale, any, any, any, Document<unknown, any, Sale, any, {}> & Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, import("mongoose").FlatRecord<Sale>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Sale> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
