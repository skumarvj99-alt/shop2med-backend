import { Document, Types } from 'mongoose';
export type MedicineDocument = Medicine & Document;
export declare class Medicine {
    name: string;
    genericName?: string;
    dosageForm: string;
    strength?: string;
    composition?: string;
    unit: string;
    packSize: string;
    ceilingPrice?: number;
    mrp?: number;
    purchasePrice?: number;
    category: string;
    type: string;
    route: string;
    manufacturer?: string;
    schedule?: string;
    substitutes?: string[];
    sideEffects?: string[];
    hsnCode: string;
    requiresPrescription: boolean;
    searchTerms: string[];
    dataSource: string;
    nlemListed: boolean;
    isActive: boolean;
    createdBy?: Types.ObjectId;
    usageCount: number;
    lastUsed?: Date;
}
export declare const MedicineSchema: import("mongoose").Schema<Medicine, import("mongoose").Model<Medicine, any, any, any, Document<unknown, any, Medicine, any, {}> & Medicine & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Medicine, Document<unknown, {}, import("mongoose").FlatRecord<Medicine>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Medicine> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
