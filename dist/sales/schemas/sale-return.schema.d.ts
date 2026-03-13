import { Document, Types } from 'mongoose';
export type SaleReturnDocument = SaleReturn & Document;
export declare class ReturnItem {
    medicine: Types.ObjectId;
    inventory: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    reason?: string;
}
export declare class SaleReturn {
    returnNumber: string;
    originalSale: Types.ObjectId;
    user: Types.ObjectId;
    returnDate: Date;
    items: ReturnItem[];
    totalAmount: number;
    returnType: string;
    reason?: string;
    status: string;
    notes?: string;
}
export declare const SaleReturnSchema: import("mongoose").Schema<SaleReturn, import("mongoose").Model<SaleReturn, any, any, any, Document<unknown, any, SaleReturn, any, {}> & SaleReturn & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SaleReturn, Document<unknown, {}, import("mongoose").FlatRecord<SaleReturn>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SaleReturn> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
