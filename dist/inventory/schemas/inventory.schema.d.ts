import { Document, Types } from 'mongoose';
export type InventoryDocument = Inventory & Document;
export declare class Inventory {
    medicine?: Types.ObjectId;
    medicineName?: string;
    user: Types.ObjectId;
    batchNumber: string;
    expiryDate: Date;
    manufactureDate: Date;
    quantity: number;
    soldQuantity: number;
    damagedQuantity: number;
    purchasePrice: number;
    sellingPrice: number;
    mrp?: number;
    supplier?: string;
    supplierInvoiceNumber?: string;
    purchaseDate?: Date;
    rackNumber?: string;
    shelfNumber?: string;
    reorderLevel: number;
    expiryAlertDays: number;
    status: string;
    isActive: boolean;
    notes?: string;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, Document<unknown, any, Inventory, any, {}> & Inventory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, import("mongoose").FlatRecord<Inventory>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Inventory> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
