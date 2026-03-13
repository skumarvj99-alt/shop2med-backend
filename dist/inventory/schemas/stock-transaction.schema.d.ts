import { Document, Types } from 'mongoose';
export type StockTransactionDocument = StockTransaction & Document;
export declare class StockTransaction {
    inventory: Types.ObjectId;
    user: Types.ObjectId;
    type: string;
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    reason?: string;
    referenceNumber?: string;
    saleReference?: Types.ObjectId;
    transactionDate: Date;
}
export declare const StockTransactionSchema: import("mongoose").Schema<StockTransaction, import("mongoose").Model<StockTransaction, any, any, any, Document<unknown, any, StockTransaction, any, {}> & StockTransaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockTransaction, Document<unknown, {}, import("mongoose").FlatRecord<StockTransaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<StockTransaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
